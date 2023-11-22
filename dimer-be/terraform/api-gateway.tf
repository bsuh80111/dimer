### API Gateway ###

resource "aws_apigatewayv2_api" "dimer" {
  name          = "DimerApi"
  protocol_type = "HTTP"
  description   = "Request handler for Dimer BE"
}

# POST /user
resource "aws_apigatewayv2_route" "post_user" {
  api_id    = aws_apigatewayv2_api.dimer.id
  route_key = "POST /user"

  target = "integrations/${aws_apigatewayv2_integration.upsert_user_lambda.id}"
}

resource "aws_apigatewayv2_integration" "upsert_user_lambda" {
  api_id = aws_apigatewayv2_api.dimer.id

  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.upsert_user.invoke_arn
  payload_format_version = "2.0"
}

# GET /user
resource "aws_apigatewayv2_route" "get_user" {
  api_id    = aws_apigatewayv2_api.dimer.id
  route_key = "GET /user"

  target = "integrations/${aws_apigatewayv2_integration.get_user_lambda.id}"
}

resource "aws_apigatewayv2_integration" "get_user_lambda" {
  api_id = aws_apigatewayv2_api.dimer.id

  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_user.invoke_arn
  payload_format_version = "2.0"
}

# Test Stage
resource "aws_apigatewayv2_stage" "test" {
  api_id      = aws_apigatewayv2_api.dimer.id
  name        = "test"
  auto_deploy = true
}

# Deployment
resource "aws_apigatewayv2_deployment" "dimer" {
  api_id      = aws_apigatewayv2_api.dimer.id
  description = "Dimer API deployment"

  lifecycle {
    create_before_destroy = true
  }
}

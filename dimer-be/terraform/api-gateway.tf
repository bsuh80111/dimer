### API Gateway ###

resource "aws_apigatewayv2_api" "dimer" {
  name          = "DimerApi"
  protocol_type = "HTTP"
  description   = "Request handler for Dimer BE"
  cors_configuration {
    allow_credentials = false
    allow_headers     = ["Content-Type"]
    allow_methods     = ["GET", "POST", "DELETE", "OPTIONS"]
    allow_origins     = ["http://localhost:5173"]
    expose_headers    = []
    max_age           = 0
  }
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

# DELETE /user/{id}
resource "aws_apigatewayv2_route" "delete_user" {
  api_id    = aws_apigatewayv2_api.dimer.id
  route_key = "DELETE /user/{id}"

  target = "integrations/${aws_apigatewayv2_integration.delete_user_lambda.id}"
}

resource "aws_apigatewayv2_integration" "delete_user_lambda" {
  api_id = aws_apigatewayv2_api.dimer.id

  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.delete_user.invoke_arn
  payload_format_version = "2.0"
}

# Test Stage
resource "aws_apigatewayv2_stage" "test" {
  api_id      = aws_apigatewayv2_api.dimer.id
  name        = "test"
  auto_deploy = true
  access_log_settings {
    destination_arn = "arn:aws:logs:us-east-1:876131004963:log-group:/aws/api-gateway/dimer"
    format = jsonencode(
      {
        httpMethod     = "$context.httpMethod"
        ip             = "$context.identity.sourceIp"
        protocol       = "$context.protocol"
        requestId      = "$context.requestId"
        requestTime    = "$context.requestTime"
        responseLength = "$context.responseLength"
        routeKey       = "$context.routeKey"
        status         = "$context.status"
      }
    )
  }
}

# Deployment
resource "aws_apigatewayv2_deployment" "dimer" {
  api_id      = aws_apigatewayv2_api.dimer.id
  description = "Dimer API deployment"

  lifecycle {
    create_before_destroy = true
  }
}

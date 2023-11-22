### Lambdas ###

data "archive_file" "upsert-user-zip" {
  source_file = "../dist/upsert-user/index.js"
  output_path = "../dist/upsert-user/upsert-user.zip"
  type        = "zip"
}

resource "aws_lambda_function" "upsert_user" {
  function_name    = "dimer-upsert-user"
  role             = aws_iam_role.dimer_lambda.arn
  runtime          = "nodejs20.x"
  handler          = "lambdas/upsert-user/index.handler"
  filename         = data.archive_file.upsert-user-zip.output_path
  source_code_hash = data.archive_file.upsert-user-zip.output_base64sha256
}

# Allow invokations from API Gateway
resource "aws_lambda_permission" "api_gateway_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.upsert_user.function_name
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_apigatewayv2_api.dimer.execution_arn}/*/*"
}

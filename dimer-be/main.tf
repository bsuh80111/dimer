terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      # version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "us-east-1"
  profile = "default" # Reads default profile from the ~/.aws/credentials file
}


### Policies ###
resource "aws_iam_policy" "dynamodb_lambda" {
  name = "dynamodb_lambda"
  policy = jsonencode({
    Version : "2012-10-17",
    Statement : [
      {
        Effect : "Allow",
        Action : [
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:ConditionCheckItem",
          "dynamodb:PutItem",
          "dynamodb:DescribeTable",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:UpdateItem"
        ],
        Resource : "${aws_dynamodb_table.dimer_users.arn}"
      }
    ]
  })
}


### Roles ###
resource "aws_iam_role" "dimer_lambda" {
  name = "dimer_lambda"
  assume_role_policy = jsonencode({
    Version : "2012-10-17",
    Statement : [
      {
        Effect : "Allow",
        Principal : {
          Service : "lambda.amazonaws.com"
        },
        Action : "sts:AssumeRole"
      }
    ]
  })
}


### Role Policy Attachments ###

# Basic Lambda Execution
resource "aws_iam_role_policy_attachment" "dimer_lambda_basic_lambda_policy" {
  role       = aws_iam_role.dimer_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda DynamoDB CRUD Operations
resource "aws_iam_role_policy_attachment" "dimer_lambda_dynamodb_lambda_policy" {
  role       = aws_iam_role.dimer_lambda.name
  policy_arn = aws_iam_policy.dynamodb_lambda.arn
}


### DynamoDB ###
resource "aws_dynamodb_table" "dimer_users" {
  name           = "DimerUsers"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}


### API Gateway ###
resource "aws_apigatewayv2_api" "dimer" {
  name          = "DimerApi"
  protocol_type = "HTTP"
  description   = "Request handler for Dimer BE"
}

resource "aws_apigatewayv2_route" "post_handler" {
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

resource "aws_apigatewayv2_stage" "test" {
  api_id      = aws_apigatewayv2_api.dimer.id
  name        = "test"
  auto_deploy = true
}

resource "aws_apigatewayv2_deployment" "dimer" {
  api_id      = aws_apigatewayv2_api.dimer.id
  description = "Dimer API deployment"

  lifecycle {
    create_before_destroy = true
  }
}


### Lambdas ###

data "archive_file" "upsert-user-zip" {
  source_file = "dist/upsert-user/index.js"
  output_path = "dist/upsert-user/upsert-user.zip"
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

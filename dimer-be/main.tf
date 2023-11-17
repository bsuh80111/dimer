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
        Resource : "${aws_dynamodb_table.test_terraform_table.arn}"
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
resource "aws_dynamodb_table" "test_terraform_table" {
  name           = "TerraformTest"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "Id"
  range_key      = "Name"

  attribute {
    name = "Id"
    type = "N"
  }

  attribute {
    name = "Name"
    type = "S"
  }
}


### Lambdas ###

data "archive_file" "create-user-zip" {
 source_file = "dist/create-user/index.js"
 output_path = "dist/create-user/create-note.zip"
 type = "zip"
}

resource "aws_lambda_function" "create_user" {
  function_name = "dimer-create-user"
  role = aws_iam_role.dimer_lambda.arn
  runtime = "nodejs20.x"
  handler = "lambdas/create-user/index.handler"
  filename = "dist/create-user/create-note.zip"
  source_code_hash = filebase64sha256("dist/create-user/create-note.zip")
}

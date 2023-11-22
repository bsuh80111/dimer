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

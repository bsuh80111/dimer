### DynamoDB ###

# Users
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

# Metadata
resource "aws_dynamodb_table" "metadata" {
  name           = "Metadata"
  billing_mode   = "PROVISIONED"
  read_capacity  = 10
  write_capacity = 10
  hash_key       = "tableName"

  attribute {
    name = "tableName"
    type = "S"
  }
}

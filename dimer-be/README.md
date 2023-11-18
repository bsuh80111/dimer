# Dimer BE

Dimer will use a serverless backend to handle all database and SNS behaviors. All cloud resources will be managed using Terraform.

## Deployment

1. Ensure that you are in the dimer-be directory
2. Build the lambda packages (compiles and zips lambda functions)

```
$ npm run build
```

3. Preview the changes to be deployed

```
$ npm run preview
```

OR 

```
$ terraform preview
```

4. Deploy the changes

```
$ npm run deploy
```

OR

```
$ terraform apply
```

## Format - Terraform Files

To format Terraform files (.tf), use:

```
$ npm run format.tf
```

OR 

```
$ terraform fmt
```

### Cloud Resources Used

All cloud resources will be provided via AWS:

- DynamoDB
- API Gateway
- Lamdas
- IAM
- Cognito (To-do for auth)
- Route 53?
- Certificate Manager?


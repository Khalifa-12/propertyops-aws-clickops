# PropertyOps ClickOps Build Guide

This document summarises the manual AWS build process used for PropertyOps.

A more detailed step-by-step PDF is also included in this repository:

`PropertyOps_ClickOps_Step_by_Step_Guide.pdf`

## Build Order

The environment was created in the following order:

1. Create the VPC.
2. Create public, private application and private database subnets across two Availability Zones.
3. Create and attach the Internet Gateway.
4. Configure the public route table.
5. Create security groups for the ALB, ECS tasks, RDS and VPC endpoints.
6. Create VPC endpoints for ECR, CloudWatch Logs, Secrets Manager and S3.
7. Create the private ECR repository.
8. Build and push the PropertyOps Docker image.
9. Create the Application Load Balancer and target group.
10. Create the ECS cluster, task definition and Fargate service.
11. Create the RDS PostgreSQL database.
12. Configure Secrets Manager for database credentials.
13. Create the S3 uploads bucket.
14. Configure CloudWatch alarms and SNS notifications.
15. Configure ECS Service Auto Scaling.
16. Validate the application and health endpoints.
17. Capture implementation evidence.
18. Tear down AWS resources after validation.

## Network Layout

VPC:

`10.0.0.0/16`

Public subnets:

- `10.0.0.0/24`
- `10.0.1.0/24`

Private application subnets:

- `10.0.10.0/24`
- `10.0.11.0/24`

Private database subnets:

- `10.0.20.0/24`
- `10.0.21.0/24`

## Application Deployment

The application was containerised using Docker and pushed to:

`propertyops-app`

in Amazon ECR.

The ECS service used AWS Fargate and ran two tasks across private application subnets.

## Validation

The deployment was validated using:

`/`

and:

`/health`

The health endpoint returned:

```json
{
  "status": "ok",
  "service": "propertyops"
}
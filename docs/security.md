
```markdown
# Security Design

PropertyOps used layered security groups to restrict traffic between infrastructure tiers.

## ALB

`propertyops-alb-sg`

- HTTP 80 from `0.0.0.0/0`

## ECS

`propertyops-ecs-sg`

- HTTP 80 only from `propertyops-alb-sg`

## RDS

`propertyops-rds-sg`

- PostgreSQL 5432 only from `propertyops-ecs-sg`

## VPC Endpoints

`propertyops-vpce-sg`

- HTTPS 443 only from `propertyops-ecs-sg`

## Additional Controls

- ECS tasks deployed in private subnets
- RDS deployed in private database subnets
- no public RDS access
- private ECR repository
- Secrets Manager used for database credentials
- S3 public access blocked
- VPC endpoints used for AWS service access
- no credentials stored in GitHub
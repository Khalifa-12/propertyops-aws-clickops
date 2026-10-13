# PropertyOps Teardown

PropertyOps was built as a portfolio lab, so the AWS resources were removed after validation and evidence capture to avoid unnecessary ongoing cost.

## Teardown Order

Resources were removed in a dependency-safe order.

1. Disable and delete CloudFront.
2. Delete the ECS service.
3. Delete the ECS cluster.
4. Delete the Application Load Balancer.
5. Delete the target group.
6. Delete the RDS PostgreSQL database.
7. Delete the RDS subnet group.
8. Delete VPC endpoints.
9. Delete the ECR repository and container images.
10. Empty and delete the S3 bucket.
11. Delete Secrets Manager secrets.
12. Delete CloudWatch alarms and log groups.
13. Delete the SNS topic.
14. Deregister ECS task definition revisions.
15. Delete PropertyOps-specific IAM roles.
16. Delete the unused ACM certificate.
17. Delete PropertyOps security groups.
18. Delete custom route tables.
19. Detach and delete the Internet Gateway.
20. Delete remaining subnets and the VPC.

## Cost Control

The teardown removed the resources most likely to continue generating charges, including:

- ECS Fargate tasks
- Application Load Balancer
- RDS PostgreSQL
- interface VPC endpoints
- CloudFront
- stored ECR images
- S3 objects
- CloudWatch logs

## Preservation

Before teardown, screenshots were captured showing:

- network segmentation
- security group rules
- VPC endpoints
- ECR image
- ECS service health
- target group health
- RDS
- CloudWatch alarms
- Auto Scaling
- application health endpoint

These are stored under:

`docs/evidence/`

The architecture can be rebuilt using the Terraform version of PropertyOps.
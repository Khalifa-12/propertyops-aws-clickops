# PropertyOps CI/CD — reusable delivery design

## What is implemented

- **CI:** On pull requests and relevant main-branch changes, install Node dependencies, check syntax, build an image and smoke-test the running container's `/health` endpoint without AWS credentials.
- **CD (manual/reusable):** A GitHub Actions workflow can authenticate to AWS through short-lived OIDC credentials, publish an image tagged with the Git commit SHA to ECR, reuse the existing ECS task definition, substitute the application image, register a revision and update the ECS service.
- **Approval boundary:** The deployment job uses the `propertyops-production` GitHub Environment. Configure required reviewers (where your GitHub plan supports them) before enabling the role; otherwise keep the AWS deployment role unconfigured until ready. No automatic deployments on pushes.
- **AWS Secrets Manager:** ECS continues to inject database credentials through the **existing task definition**; the pipeline does not handle or print database secrets.

## Setup prerequisites (not automatically configured)

1. In your AWS account, create a dedicated IAM role trusting GitHub's OIDC provider, restricted to your repository and the deployment environment. Never use long-lived IAM access keys in Actions.
2. Give the role only the ECR push, ECS describe/update/register, and task-role `iam:PassRole` permissions needed for the specific resources. Restrict the `iam:PassRole` role ARNs.
3. In GitHub Settings → Environments, create `propertyops-production` and configure deployment approval/restrictions as supported by your plan.
4. Add the **environment secret** `AWS_DEPLOY_ROLE_ARN`, whose value is your dedicated IAM role ARN (not an access key).
5. Confirm that the existing ECR repository, ECS cluster, service and container names match the manual-dispatch inputs, and that the application image works with the task definition's port/environment/Secrets Manager configuration.
6. Run the CI workflow and verify it succeeds **before** triggering manual deployment.

### Reuse across applications

Another app repository can call the reusable workflow at a **pinned commit SHA** and pass its own `docker_context`, ECR repo, ECS cluster, service and container. The calling repo must provide `AWS_DEPLOY_ROLE_ARN` via a secret, use an approved environment and ensure the AWS role trust policy authorises that repo. This workflow assumes each ECS service already exists.

Example shape (pin to a reviewed SHA instead of a moving branch):

```yaml
jobs:
  deploy:
    uses: Khalifa-12/propertyops-aws-clickops/.github/workflows/ecs-deploy.yml@<PINNED_COMMIT_SHA>
    with:
      aws_region: eu-west-2
      docker_context: ./application
      ecr_repository: propertyops-app
      ecs_cluster: propertyops-cluster
      ecs_service: propertyops-service
      ecs_container: propertyops-container
    secrets:
      AWS_DEPLOY_ROLE_ARN: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
```

## Important limitations

This PR adds **pipeline code**, not an already running production pipeline. It does not create AWS IAM roles, apply Terraform, configure GitHub Environment approval, trigger an ECS deployment or verify a live rollout. Current Terraform CI is a separate workflow in the Terraform repository. More production hardening is needed before broad organisational reuse: pinned third-party actions, vulnerability gating, integration tests, TLS to origin and deployment rollback policies.

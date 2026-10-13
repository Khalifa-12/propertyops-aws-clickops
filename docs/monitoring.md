# Monitoring and Auto Scaling

PropertyOps used Amazon CloudWatch to monitor the ECS service, Application Load Balancer and RDS database.

## CloudWatch Alarms

The following alarms were configured:

- ECS CPU utilisation high
- ECS memory utilisation high
- ALB HTTP 5XX errors
- unhealthy target count
- RDS CPU utilisation high
- RDS free storage space low

Amazon SNS was connected to CloudWatch so alarm state changes could trigger notifications.

## ECS Service Auto Scaling

ECS Service Auto Scaling was configured with a target tracking policy.

### Scaling Configuration

Minimum tasks:

`2`

Maximum tasks:

`4`

Metric:

`ECSServiceAverageCPUUtilization`

Target utilisation:

`60%`

This allowed ECS to increase or reduce the number of running tasks based on average service CPU utilisation.

## Health Monitoring

The ECS service was connected to an Application Load Balancer target group.

Application health was validated using:

`/health`

Healthy response:

```json
{
  "status": "ok",
  "service": "propertyops"
}
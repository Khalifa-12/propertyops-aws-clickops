# PropertyOps Architecture

PropertyOps was manually deployed in AWS using a multi-tier VPC architecture.

## Region

`eu-west-2` — Europe (London)

## VPC

`10.0.0.0/16`

## Subnets

| Tier | Availability Zone | CIDR |
|---|---|---|
| Public | eu-west-2a | `10.0.0.0/24` |
| Public | eu-west-2b | `10.0.1.0/24` |
| Private App | eu-west-2a | `10.0.10.0/24` |
| Private App | eu-west-2b | `10.0.11.0/24` |
| Private DB | eu-west-2a | `10.0.20.0/24` |
| Private DB | eu-west-2b | `10.0.21.0/24` |

## Traffic Flow

```text
Internet
   ↓
Application Load Balancer
   ↓
ECS Fargate
   ↓
RDS PostgreSQL
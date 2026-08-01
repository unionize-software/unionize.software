## Terraform (unionize.software)

This folder contains Terraform configuration to host:

- `www.unionize.software`: static site on S3 + CloudFront
- `unionize.software`: redirect to `www`
- `api.unionize.software`: intake API on API Gateway + Lambda + WAF
- Encrypted intake storage on DynamoDB (metadata + TTL) + optional S3 (ciphertext blob)

### Layout

- `bootstrap/`: one-time backend bootstrap (creates Terraform remote state bucket + lock table)
- `main/`: primary infrastructure (uses the remote backend)

### Workflow

1) Bootstrap the remote backend:

```bash
cd infra/terraform/bootstrap
terraform init
terraform apply
```

2) Deploy main infrastructure:

```bash
cd ../main
terraform init
terraform apply
```

### Notes

- The bootstrap stack uses local state by default. After the bucket/table exist, the `main` stack uses the remote backend.
- Certificates for CloudFront must be in `us-east-1`.

variable "aws_region" {
  type        = string
  description = "Primary AWS region for resources (non-CloudFront certs can still be us-east-1)."
  default     = "us-east-1"
}

variable "route53_zone_id" {
  type        = string
  description = "Public Route53 hosted zone id for unionize.software"
  default     = "Z029085126NH83NPO7XMO"
}

variable "domain_root" {
  type        = string
  description = "Root domain"
  default     = "unionize.software"
}

variable "domain_www" {
  type        = string
  description = "WWW hostname"
  default     = "www.unionize.software"
}

variable "domain_api" {
  type        = string
  description = "API hostname"
  default     = "api.unionize.software"
}

variable "ciphertext_bucket_name" {
  type        = string
  description = "Optional S3 bucket to store ciphertext objects."
  default     = "unionize-software-intake-ciphertext-319933937176"
}

variable "intake_table_name" {
  type        = string
  description = "DynamoDB table for intake metadata (TTL enabled)."
  default     = "unionize-software-encrypted-intakes"
}

variable "intake_public_key_id" {
  type        = string
  description = "Lambda rejects public_key_id mismatches (same as NEXT_PUBLIC_INTAKE_PUBLIC_KEY_ID). Override per env via tfvars."
  default     = "default-2026-04"
}

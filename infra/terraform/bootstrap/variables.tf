variable "aws_region" {
  type        = string
  description = "AWS region for backend resources."
  default     = "us-east-1"
}

variable "state_bucket_name" {
  type        = string
  description = "S3 bucket name for Terraform remote state."
  default     = "unionize-software-terraform-state-319933937176"
}

variable "lock_table_name" {
  type        = string
  description = "DynamoDB table name for Terraform state locking."
  default     = "unionize-software-terraform-lock"
}

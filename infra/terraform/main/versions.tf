terraform {
  required_version = ">= 1.6.0"

  backend "s3" {
    bucket         = "unionize-software-terraform-state-319933937176"
    key            = "unionize/prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "unionize-software-terraform-lock"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0.0"
    }
  }
}

provider "aws" {
  region                      = var.aws_region
  skip_credentials_validation = var.skip_aws_credentials_validation
  skip_metadata_api_check     = var.skip_aws_credentials_validation
  skip_requesting_account_id  = var.skip_aws_credentials_validation
}

provider "aws" {
  alias                       = "us_east_1"
  region                      = "us-east-1"
  skip_credentials_validation = var.skip_aws_credentials_validation
  skip_metadata_api_check     = var.skip_aws_credentials_validation
  skip_requesting_account_id  = var.skip_aws_credentials_validation
}

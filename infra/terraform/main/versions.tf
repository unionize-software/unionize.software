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
  region = var.aws_region
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

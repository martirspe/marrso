terraform {
  required_version = ">= 1.10"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.0" }
  }
  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = { app = "marrso", environment = "prod", managed-by = "terraform" }
  }
}

data "aws_caller_identity" "current" {}

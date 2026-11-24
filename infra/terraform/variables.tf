variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "email_domain" {
  type    = string
  default = "marrso.com"
}

variable "from_email" {
  type    = string
  default = "contacto@marrso.com"
}

variable "alerts_email" {
  type = string
}

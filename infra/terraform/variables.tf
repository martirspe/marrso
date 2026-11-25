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
  default = "notificaciones@marrso.com"
}

variable "alerts_email" {
  type = string
}

variable "cloudflare_zone_id" {
  description = "ID de la zona marrso.com en Cloudflare. El token se entrega por CLOUDFLARE_API_TOKEN, nunca por tfvars."
  type        = string
}

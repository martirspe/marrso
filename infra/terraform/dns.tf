locals {
  mail_from_domain = "bounce.${var.email_domain}"
  dkim_tokens      = aws_sesv2_email_identity.domain.dkim_signing_attributes[0].tokens
}

resource "cloudflare_dns_record" "ses_dkim" {
  count   = 3
  zone_id = var.cloudflare_zone_id
  name    = "${local.dkim_tokens[count.index]}._domainkey.${var.email_domain}"
  type    = "CNAME"
  content = "${local.dkim_tokens[count.index]}.dkim.amazonses.com"
  ttl     = 1
  proxied = false
}

resource "cloudflare_dns_record" "mail_from_mx" {
  zone_id  = var.cloudflare_zone_id
  name     = local.mail_from_domain
  type     = "MX"
  content  = "feedback-smtp.${var.aws_region}.amazonses.com"
  priority = 10
  ttl      = 1
}

resource "cloudflare_dns_record" "mail_from_spf" {
  zone_id = var.cloudflare_zone_id
  name    = local.mail_from_domain
  type    = "TXT"
  content = "\"v=spf1 include:amazonses.com ~all\""
  ttl     = 1
}

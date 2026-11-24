output "web_iam_user" { value = aws_iam_user.web.name }
output "ses_configuration_set" { value = aws_sesv2_configuration_set.contact.configuration_set_name }
output "alerts_topic_arn" { value = aws_sns_topic.email_alerts.arn }
output "server_env" {
  value = join("\n", [
    "AWS_REGION=${var.aws_region}",
    "CONTACT_FROM_EMAIL=${var.from_email}",
    "SES_CONFIGURATION_SET=${aws_sesv2_configuration_set.contact.configuration_set_name}",
  ])
}

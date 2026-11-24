resource "aws_sesv2_configuration_set" "contact" {
  configuration_set_name = "marrso-prod-contact"
  delivery_options { tls_policy = "REQUIRE" }
  reputation_options { reputation_metrics_enabled = true }
  sending_options { sending_enabled = true }
  suppression_options { suppressed_reasons = ["BOUNCE", "COMPLAINT"] }
}

resource "aws_sesv2_email_identity" "domain" {
  email_identity         = var.email_domain
  configuration_set_name = aws_sesv2_configuration_set.contact.configuration_set_name
  dkim_signing_attributes { next_signing_key_length = "RSA_2048_BIT" }
}

resource "aws_sesv2_email_identity_mail_from_attributes" "domain" {
  email_identity         = aws_sesv2_email_identity.domain.email_identity
  mail_from_domain       = "bounce.${var.email_domain}"
  behavior_on_mx_failure = "REJECT_MESSAGE"
}

resource "aws_sns_topic" "email_alerts" { name = "marrso-prod-email-alerts" }

data "aws_iam_policy_document" "email_alerts" {
  statement {
    sid       = "AllowSesEvents"
    actions   = ["sns:Publish"]
    resources = [aws_sns_topic.email_alerts.arn]
    principals {
      type        = "Service"
      identifiers = ["ses.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
  statement {
    sid       = "AllowCloudWatchAlarms"
    actions   = ["sns:Publish"]
    resources = [aws_sns_topic.email_alerts.arn]
    principals {
      type        = "Service"
      identifiers = ["cloudwatch.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}

resource "aws_sns_topic_policy" "email_alerts" {
  arn    = aws_sns_topic.email_alerts.arn
  policy = data.aws_iam_policy_document.email_alerts.json
}

resource "aws_sns_topic_subscription" "email_alerts" {
  topic_arn = aws_sns_topic.email_alerts.arn
  protocol  = "email"
  endpoint  = var.alerts_email
}

resource "aws_sesv2_configuration_set_event_destination" "alerts" {
  configuration_set_name = aws_sesv2_configuration_set.contact.configuration_set_name
  event_destination_name = "delivery-problems"
  event_destination {
    enabled              = true
    matching_event_types = ["BOUNCE", "COMPLAINT", "REJECT", "RENDERING_FAILURE", "DELIVERY_DELAY"]
    sns_destination { topic_arn = aws_sns_topic.email_alerts.arn }
  }
  depends_on = [aws_sns_topic_policy.email_alerts]
}

resource "aws_cloudwatch_metric_alarm" "bounce_rate" {
  alarm_name          = "marrso-prod-ses-bounce-rate"
  namespace           = "AWS/SES"
  metric_name         = "Reputation.BounceRate"
  statistic           = "Maximum"
  period              = 3600
  evaluation_periods  = 1
  threshold           = 0.04
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.email_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "complaint_rate" {
  alarm_name          = "marrso-prod-ses-complaint-rate"
  namespace           = "AWS/SES"
  metric_name         = "Reputation.ComplaintRate"
  statistic           = "Maximum"
  period              = 3600
  evaluation_periods  = 1
  threshold           = 0.0008
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.email_alerts.arn]
}

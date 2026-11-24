resource "aws_iam_user" "web" { name = "marrso-prod-web" }

data "aws_iam_policy_document" "web" {
  statement {
    actions = ["ses:SendEmail"]
    resources = [
      aws_sesv2_email_identity.domain.arn,
      aws_sesv2_configuration_set.contact.arn,
    ]
    condition {
      test     = "StringEquals"
      variable = "ses:FromAddress"
      values   = [var.from_email]
    }
  }
}

resource "aws_iam_policy" "web" {
  name   = "marrso-prod-web-ses"
  policy = data.aws_iam_policy_document.web.json
}

resource "aws_iam_user_policy_attachment" "web" {
  user       = aws_iam_user.web.name
  policy_arn = aws_iam_policy.web.arn
}

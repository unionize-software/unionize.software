locals {
  intake_lambda_name = "unionize-intake"
}

resource "aws_iam_role" "intake_lambda" {
  name = "unionize-intake-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "lambda.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "intake_lambda_basic" {
  role       = aws_iam_role.intake_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "intake_storage" {
  name = "unionize-intake-storage"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["dynamodb:PutItem"]
        Resource = aws_dynamodb_table.intakes.arn
      },
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject"]
        Resource = "${aws_s3_bucket.ciphertext.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "intake_storage" {
  role       = aws_iam_role.intake_lambda.name
  policy_arn = aws_iam_policy.intake_storage.arn
}

resource "aws_lambda_function" "intake" {
  function_name = local.intake_lambda_name
  role          = aws_iam_role.intake_lambda.arn
  runtime       = "nodejs22.x"
  handler       = "handler.handler"

  filename         = "${path.module}/../../lambda/intake/dist.zip"
  source_code_hash = filebase64sha256("${path.module}/../../lambda/intake/dist.zip")

  timeout     = 10
  memory_size = 256

  environment {
    variables = {
      INTAKE_TABLE_NAME        = aws_dynamodb_table.intakes.name
      CIPHERTEXT_BUCKET_NAME   = aws_s3_bucket.ciphertext.bucket
      ALLOWED_ORIGINS          = "https://${var.domain_www}"
      INTAKE_TTL_DAYS          = "30"
      CONFIGURED_PUBLIC_KEY_ID = var.intake_public_key_id
      MAX_INTAKE_REQUEST_BYTES = "16384"
    }
  }
}

resource "aws_apigatewayv2_api" "api" {
  name          = "unionize-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "intake" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.intake.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "intake" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /intake"
  target    = "integrations/${aws_apigatewayv2_integration.intake.id}"
}

resource "aws_apigatewayv2_route" "intake_options" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "OPTIONS /intake"
  target    = "integrations/${aws_apigatewayv2_integration.intake.id}"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 20
    throttling_rate_limit  = 5
  }
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.intake.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_acm_certificate" "api" {
  provider          = aws.us_east_1
  domain_name       = var.domain_api
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "api_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.api.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = var.route53_zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 300
  records = [each.value.record]
}

resource "aws_acm_certificate_validation" "api" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.api.arn
  validation_record_fqdns = [for r in aws_route53_record.api_cert_validation : r.fqdn]
}

resource "aws_apigatewayv2_domain_name" "api" {
  domain_name = var.domain_api

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.api.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "api" {
  api_id      = aws_apigatewayv2_api.api.id
  domain_name = aws_apigatewayv2_domain_name.api.id
  stage       = aws_apigatewayv2_stage.prod.id
}

resource "aws_route53_record" "api_a" {
  zone_id = var.route53_zone_id
  name    = var.domain_api
  type    = "A"

  alias {
    name                   = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "api_aaaa" {
  zone_id = var.route53_zone_id
  name    = var.domain_api
  type    = "AAAA"

  alias {
    name                   = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_s3_bucket" "root_redirect" {
  bucket = "unionize-software-root-redirect-319933937176"
}

resource "aws_s3_bucket_public_access_block" "root_redirect" {
  bucket                  = aws_s3_bucket.root_redirect.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "root_redirect" {
  bucket = aws_s3_bucket.root_redirect.id

  redirect_all_requests_to {
    host_name = var.domain_www
    protocol  = "https"
  }
}

resource "aws_acm_certificate" "apex" {
  provider          = aws.us_east_1
  domain_name       = var.domain_root
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "apex_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.apex.domain_validation_options : dvo.domain_name => {
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

resource "aws_acm_certificate_validation" "apex" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.apex.arn
  validation_record_fqdns = [for r in aws_route53_record.apex_cert_validation : r.fqdn]
}

resource "aws_cloudfront_distribution" "apex_redirect" {
  enabled         = true
  is_ipv6_enabled = true
  comment         = "unionize.software apex redirect to www"
  aliases         = [var.domain_root]

  origin {
    domain_name = aws_s3_bucket_website_configuration.root_redirect.website_endpoint
    origin_id   = "rootRedirectOrigin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "rootRedirectOrigin"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id = data.aws_cloudfront_cache_policy.caching_disabled.id
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.apex.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

resource "aws_route53_record" "apex_a" {
  zone_id = var.route53_zone_id
  name    = var.domain_root
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.apex_redirect.domain_name
    zone_id                = aws_cloudfront_distribution.apex_redirect.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "apex_aaaa" {
  zone_id = var.route53_zone_id
  name    = var.domain_root
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.apex_redirect.domain_name
    zone_id                = aws_cloudfront_distribution.apex_redirect.hosted_zone_id
    evaluate_target_health = false
  }
}

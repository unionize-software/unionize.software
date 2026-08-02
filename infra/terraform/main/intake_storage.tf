resource "aws_dynamodb_table" "intakes" {
  name         = var.intake_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "expires_at_epoch"
    enabled        = true
  }
}

resource "aws_s3_bucket" "ciphertext" {
  bucket = var.ciphertext_bucket_name
}

resource "aws_s3_bucket_public_access_block" "ciphertext" {
  bucket                  = aws_s3_bucket.ciphertext.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "ciphertext" {
  bucket = aws_s3_bucket.ciphertext.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "ciphertext" {
  bucket = aws_s3_bucket.ciphertext.id

  rule {
    id     = "expire_ciphertext"
    status = "Enabled"

    expiration {
      days = 60
    }
  }
}

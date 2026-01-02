Below is a copy-pasteable starter project that creates:
	•	A Python Lambda
	•	A public API Gateway HTTP API route (no authorizer)
	•	Lambda permission so API Gateway can invoke it
	•	Output: public invoke URL
	•	Optional: attach a custom domain and create a Route53 A/AAAA alias (since you said you already have Route53)

⸻

Project structure

lambda-httpapi-terraform/
├── lambda/
│   ├── app.py
│   └── requirements.txt
└── terraform/
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── versions.tf


⸻

1) Lambda code (Python)

lambda/app.py

import json

def handler(event, context):
    # event is the API Gateway HTTP API v2 event
    return {
        "statusCode": 200,
        "headers": {"content-type": "application/json"},
        "body": json.dumps({
            "message": "Hello from Lambda behind API Gateway (public, no authorizer)!",
            "requestContext": event.get("requestContext", {}),
            "path": event.get("rawPath"),
            "method": event.get("requestContext", {}).get("http", {}).get("method")
        })
    }

lambda/requirements.txt

# keep empty for this sample (no external deps)


⸻

2) Terraform (creates Lambda + HTTP API)

terraform/versions.tf

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.4"
    }
  }
}

terraform/variables.tf

variable "project_name" {
  type        = string
  default     = "sample-lambda-httpapi"
  description = "Name prefix for resources."
}

variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region."
}

# ---- Optional custom domain support ----
variable "enable_custom_domain" {
  type        = bool
  default     = false
  description = "If true, attaches a custom domain + Route53 alias record."
}

variable "hosted_zone_name" {
  type        = string
  default     = ""
  description = "Existing Route53 hosted zone name, e.g. example.com. (required if enable_custom_domain=true)"
}

variable "api_subdomain" {
  type        = string
  default     = "api"
  description = "Subdomain to use, e.g. 'api' => api.example.com (required if enable_custom_domain=true)"
}

variable "acm_certificate_arn" {
  type        = string
  default     = ""
  description = "ACM cert ARN for the custom domain (must be in same region for HTTP API; for edge-optimized this differs). Required if enable_custom_domain=true"
}

terraform/main.tf

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

locals {
  lambda_name = "${var.project_name}-fn"
  api_name    = "${var.project_name}-httpapi"
}

# Zip the lambda directory
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda"
  output_path = "${path.module}/build/lambda.zip"
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "lambda.amazonaws.com" },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "fn" {
  function_name = local.lambda_name
  role          = aws_iam_role.lambda_role.arn
  runtime       = "python3.12"
  handler       = "app.handler"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  timeout = 10
  memory_size = 128
}

# HTTP API (API Gateway v2)
resource "aws_apigatewayv2_api" "http_api" {
  name          = local.api_name
  protocol_type = "HTTP"

  # Optional CORS - good for browser calls
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["*"]
  }
}

# Lambda proxy integration
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.fn.invoke_arn
  payload_format_version = "2.0"
}

# Public route - no authorizer (default is NONE)
resource "aws_apigatewayv2_route" "public_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /hello"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Auto-deployed default stage => instantly public
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

# Allow API Gateway to invoke Lambda
resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.fn.function_name
  principal     = "apigateway.amazonaws.com"

  # For HTTP API v2, execution ARN looks like:
  # arn:aws:execute-api:{region}:{account}:{apiId}
  source_arn = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# -------------------------
# OPTIONAL: Custom domain + Route53 record
# -------------------------
# Uses existing hosted zone and existing ACM certificate.

data "aws_route53_zone" "zone" {
  count = var.enable_custom_domain ? 1 : 0
  name  = var.hosted_zone_name
}

locals {
  full_domain = var.enable_custom_domain ? "${var.api_subdomain}.${trim(var.hosted_zone_name, ".")}" : ""
}

resource "aws_apigatewayv2_domain_name" "custom" {
  count = var.enable_custom_domain ? 1 : 0

  domain_name = local.full_domain

  domain_name_configuration {
    certificate_arn = var.acm_certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "mapping" {
  count = var.enable_custom_domain ? 1 : 0

  api_id      = aws_apigatewayv2_api.http_api.id
  domain_name = aws_apigatewayv2_domain_name.custom[0].id
  stage       = aws_apigatewayv2_stage.default.id

  # maps root of domain to API. If you want /v1, set api_mapping_key="v1"
}

resource "aws_route53_record" "api_alias_a" {
  count   = var.enable_custom_domain ? 1 : 0
  zone_id = data.aws_route53_zone.zone[0].zone_id
  name    = local.full_domain
  type    = "A"

  alias {
    name                   = aws_apigatewayv2_domain_name.custom[0].domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.custom[0].domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "api_alias_aaaa" {
  count   = var.enable_custom_domain ? 1 : 0
  zone_id = data.aws_route53_zone.zone[0].zone_id
  name    = local.full_domain
  type    = "AAAA"

  alias {
    name                   = aws_apigatewayv2_domain_name.custom[0].domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.custom[0].domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}

terraform/outputs.tf

output "api_invoke_url" {
  value       = aws_apigatewayv2_api.http_api.api_endpoint
  description = "Base invoke URL (no custom domain). Call: {api_invoke_url}/hello"
}

output "hello_url" {
  value       = "${aws_apigatewayv2_api.http_api.api_endpoint}/hello"
  description = "Direct public endpoint for GET /hello"
}

output "custom_domain_url" {
  value       = var.enable_custom_domain ? "https://${var.api_subdomain}.${trim(var.hosted_zone_name, ".")}/hello" : ""
  description = "If enabled, the custom domain URL to test."
}


⸻

3) How to run

From the project root:

cd terraform
terraform init
terraform apply

Test:

curl "$(terraform output -raw hello_url)"

If you want custom domain + Route53 record:

terraform apply \
  -var="enable_custom_domain=true" \
  -var="hosted_zone_name=example.com" \
  -var="api_subdomain=api" \
  -var="acm_certificate_arn=arn:aws:acm:us-east-1:123456789012:certificate/xxxx"

Then test:

curl "https://api.example.com/hello"


⸻

Notes (so it works first try)
	•	This uses API Gateway HTTP API (v2), which is the simplest + cheapest option for a public Lambda proxy route.
	•	“No authorizer required” is the default; we do not attach any authorizer.
	•	If you enable the custom domain:
	•	Your ACM cert must cover api.example.com
	•	Hosted zone must already exist in Route53

⸻

If you want, I can also add:
	•	POST /hello with JSON input parsing
	•	CloudWatch log group with retention
	•	A /{proxy+} “catch-all” route
	•	A WAF in front of the API (still no auth, just protection)
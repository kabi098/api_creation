variable "aws_region" {
  description = "AWS region where resources will be created."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix for AWS resources."
  type        = string
  default     = "todo-app"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"
}

variable "image_tag" {
  description = "Docker image tag ECS should deploy from ECR."
  type        = string
  default     = "latest"
}

variable "frontend_desired_count" {
  description = "Number of frontend ECS tasks to run."
  type        = number
  default     = 1
}

variable "backend_desired_count" {
  description = "Number of backend ECS tasks to run."
  type        = number
  default     = 1
}

variable "task_cpu" {
  description = "CPU units for each ECS Fargate task."
  type        = number
  default     = 256
}

variable "task_memory" {
  description = "Memory in MiB for each ECS Fargate task."
  type        = number
  default     = 512
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to reach frontend port 80 and backend port 4000 directly."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

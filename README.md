## Version 2

## Deploy frontend to S3

The GitHub Actions workflow at `.github/workflows/deploy-frontend-s3.yml` builds the React app in `client/` and uploads the production files to:

```text
kabi-terraform-state-bucket
```

Add these GitHub repository secrets before running it:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `REACT_APP_API_BASE_URL` such as `https://your-api-domain.com/api/v1`

The AWS user needs permission for `s3:ListBucket`, `s3:PutObject`, `s3:DeleteObject`, and `s3:PutObjectAcl` is not required by this workflow.

The workflow runs automatically when `client/**` changes on `main`, or manually from the Actions tab with `workflow_dispatch`.

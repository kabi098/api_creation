## Version 2

## Deploy frontend to S3

The GitHub Actions workflow at `.github/workflows/deploy-frontend-s3.yml` builds the React app in `client/` and uploads the production files to:

```text
kabi-terraform-state-bucket
```

Open the app with the S3 **static website endpoint**, not the normal S3 object URL:

```text
http://kabi-terraform-state-bucket.s3-website.ap-south-1.amazonaws.com
```

If you open a URL like `https://kabi-terraform-state-bucket.s3.ap-south-1.amazonaws.com/index.html`, S3 can return `AccessDenied` because that is the bucket object endpoint, not the static website hosting endpoint.

Add these GitHub repository secrets before running it:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `REACT_APP_API_BASE_URL` such as `https://your-api-domain.com/kabi/api/v1`

The AWS user needs permission for `s3:ListBucket`, `s3:PutObject`, `s3:DeleteObject`, `s3:PutBucketWebsite`, `s3:PutBucketPublicAccessBlock`, and `s3:PutBucketPolicy`. `s3:PutObjectAcl` is not required by this workflow.

The workflow runs automatically when `client/**` changes on `main`, or manually from the Actions tab with `workflow_dispatch`.

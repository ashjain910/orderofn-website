# AWS S3 Setup Guide

This guide will help you configure AWS S3 for storing uploaded files (resumes, CVs, cover letters).

## Why S3?

- **Scalable**: Handles unlimited file storage
- **Reliable**: 99.999999999% (11 9's) durability
- **Fast**: CDN integration for quick file access
- **Secure**: Fine-grained access control
- **Cost-effective**: Pay only for what you use

## Setup Steps

### 1. Create an AWS Account

If you don't have one already, sign up at [aws.amazon.com](https://aws.amazon.com)

### 2. Create an S3 Bucket

1. Go to AWS Console > S3
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `tic-uploaded-files`)
4. Select your preferred region (e.g., `us-east-1`)
5. **Block Public Access settings**:
   - Uncheck "Block all public access"
   - Acknowledge the warning (we need public read access for file URLs)
6. Click "Create bucket"

### 3. Configure Bucket CORS

1. Go to your bucket > Permissions > CORS
2. Add this configuration:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [
            "ETag"
        ]
    }
]
```

### 4. Create IAM User

1. Go to AWS Console > IAM > Users
2. Click "Add users"
3. User name: `tic-s3-uploader`
4. Select "Access key - Programmatic access"
5. Click "Next: Permissions"
6. Click "Attach existing policies directly"
7. Search for and select `AmazonS3FullAccess` (or create a custom policy with limited permissions)
8. Click through to "Create user"
9. **IMPORTANT**: Save the Access Key ID and Secret Access Key (you won't see the secret again!)

### 5. Configure Django Settings

1. Copy `.env.example` to `.env` if you haven't already:
   ```bash
   cp .env.example .env
   ```

2. Update your `.env` file with S3 credentials:
   ```
   USE_S3=True
   AWS_ACCESS_KEY_ID=your-actual-access-key-id
   AWS_SECRET_ACCESS_KEY=your-actual-secret-access-key
   AWS_STORAGE_BUCKET_NAME=tic-uploaded-files
   AWS_S3_REGION_NAME=us-east-1
   ```

### 6. Install Dependencies

```bash
pip install -r requirements.txt
```

The required packages are:
- `boto3` - AWS SDK for Python
- `django-storages` - Django storage backends for S3

### 7. Test the Setup

1. Start your Django server:
   ```bash
   python manage.py runserver
   ```

2. Try uploading a file through the API (e.g., update profile with a resume)

3. Check your S3 bucket - the file should appear there

4. The API response should contain a full S3 URL like:
   ```
   https://tic-uploaded-files.s3.amazonaws.com/resumes/filename.pdf
   ```

## Security Best Practices

### Custom IAM Policy (Recommended)

Instead of using `AmazonS3FullAccess`, create a custom policy with minimal permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::tic-uploaded-files/*",
                "arn:aws:s3:::tic-uploaded-files"
            ]
        }
    ]
}
```

### Bucket Policy

Add this bucket policy to allow public read access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::tic-uploaded-files/*"
        }
    ]
}
```

## File Organization

Files are automatically organized by type:
- `/resumes/` - User resume files (from teacher profile)
- `/cvs/` - User CV files (from teacher profile)
- `/cover_letters/` - Cover letter files (from job applications)

## Development vs Production

### Development (Local Storage)
```env
USE_S3=False
```
Files will be stored in `/media/` directory locally.

### Production (S3 Storage)
```env
USE_S3=True
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_STORAGE_BUCKET_NAME=...
```
Files will be uploaded to S3.

## Troubleshooting

### Error: "Unable to locate credentials"
- Check that your AWS credentials are correctly set in `.env`
- Verify the `.env` file is in the backend directory

### Error: "Access Denied"
- Check IAM user has S3 permissions
- Verify bucket policy allows the operations you need

### Files not appearing in bucket
- Check bucket name is correct
- Verify region matches
- Check AWS credentials are valid

### CORS errors
- Verify CORS configuration in S3 bucket
- Make sure allowed origins include your frontend domain

## Cost Estimation

S3 pricing (as of 2024):
- Storage: ~$0.023 per GB/month
- PUT requests: ~$0.005 per 1,000 requests
- GET requests: ~$0.0004 per 1,000 requests

Example: 1,000 users with 2MB files each = 2GB storage = ~$0.05/month

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [django-storages Documentation](https://django-storages.readthedocs.io/)
- [boto3 Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)

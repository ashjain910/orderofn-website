# AWS Deployment Guide for Jobs Application

This guide walks you through deploying your Django + React application to AWS.

## Architecture Overview

- **Backend**: Django REST API on AWS Elastic Beanstalk
- **Frontend**: React app on AWS Amplify or S3 + CloudFront
- **Database**: AWS RDS PostgreSQL (optional, starts with SQLite)
- **Media Storage**: AWS S3 (for file uploads)

---

## Prerequisites

1. **AWS Account**: Sign up at [aws.amazon.com](https://aws.amazon.com)
2. **AWS CLI**: Install from [aws.amazon.com/cli](https://aws.amazon.com/cli/)
3. **EB CLI**: Install Elastic Beanstalk CLI
   ```bash
   pip install awsebcli
   ```

---

## Part 1: Deploy Backend (Django) to Elastic Beanstalk

### Step 1: Initialize Elastic Beanstalk

```bash
cd tic-codebase/backend

# Initialize EB application
eb init -p python-3.11 jobs-backend --region us-east-1

# Create environment (this will deploy your app)
eb create jobs-backend-env
```

### Step 2: Set Environment Variables

```bash
# Set production environment variables
eb setenv \
  SECRET_KEY="your-super-secret-key-change-this" \
  DEBUG=False \
  ALLOWED_HOSTS=".elasticbeanstalk.com,your-frontend-domain.com" \
  CORS_ALLOWED_ORIGINS="https://your-frontend-domain.com"
```

### Step 3: Deploy Updates

```bash
# After making changes, deploy with:
eb deploy

# View logs
eb logs

# Open in browser
eb open
```

### Step 4: Get Your Backend URL

```bash
eb status
# Note the CNAME - this is your backend URL
# Example: jobs-backend-env.us-east-1.elasticbeanstalk.com
```

---

## Part 2: Deploy Frontend (React) to AWS Amplify

### Option A: Using AWS Amplify Console (Easiest)

1. **Go to AWS Amplify Console**: [console.aws.amazon.com/amplify](https://console.aws.amazon.com/amplify)
2. **Connect Repository**:
   - Click "New app" → "Host web app"
   - Connect your GitHub/GitLab repository
   - Select the `tic-codebase` folder

3. **Build Settings**:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. **Environment Variables**:
   - Add: `VITE_API_URL` = `https://your-backend-url.elasticbeanstalk.com`

5. **Deploy**: Amplify will auto-deploy on every push to your branch

### Option B: Using S3 + CloudFront (More Control)

1. **Build the frontend locally**:
   ```bash
   cd tic-codebase
   npm run build
   ```

2. **Create S3 Bucket**:
   ```bash
   aws s3 mb s3://jobs-app-frontend
   aws s3 sync dist/ s3://jobs-app-frontend --delete
   aws s3 website s3://jobs-app-frontend --index-document index.html
   ```

3. **Create CloudFront Distribution** (optional, for HTTPS and CDN):
   - Go to CloudFront console
   - Create distribution pointing to your S3 bucket
   - Wait 15-20 minutes for deployment

---

## Part 3: Update Frontend API Configuration

### Update your frontend API base URL

1. **Check your frontend code** for API endpoint configuration (likely in `src/config` or environment variables)

2. **Update to use environment variable**:
   ```typescript
   // Example: src/config/api.ts
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
   ```

3. **Set environment variable** in Amplify or create `.env.production`:
   ```bash
   VITE_API_URL=https://jobs-backend-env.us-east-1.elasticbeanstalk.com
   ```

---

## Part 4: Upgrade to PostgreSQL (Recommended for Production)

### Step 1: Create RDS PostgreSQL Database

```bash
# Create database
aws rds create-db-instance \
  --db-instance-identifier jobs-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username dbadmin \
  --master-user-password YourStrongPassword123 \
  --allocated-storage 20
```

### Step 2: Update Django Settings

Add to your EB environment variables:
```bash
eb setenv \
  DATABASE_URL="postgresql://dbadmin:YourPassword@your-db-endpoint.rds.amazonaws.com:5432/jobsdb"
```

### Step 3: Update settings.py to use DATABASE_URL

The `dj-database-url` package (already in requirements.txt) will handle this automatically.

---

## Part 5: Set Up S3 for Media Files (Optional)

For handling file uploads (CVs, resumes):

### Step 1: Create S3 Bucket

```bash
aws s3 mb s3://jobs-app-media
```

### Step 2: Install django-storages

Already in your `requirements.txt`, just need to configure:

```bash
eb setenv \
  AWS_STORAGE_BUCKET_NAME=jobs-app-media \
  AWS_S3_REGION_NAME=us-east-1
```

---

## Monitoring and Maintenance

### View Application Logs
```bash
eb logs
eb logs --stream  # Stream logs in real-time
```

### Monitor Application Health
```bash
eb health
eb status
```

### SSH into Instance
```bash
eb ssh
```

### Scale Your Application
```bash
# Update to use 2 instances
eb scale 2
```

---

## Costs Estimation (Free Tier)

- **Elastic Beanstalk**: Free (you pay for underlying EC2)
- **EC2 t2.micro**: Free for 12 months (750 hours/month)
- **RDS t3.micro**: Free for 12 months (750 hours/month)
- **S3**: Free for 12 months (5GB storage)
- **Amplify**: Free tier includes 1000 build minutes/month
- **CloudFront**: Free tier includes 1TB data transfer

**Estimated cost after free tier**: ~$15-30/month for light usage

---

## Quick Commands Reference

```bash
# Backend deployment
cd tic-codebase/backend
eb deploy
eb open
eb logs

# Frontend deployment (Amplify does this automatically)
cd tic-codebase
npm run build

# Environment management
eb setenv KEY=value
eb printenv
eb terminate jobs-backend-env  # Delete environment
```

---

## Troubleshooting

### Backend won't start
```bash
eb logs  # Check for errors
# Common issues:
# - Missing environment variables
# - Database connection errors
# - Static files not collecting
```

### CORS Errors
Update CORS settings in EB:
```bash
eb setenv CORS_ALLOWED_ORIGINS="https://your-frontend-domain.com"
```

### Database Migration Errors
```bash
eb ssh
source /var/app/venv/*/bin/activate
cd /var/app/current
python manage.py migrate
```

---

## Security Best Practices

1. ✅ Set `DEBUG=False` in production
2. ✅ Use strong `SECRET_KEY`
3. ✅ Configure proper `ALLOWED_HOSTS`
4. ✅ Use HTTPS (CloudFront provides this)
5. ✅ Set up proper CORS origins
6. ✅ Use environment variables for secrets
7. ✅ Enable AWS CloudWatch monitoring
8. ✅ Set up database backups (RDS automatic backups)

---

## Next Steps

1. **Deploy Backend**: Follow Part 1
2. **Get Backend URL**: Note the Elastic Beanstalk URL
3. **Deploy Frontend**: Follow Part 2 with the backend URL
4. **Test End-to-End**: Create account, post job, apply
5. **Set Up Domain**: Use Route 53 for custom domain (optional)
6. **Monitor**: Set up CloudWatch alarms

---

## Support

- AWS Documentation: [docs.aws.amazon.com](https://docs.aws.amazon.com)
- Elastic Beanstalk Guide: [AWS EB Python](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-django.html)
- Amplify Docs: [docs.amplify.aws](https://docs.amplify.aws)

Good luck with your deployment! 🚀

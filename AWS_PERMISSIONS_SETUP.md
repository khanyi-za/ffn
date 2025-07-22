# AWS IAM Permissions Setup for Image Optimization

## 🚨 **Critical Fix Required**

Your AWS user `frenchfornew-user` is missing the `s3:PutObject` permission, which is **blocking all image optimization uploads**.

## 📋 **Required IAM Policy**

You need to update your AWS IAM user policy to include these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::frenchfornew-images",
        "arn:aws:s3:::frenchfornew-images/*"
      ]
    }
  ]
}
```

## 🛠️ **Step-by-Step Instructions**

### Option 1: AWS Console (Recommended)

1. **Go to AWS IAM Console**
   - Navigate to https://console.aws.amazon.com/iam/
   - Sign in to your account

2. **Find Your User**
   - Click "Users" in the left sidebar
   - Search for and click on `frenchfornew-user`

3. **Update Permissions**
   - Click the "Permissions" tab
   - Click "Add permissions" → "Attach existing policies directly"
   - Or click on your existing policy to edit it

4. **Add Missing Permissions**
   - If editing existing policy, add `s3:PutObject` to the Actions array
   - If creating new policy, use the JSON above
   - Make sure the Resource includes both:
     - `arn:aws:s3:::frenchfornew-images` (bucket level)
     - `arn:aws:s3:::frenchfornew-images/*` (object level)

5. **Save Changes**
   - Click "Review" → "Save changes"
   - The permissions will be active immediately

### Option 2: AWS CLI

If you prefer command line:

```bash
# Create policy document (save as s3-policy.json)
cat > s3-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::frenchfornew-images",
        "arn:aws:s3:::frenchfornew-images/*"
      ]
    }
  ]
}
EOF

# Create the policy
aws iam create-policy \
    --policy-name FrenchForNewS3Access \
    --policy-document file://s3-policy.json

# Attach to user (replace ACCOUNT-ID with your AWS account ID)
aws iam attach-user-policy \
    --user-name frenchfornew-user \
    --policy-arn arn:aws:iam::ACCOUNT-ID:policy/FrenchForNewS3Access
```

## ✅ **Verification**

After updating permissions, test by running:

```bash
# Test from your application
curl -X POST "http://localhost:3000/api/auto-optimize-images" \
  -H "Content-Type: application/json" \
  -d '{"folderPath":"SoundSet Sunday/27 April 2025/marian_charumbira/","maxImages":1}'
```

You should see successful thumbnail creation without `AccessDenied` errors.

## 🔒 **Security Notes**

- **Principle of Least Privilege**: Only grant permissions to your specific bucket
- **Resource Restrictions**: The policy above restricts access to only `frenchfornew-images` bucket
- **Action Limitations**: We only allow necessary S3 operations, not full S3 access

## 🚀 **What This Fixes**

With these permissions, your optimization system will be able to:
- ✅ Read original 25MB images from S3 (`s3:GetObject`)
- ✅ Upload 50KB thumbnails to S3 (`s3:PutObject`)
- ✅ List folder contents (`s3:ListBucket`)
- ✅ Clean up old optimized versions if needed (`s3:DeleteObject`)

## 📞 **Need Help?**

If you encounter issues:
1. Check the IAM user name is exactly `frenchfornew-user`
2. Verify the bucket name is exactly `frenchfornew-images`
3. Ensure the policy is attached to the USER, not a role
4. AWS changes can take 1-2 minutes to propagate 
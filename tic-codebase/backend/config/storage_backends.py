from storages.backends.s3boto3 import S3Boto3Storage
from botocore.exceptions import ClientError
import os
import time


class MediaStorage(S3Boto3Storage):
    """Custom S3 storage for media files with workaround for HeadObject 403 errors"""
    location = 'media'
    file_overwrite = False

    def exists(self, name):
        """
        Override exists() to catch and ignore 403 errors
        This prevents HeadObject 403 errors from breaking uploads
        """
        try:
            return super().exists(name)
        except ClientError as e:
            # If we get a 403, assume the file doesn't exist and proceed with upload
            if e.response.get('ResponseMetadata', {}).get('HTTPStatusCode') == 403:
                return False
            # Re-raise other errors
            raise

    def get_available_name(self, name, max_length=None):
        """
        Return a filename that's available in the target storage.
        Generate unique filename without checking existence
        """
        dir_name, file_name = os.path.split(name)
        file_root, file_ext = os.path.splitext(file_name)

        # Use timestamp to make unique
        unique_name = f"{file_root}_{int(time.time())}{file_ext}"

        if dir_name:
            return os.path.join(dir_name, unique_name)
        return unique_name

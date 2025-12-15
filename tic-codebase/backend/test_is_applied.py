#!/usr/bin/env python
"""
Test script to verify is_applied and is_saved functionality
Run with: python test_is_applied.py
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from app.models import User, Job, JobApplication, SavedJob
from app.serializers import JobSerializer
from rest_framework.test import APIRequestFactory
from django.contrib.auth.models import AnonymousUser

def test_is_applied_is_saved():
    print("=" * 60)
    print("Testing is_applied and is_saved functionality")
    print("=" * 60)

    # Get or create a test user
    user, created = User.objects.get_or_create(
        email='test@example.com',
        defaults={
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"✓ Created test user: {user.email} (ID: {user.id})")
    else:
        print(f"✓ Using existing test user: {user.email} (ID: {user.id})")

    # Get or create a test job
    job = Job.objects.first()
    if not job:
        job = Job.objects.create(
            title="Test Teacher Position",
            school_name="Test School",
            location="Test City",
            job_type="full-time",
            school_type="international",
            description="Test description",
            status="active"
        )
        print(f"✓ Created test job: {job.title} (ID: {job.id})")
    else:
        print(f"✓ Using existing job: {job.title} (ID: {job.id})")

    # Test 1: Check is_applied BEFORE applying
    print("\n--- Test 1: Before applying ---")
    factory = APIRequestFactory()
    request = factory.get('/api/jobs')
    request.user = user

    serializer = JobSerializer(job, context={'request': request})
    print(f"is_applied: {serializer.data['is_applied']} (should be False)")
    print(f"is_saved: {serializer.data['is_saved']} (should be False)")

    # Apply to the job
    print("\n--- Creating application ---")
    application, app_created = JobApplication.objects.get_or_create(
        user=user,
        job=job,
        defaults={'status': 'pending'}
    )
    if app_created:
        print(f"✓ Created application (ID: {application.id})")
    else:
        print(f"✓ Application already exists (ID: {application.id})")

    # Verify application exists in database
    app_exists = JobApplication.objects.filter(user=user, job=job).exists()
    print(f"✓ Application exists in DB: {app_exists}")

    # Test 2: Check is_applied AFTER applying
    print("\n--- Test 2: After applying ---")
    request2 = factory.get('/api/jobs')
    request2.user = user

    serializer2 = JobSerializer(job, context={'request': request2})
    print(f"is_applied: {serializer2.data['is_applied']} (should be True)")
    print(f"is_saved: {serializer2.data['is_saved']} (should be False)")

    # Save the job
    print("\n--- Saving job ---")
    saved_job, saved_created = SavedJob.objects.get_or_create(
        user=user,
        job=job
    )
    if saved_created:
        print(f"✓ Created saved job (ID: {saved_job.id})")
    else:
        print(f"✓ Job already saved (ID: {saved_job.id})")

    # Verify saved job exists in database
    saved_exists = SavedJob.objects.filter(user=user, job=job).exists()
    print(f"✓ Saved job exists in DB: {saved_exists}")

    # Test 3: Check both AFTER applying and saving
    print("\n--- Test 3: After applying and saving ---")
    request3 = factory.get('/api/jobs')
    request3.user = user

    serializer3 = JobSerializer(job, context={'request': request3})
    print(f"is_applied: {serializer3.data['is_applied']} (should be True)")
    print(f"is_saved: {serializer3.data['is_saved']} (should be True)")

    # Summary
    print("\n" + "=" * 60)
    print("Test Summary:")
    print("=" * 60)

    test_1_pass = serializer.data['is_applied'] == False and serializer.data['is_saved'] == False
    test_2_pass = serializer2.data['is_applied'] == True and serializer2.data['is_saved'] == False
    test_3_pass = serializer3.data['is_applied'] == True and serializer3.data['is_saved'] == True

    print(f"Test 1 (Before): {'PASS ✓' if test_1_pass else 'FAIL ✗'}")
    print(f"Test 2 (After apply): {'PASS ✓' if test_2_pass else 'FAIL ✗'}")
    print(f"Test 3 (After save): {'PASS ✓' if test_3_pass else 'FAIL ✗'}")

    if test_1_pass and test_2_pass and test_3_pass:
        print("\n🎉 All tests PASSED!")
        return 0
    else:
        print("\n❌ Some tests FAILED!")
        return 1

if __name__ == '__main__':
    sys.exit(test_is_applied_is_saved())

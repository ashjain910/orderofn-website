from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from .models import Job, JobApplication, SavedJob
from .serializers import LoginSerializer, UserSerializer, PreRegisterSerializer, TeacherProfileSerializer, JobSerializer, JobApplicationSerializer, UpdatePasswordSerializer, SavedJobSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data['user']

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        # Serialize user data
        user_serializer = UserSerializer(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def pre_register(request):
    serializer = PreRegisterSerializer(data=request.data)

    if serializer.is_valid():
        result = serializer.save()
        user = result['user']
        teacher_profile = result['teacher_profile']

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        # Serialize response data
        user_serializer = UserSerializer(user)
        profile_serializer = TeacherProfileSerializer(teacher_profile)

        return Response({
            'message': 'Registration successful',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': user_serializer.data,
            'teacher_profile': profile_serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
@permission_classes([AllowAny])
def job_list(request):
    # Start with all active jobs
    jobs = Job.objects.all()

    # Filter by title (search)
    title = request.query_params.get('title', None)
    if title:
        jobs = jobs.filter(title__icontains=title)

    # Filter by job type
    job_type = request.query_params.get('jobType', None)
    if job_type:
        job_types = job_type.split(',')
        jobs = jobs.filter(job_type__in=job_types)

    # Filter by school type
    school_type = request.query_params.get('schoolType', None)
    if school_type:
        school_types = school_type.split(',')
        jobs = jobs.filter(school_type__in=school_types)

    # Filter by gender preference
    gender = request.query_params.get('gender', None)
    if gender and gender != 'any':
        jobs = jobs.filter(Q(gender_preference=gender) | Q(gender_preference='any'))

    # Filter by status (all/active/expired)
    status_filter = request.query_params.get('status', 'active')
    if status_filter == 'active':
        jobs = jobs.filter(status='active')
    elif status_filter == 'expired':
        jobs = jobs.filter(status='expired')

    # Filter by applied status (only for authenticated users)
    is_applied = request.query_params.get('is_applied', None)
    if is_applied is not None and request.user.is_authenticated:
        if is_applied.lower() == 'true':
            # Get jobs the user has applied to
            applied_job_ids = JobApplication.objects.filter(user=request.user).values_list('job_id', flat=True)
            jobs = jobs.filter(id__in=applied_job_ids)
        elif is_applied.lower() == 'false':
            # Get jobs the user has NOT applied to
            applied_job_ids = JobApplication.objects.filter(user=request.user).values_list('job_id', flat=True)
            jobs = jobs.exclude(id__in=applied_job_ids)

    # Filter by saved status (only for authenticated users)
    is_saved = request.query_params.get('is_saved', None)
    if is_saved is not None and request.user.is_authenticated:
        if is_saved.lower() == 'true':
            # Get jobs the user has saved
            saved_job_ids = SavedJob.objects.filter(user=request.user).values_list('job_id', flat=True)
            jobs = jobs.filter(id__in=saved_job_ids)
        elif is_saved.lower() == 'false':
            # Get jobs the user has NOT saved
            saved_job_ids = SavedJob.objects.filter(user=request.user).values_list('job_id', flat=True)
            jobs = jobs.exclude(id__in=saved_job_ids)

    # Pagination
    paginator = JobPagination()
    paginated_jobs = paginator.paginate_queryset(jobs, request)
    serializer = JobSerializer(paginated_jobs, many=True, context={'request': request})

    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def job_detail(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
        serializer = JobSerializer(job, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def apply_to_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if job is active
    if job.status != 'active':
        return Response({'error': 'This job is no longer active'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if job is expired
    if job.is_expired:
        return Response({'error': 'This job has expired'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if user has already applied
    if JobApplication.objects.filter(user=request.user, job=job).exists():
        return Response({'error': 'You have already applied to this job'}, status=status.HTTP_400_BAD_REQUEST)

    # Create application data with job
    data = request.data.copy()
    data['job'] = job_id

    serializer = JobApplicationSerializer(data=data, context={'request': request})

    if serializer.is_valid():
        application = serializer.save()
        return Response({
            'message': 'Application submitted successfully',
            'application': JobApplicationSerializer(application).data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_password(request):
    serializer = UpdatePasswordSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Password updated successfully'
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if user has already saved this job
    if SavedJob.objects.filter(user=request.user, job=job).exists():
        return Response({'error': 'You have already saved this job'}, status=status.HTTP_400_BAD_REQUEST)

    # Create saved job
    saved_job = SavedJob.objects.create(user=request.user, job=job)
    serializer = SavedJobSerializer(saved_job)

    return Response({
        'message': 'Job saved successfully',
        'saved_job': serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def saved_jobs_list(request):
    saved_jobs = SavedJob.objects.filter(user=request.user)
    serializer = SavedJobSerializer(saved_jobs, many=True)

    return Response({
        'count': saved_jobs.count(),
        'saved_jobs': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unsave_job(request, job_id):
    try:
        saved_job = SavedJob.objects.get(user=request.user, job_id=job_id)
        saved_job.delete()
        return Response({
            'message': 'Job removed from saved list'
        }, status=status.HTTP_200_OK)
    except SavedJob.DoesNotExist:
        return Response({'error': 'Saved job not found'}, status=status.HTTP_404_NOT_FOUND)

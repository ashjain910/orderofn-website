from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from .models import Job, JobApplication, SavedJob, User
from .serializers import (
    LoginSerializer, UserSerializer, PreRegisterSerializer, TeacherProfileSerializer,
    JobSerializer, JobApplicationSerializer, UpdatePasswordSerializer, SavedJobSerializer,
    AdminCandidateSerializer, AdminJobSerializer, AdminJobApplicationSerializer,
    AdminJobCreateUpdateSerializer, ProfileSerializer, UpdateProfileSerializer
)


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

    # Optimize queries if user is authenticated
    if request.user.is_authenticated:
        jobs = jobs.prefetch_related(
            'applications',
            'saved_by'
        )

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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """Get current user's profile with teacher profile"""
    serializer = ProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    """Update user's basic information and/or teacher profile"""
    serializer = UpdateProfileSerializer(
        request.user,
        data=request.data,
        partial=True,  # Always allow partial updates
        context={'request': request}
    )

    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated successfully',
            'profile': ProfileSerializer(request.user).data
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


# Admin Views
class AdminPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_candidates_list(request):
    """
    Get list of all candidates/teachers with their profiles
    Query params:
    - search: Search by name or email
    - qualified: Filter by qualified (yes/no)
    - position: Filter by position (teacher/leader/other)
    - gender: Filter by gender
    """
    candidates = User.objects.filter(teacher_profile__isnull=False).select_related('teacher_profile')

    # Search by name or email
    search = request.query_params.get('search', None)
    if search:
        candidates = candidates.filter(
            Q(email__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search)
        )

    # Filter by qualified
    qualified = request.query_params.get('qualified', None)
    if qualified:
        candidates = candidates.filter(teacher_profile__qualified=qualified)

    # Filter by position
    position = request.query_params.get('position', None)
    if position:
        candidates = candidates.filter(teacher_profile__position=position)

    # Filter by gender
    gender = request.query_params.get('gender', None)
    if gender:
        candidates = candidates.filter(teacher_profile__gender=gender)

    # Order by most recent
    candidates = candidates.order_by('-date_joined')

    # Pagination
    paginator = AdminPagination()
    paginated_candidates = paginator.paginate_queryset(candidates, request)
    serializer = AdminCandidateSerializer(paginated_candidates, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_candidate_detail(request, candidate_id):
    """Get detailed information about a specific candidate"""
    try:
        candidate = User.objects.select_related('teacher_profile').get(id=candidate_id)
        serializer = AdminCandidateSerializer(candidate)

        # Get all applications for this candidate
        applications = JobApplication.objects.filter(user=candidate).select_related('job')
        applications_serializer = AdminJobApplicationSerializer(applications, many=True)

        return Response({
            'candidate': serializer.data,
            'applications': applications_serializer.data
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'Candidate not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_jobs_list(request):
    """
    Get list of all jobs with application counts
    Query params:
    - search: Search by title or school name
    - job_type: Filter by job type
    - school_type: Filter by school type
    - status: Filter by status (active/expired/closed)
    """
    jobs = Job.objects.prefetch_related('applications__user__teacher_profile').all()

    # Search by title or school name
    search = request.query_params.get('search', None)
    if search:
        jobs = jobs.filter(
            Q(title__icontains=search) |
            Q(school_name__icontains=search)
        )

    # Filter by job type
    job_type = request.query_params.get('job_type', None)
    if job_type:
        jobs = jobs.filter(job_type=job_type)

    # Filter by school type
    school_type = request.query_params.get('school_type', None)
    if school_type:
        jobs = jobs.filter(school_type=school_type)

    # Filter by status
    status_filter = request.query_params.get('status', None)
    if status_filter:
        jobs = jobs.filter(status=status_filter)

    # Order by most recent
    jobs = jobs.order_by('-date_posted')

    # Pagination
    paginator = AdminPagination()
    paginated_jobs = paginator.paginate_queryset(jobs, request)
    serializer = AdminJobSerializer(paginated_jobs, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_job_detail(request, job_id):
    """Get detailed information about a specific job with all applicants"""
    try:
        job = Job.objects.prefetch_related('applications__user__teacher_profile').get(id=job_id)
        serializer = AdminJobSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_update_application_status(request, application_id):
    """
    Update application status
    Body: { "status": "pending|reviewed|accepted|rejected" }
    """
    try:
        application = JobApplication.objects.select_related('user', 'job').get(id=application_id)

        new_status = request.data.get('status')
        if new_status not in ['pending', 'reviewed', 'accepted', 'rejected']:
            return Response(
                {'error': 'Invalid status. Must be one of: pending, reviewed, accepted, rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = new_status
        application.save()

        serializer = AdminJobApplicationSerializer(application)
        return Response({
            'message': 'Application status updated successfully',
            'application': serializer.data
        }, status=status.HTTP_200_OK)
    except JobApplication.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    """Get dashboard statistics"""
    total_candidates = User.objects.filter(teacher_profile__isnull=False).count()
    total_jobs = Job.objects.count()
    active_jobs = Job.objects.filter(status='active').count()
    total_applications = JobApplication.objects.count()
    pending_applications = JobApplication.objects.filter(status='pending').count()

    # Recent applications (last 7 days)
    from datetime import datetime, timedelta
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_applications = JobApplication.objects.filter(applied_at__gte=seven_days_ago).count()

    # Recent registrations (last 7 days)
    recent_candidates = User.objects.filter(
        teacher_profile__isnull=False,
        date_joined__gte=seven_days_ago
    ).count()

    return Response({
        'total_candidates': total_candidates,
        'total_jobs': total_jobs,
        'active_jobs': active_jobs,
        'total_applications': total_applications,
        'pending_applications': pending_applications,
        'recent_applications': recent_applications,
        'recent_candidates': recent_candidates
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_create_job(request):
    """Create a new job posting"""
    serializer = AdminJobCreateUpdateSerializer(data=request.data)

    if serializer.is_valid():
        job = serializer.save()
        return Response({
            'message': 'Job created successfully',
            'job': AdminJobSerializer(job).data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def admin_update_job(request, job_id):
    """Update an existing job posting"""
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    # Use partial=True for PATCH requests
    partial = request.method == 'PATCH'
    serializer = AdminJobCreateUpdateSerializer(job, data=request.data, partial=partial)

    if serializer.is_valid():
        job = serializer.save()
        return Response({
            'message': 'Job updated successfully',
            'job': AdminJobSerializer(job).data
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_job(request, job_id):
    """Delete a job posting"""
    try:
        job = Job.objects.get(id=job_id)

        # Check if there are applications
        applications_count = job.applications.count()

        job.delete()

        return Response({
            'message': 'Job deleted successfully',
            'applications_deleted': applications_count
        }, status=status.HTTP_200_OK)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import stripe
from django.conf import settings

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        mode='subscription',
        line_items=[{
            'price': 'YOUR_STRIPE_PRICE_ID',  # Set this in Stripe dashboard
            'quantity': 1,
        }],
        customer_email=request.user.email,
        success_url='https://yourdomain.com/success',
        cancel_url='https://yourdomain.com/cancel',
    )
    return Response({'sessionId': session.id})
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from .models import Job, JobApplication, SavedJob, User
from .serializers import (
    LoginSerializer, UserSerializer, PreRegisterSerializer, TeacherProfileSerializer,
    JobSerializer, JobApplicationSerializer, UpdatePasswordSerializer, SavedJobSerializer,
    AdminCandidateSerializer, AdminJobSerializer, AdminJobApplicationSerializer,
    AdminJobCreateUpdateSerializer, ProfileSerializer, UpdateProfileSerializer
)
from django.shortcuts import redirect
from .email_utils import send_job_application_email, send_application_status_update_email, send_interview_invitation_email
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)


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

        # Send confirmation email to the applicant
        try:
            email_sent = send_job_application_email(request.user, job, application)
            if email_sent:
                logger.info(f"Confirmation email sent successfully to {request.user.email}")
            else:
                logger.warning(f"Failed to send confirmation email to {request.user.email}")
        except Exception as e:
            logger.error(f"Error sending confirmation email: {str(e)}")
            # Don't fail the application if email fails

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
    Body: { "status": "pending|reviewed|shortlisted|accepted|rejected" }
    """
    try:
        application = JobApplication.objects.select_related('user', 'job').get(id=application_id)

        new_status = request.data.get('status')
        if new_status not in ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected']:
            return Response(
                {'error': 'Invalid status. Must be one of: pending, reviewed, shortlisted, accepted, rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )

        old_status = application.status
        application.status = new_status
        application.save()

        # Send status update email if status changed (and not just setting to pending)
        if old_status != new_status and new_status != 'pending':
            try:
                email_sent = send_application_status_update_email(application, old_status, new_status)
                if email_sent:
                    logger.info(f"Status update email sent to {application.user.email}")
                else:
                    logger.warning(f"Failed to send status update email to {application.user.email}")
            except Exception as e:
                logger.error(f"Error sending status update email: {str(e)}")
                # Don't fail the update if email fails

        serializer = AdminJobApplicationSerializer(application)
        return Response({
            'message': 'Application status updated successfully',
            'application': serializer.data
        }, status=status.HTTP_200_OK)
    except JobApplication.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_send_interview_invitation(request, application_id):
    """
    Send interview invitation email to a candidate
    Body: {
        "interview_date": "Monday, 15th January 2024" (optional),
        "interview_time": "10:00 AM GMT" (optional),
        "interview_format": "Online via Zoom" (optional),
        "interview_panel": "Principal and Head of Department" (optional)
    }
    """
    try:
        application = JobApplication.objects.select_related('user', 'job').get(id=application_id)

        # Extract interview details from request
        interview_details = {
            'interview_date': request.data.get('interview_date', ''),
            'interview_time': request.data.get('interview_time', ''),
            'interview_format': request.data.get('interview_format', ''),
            'interview_panel': request.data.get('interview_panel', ''),
        }

        # Send interview invitation email
        try:
            email_sent = send_interview_invitation_email(application, interview_details)
            if email_sent:
                logger.info(f"Interview invitation email sent to {application.user.email}")
                return Response({
                    'message': 'Interview invitation email sent successfully',
                    'application': AdminJobApplicationSerializer(application).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Failed to send interview invitation email'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Error sending interview invitation email: {str(e)}")
            return Response({
                'error': f'Failed to send interview invitation email: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    """
    Create a Stripe Checkout Session for subscription payment.
    Returns the checkout session URL for redirect.
    """
    try:
        stripe.api_key = settings.STRIPE_SECRET_KEY
        user = request.user

        # Check if user already has an active subscription
        if user.has_active_subscription:
            return Response({
                'error': 'You already have an active subscription'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Prepare session parameters
        session_params = {
            'payment_method_types': ['card'],
            'mode': 'subscription',
            'line_items': [{
                'price': 'price_1SeYHCS3b9o0AI70juiCFthQ',
                'quantity': 1,
            }],
            'client_reference_id': str(user.id),  # To identify user in webhook
            'metadata': {
                'user_id': str(user.id),
                'user_email': user.email,
            },
            'success_url': 'https://orderofn.com/tic?checkout=success&session_id={CHECKOUT_SESSION_ID}',
            'cancel_url': 'https://orderofn.com/tic?checkout=canceled',
        }

        # If user already has a Stripe customer ID, use it; otherwise use email
        # Note: Stripe only allows ONE of 'customer' or 'customer_email', not both
        if user.stripe_customer_id:
            session_params['customer'] = user.stripe_customer_id
        else:
            session_params['customer_email'] = user.email

        # Create the checkout session
        session = stripe.checkout.Session.create(**session_params)

        logger.info(f"Checkout session created for user {user.email}: {session.id}")

        return Response({
            'sessionId': session.id,
            'sessionUrl': session.url
        }, status=status.HTTP_200_OK)

    except stripe.error.CardError as e:
        # Card was declined
        logger.error(f"Card error for user {request.user.email}: {str(e)}")
        return Response({
            'error': 'Your card was declined. Please try a different payment method.'
        }, status=status.HTTP_400_BAD_REQUEST)

    except stripe.error.RateLimitError as e:
        # Too many requests to Stripe API
        logger.error(f"Stripe rate limit error: {str(e)}")
        return Response({
            'error': 'Service temporarily unavailable. Please try again in a moment.'
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)

    except stripe.error.InvalidRequestError as e:
        # Invalid parameters
        logger.error(f"Invalid Stripe request for user {request.user.email}: {str(e)}")
        return Response({
            'error': 'Invalid request. Please contact support.'
        }, status=status.HTTP_400_BAD_REQUEST)

    except stripe.error.AuthenticationError as e:
        # Authentication with Stripe failed
        logger.error(f"Stripe authentication error: {str(e)}")
        return Response({
            'error': 'Payment system configuration error. Please contact support.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except stripe.error.APIConnectionError as e:
        # Network communication with Stripe failed
        logger.error(f"Stripe API connection error: {str(e)}")
        return Response({
            'error': 'Unable to connect to payment service. Please try again.'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    except stripe.error.StripeError as e:
        # Generic Stripe error
        logger.error(f"Stripe error for user {request.user.email}: {str(e)}")
        return Response({
            'error': 'Payment processing error. Please try again or contact support.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        # Unexpected error
        logger.error(f"Unexpected error creating checkout session for user {request.user.email}: {str(e)}")
        return Response({
            'error': 'An unexpected error occurred. Please try again or contact support.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
def stripe_webhook(request):
    """
    Handle Stripe webhook events for subscription management.
    This endpoint receives real-time updates from Stripe about subscription changes.

    Note: Using plain Django view instead of @api_view to preserve raw request body
    for Stripe signature verification.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    stripe.api_key = settings.STRIPE_SECRET_KEY
    webhook_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', None)

    # Get raw body - must remain unmodified for signature verification
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    # Debug logging
    logger.info(f"Webhook request received - Content-Type: {request.META.get('CONTENT_TYPE')}")
    logger.info(f"Payload length: {len(payload)} bytes")
    logger.info(f"Signature header present: {bool(sig_header)}")
    logger.info(f"Webhook secret starts with: {webhook_secret[:7] if webhook_secret else 'None'}...")

    try:
        # Verify webhook signature
        if webhook_secret:
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, webhook_secret
                )
                logger.info("✓ Webhook signature verified successfully")
            except stripe.error.SignatureVerificationError as e:
                logger.error(f"Webhook signature verification failed: {str(e)}")
                logger.error(f"Signature header: {sig_header}")
                logger.error(f"Webhook secret starts with: {webhook_secret[:7]}...")
                logger.error(f"Make sure the webhook secret in .env matches the one in Stripe Dashboard")
                return JsonResponse({'error': 'Invalid signature'}, status=400)
            except ValueError as e:
                logger.error(f"Invalid payload: {str(e)}")
                return JsonResponse({'error': 'Invalid payload'}, status=400)
        else:
            # If no webhook secret is configured, parse the event without verification
            # WARNING: This is not recommended for production
            event = stripe.Event.construct_from(
                json.loads(payload), stripe.api_key
            )
            logger.warning("Webhook signature verification skipped - STRIPE_WEBHOOK_SECRET not configured")

        event_type = event['type']
        data_object = event['data']['object']

        logger.info(f"Received Stripe webhook: {event_type} - Event ID: {event['id']}")

        # Handle checkout session completed
        if event_type == 'checkout.session.completed':
            session = data_object
            handle_checkout_session_completed(session)

        # Handle subscription created
        elif event_type == 'customer.subscription.created':
            subscription = data_object
            handle_subscription_created(subscription)

        # Handle subscription updated
        elif event_type == 'customer.subscription.updated':
            subscription = data_object
            handle_subscription_updated(subscription)

        # Handle subscription deleted (canceled)
        elif event_type == 'customer.subscription.deleted':
            subscription = data_object
            handle_subscription_deleted(subscription)

        # Handle invoice payment succeeded
        elif event_type == 'invoice.payment_succeeded':
            invoice = data_object
            handle_invoice_payment_succeeded(invoice)

        # Handle invoice payment failed
        elif event_type == 'invoice.payment_failed':
            invoice = data_object
            handle_invoice_payment_failed(invoice)

        return JsonResponse({'status': 'success'}, status=200)

    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)


def get_user_from_stripe_customer(customer_id):
    """
    Get user from Stripe customer ID with fallback to Stripe API.
    Handles race condition where subscription events arrive before checkout.session.completed.
    """
    try:
        # Try direct lookup first
        return User.objects.get(stripe_customer_id=customer_id)
    except User.DoesNotExist:
        # Fallback: fetch customer from Stripe to get metadata
        logger.warning(f"User not found by customer_id {customer_id}, fetching from Stripe...")
        try:
            import stripe
            customer = stripe.Customer.retrieve(customer_id)
            user_id = customer.get('metadata', {}).get('user_id')

            if user_id:
                user = User.objects.get(id=user_id)
                # Save the customer ID for future lookups
                user.stripe_customer_id = customer_id
                user.save()
                logger.info(f"Found user {user.email} via Stripe customer metadata, saved customer_id")
                return user
            else:
                logger.error(f"No user_id in customer metadata for {customer_id}")
                return None
        except Exception as e:
            logger.error(f"Error fetching customer from Stripe: {str(e)}")
            return None


def handle_checkout_session_completed(session):
    """Process completed checkout session"""
    try:
        user_id = session.get('client_reference_id') or session.get('metadata', {}).get('user_id')

        if not user_id:
            logger.error(f"No user_id found in checkout session {session['id']}")
            return

        user = User.objects.get(id=user_id)

        # Update user with Stripe customer ID
        if session.get('customer'):
            user.stripe_customer_id = session['customer']
            user.save()
            logger.info(f"Updated customer ID for user {user.email}: {session['customer']}")

        # If subscription was created, it will be handled by subscription.created webhook
        logger.info(f"Checkout completed for user {user.email}: {session['id']}")

    except User.DoesNotExist:
        logger.error(f"User not found for checkout session {session['id']}: user_id={user_id}")
    except Exception as e:
        logger.error(f"Error handling checkout session completed: {str(e)}")


def handle_subscription_created(subscription):
    """Process new subscription"""
    try:
        logger.info(f"Processing subscription.created event: {subscription.get('id')}")
        logger.info(f"Subscription object keys: {list(subscription.keys())}")

        # Log important fields for debugging
        logger.info(f"Subscription status: {subscription.get('status')}")
        logger.info(f"Has current_period_start: {'current_period_start' in subscription}")
        logger.info(f"Has current_period_end: {'current_period_end' in subscription}")

        customer_id = subscription.get('customer')
        if not customer_id:
            logger.error(f"No customer ID in subscription {subscription.get('id')}")
            return

        user = get_user_from_stripe_customer(customer_id)

        if not user:
            logger.error(f"User not found for subscription {subscription.get('id')}: customer_id={customer_id}")
            return

        user.stripe_subscription_id = subscription['id']
        user.subscription_status = subscription.get('status', 'unknown')

        # Handle current_period_start and current_period_end
        if 'current_period_start' in subscription:
            user.subscription_start_date = datetime.fromtimestamp(subscription['current_period_start'])
        else:
            logger.warning(f"No current_period_start in subscription {subscription['id']}")

        if 'current_period_end' in subscription:
            user.subscription_end_date = datetime.fromtimestamp(subscription['current_period_end'])
        else:
            logger.warning(f"No current_period_end in subscription {subscription['id']}")

        user.subscription_cancel_at_period_end = subscription.get('cancel_at_period_end', False)
        user.save()

        logger.info(f"Subscription created for user {user.email}: {subscription['id']} - Status: {subscription.get('status')}")

    except KeyError as e:
        logger.error(f"Missing key in subscription object: {str(e)}")
        logger.error(f"Subscription data: {subscription}")
    except Exception as e:
        logger.error(f"Error handling subscription created: {str(e)}")
        logger.error(f"Subscription ID: {subscription.get('id')}")


def handle_subscription_updated(subscription):
    """Process subscription updates"""
    try:
        customer_id = subscription.get('customer')
        if not customer_id:
            logger.error(f"No customer ID in subscription {subscription.get('id')}")
            return

        user = get_user_from_stripe_customer(customer_id)

        if not user:
            logger.error(f"User not found for subscription {subscription.get('id')}: customer_id={customer_id}")
            return

        user.subscription_status = subscription.get('status', 'unknown')

        if 'current_period_start' in subscription:
            user.subscription_start_date = datetime.fromtimestamp(subscription['current_period_start'])

        if 'current_period_end' in subscription:
            user.subscription_end_date = datetime.fromtimestamp(subscription['current_period_end'])

        user.subscription_cancel_at_period_end = subscription.get('cancel_at_period_end', False)
        user.save()

        logger.info(f"Subscription updated for user {user.email}: {subscription['id']} - Status: {subscription.get('status')}")

    except Exception as e:
        logger.error(f"Error handling subscription updated: {str(e)}")
        logger.error(f"Subscription ID: {subscription.get('id')}")


def handle_subscription_deleted(subscription):
    """Process subscription cancellation"""
    try:
        customer_id = subscription['customer']
        user = get_user_from_stripe_customer(customer_id)

        if not user:
            logger.error(f"User not found for subscription {subscription['id']}: customer_id={customer_id}")
            return

        user.subscription_status = 'canceled'
        user.subscription_end_date = datetime.fromtimestamp(subscription['ended_at']) if subscription.get('ended_at') else None
        user.save()

        logger.info(f"Subscription canceled for user {user.email}: {subscription['id']}")

    except Exception as e:
        logger.error(f"Error handling subscription deleted: {str(e)}")


def handle_invoice_payment_succeeded(invoice):
    """Process successful invoice payment"""
    try:
        customer_id = invoice['customer']
        user = get_user_from_stripe_customer(customer_id)

        if not user:
            logger.error(f"User not found for invoice {invoice['id']}: customer_id={customer_id}")
            return

        # Update subscription status to active on successful payment
        if user.subscription_status in ['past_due', 'unpaid']:
            user.subscription_status = 'active'
            user.save()
            logger.info(f"Subscription reactivated for user {user.email} after successful payment")

    except Exception as e:
        logger.error(f"Error handling invoice payment succeeded: {str(e)}")


def handle_invoice_payment_failed(invoice):
    """Process failed invoice payment"""
    try:
        customer_id = invoice['customer']
        user = get_user_from_stripe_customer(customer_id)

        if not user:
            logger.error(f"User not found for invoice {invoice['id']}: customer_id={customer_id}")
            return

        user.subscription_status = 'past_due'
        user.save()

        logger.warning(f"Payment failed for user {user.email} - Subscription marked as past_due")

    except Exception as e:
        logger.error(f"Error handling invoice payment failed: {str(e)}")


@api_view(['GET'])
@permission_classes([AllowAny])
def checkout_success(request):
    """Stripe Checkout success redirect endpoint."""
    return redirect('/?state=success')


@api_view(['GET'])
@permission_classes([AllowAny])
def checkout_cancel(request):
    """Stripe Checkout cancel redirect endpoint."""
    return redirect('/?state=failure')

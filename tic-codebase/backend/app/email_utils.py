from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# Override email recipient for staging/debug mode
STAGING_EMAIL = 'ashjain910@gmail.com'


def get_recipient_email(original_email):
    """
    Return staging email if DEBUG=True, otherwise return original email.

    Args:
        original_email: The intended recipient email address

    Returns:
        str: Email address to actually send to
    """
    if settings.DEBUG:
        logger.info(f"DEBUG mode: Redirecting email from {original_email} to {STAGING_EMAIL}")
        return STAGING_EMAIL
    return original_email


def send_email_safe(email_func):
    """
    Decorator to handle email sending failures gracefully in DEBUG mode.
    Logs email details instead of raising exceptions when email backend fails.
    """
    def wrapper(*args, **kwargs):
        try:
            return email_func(*args, **kwargs)
        except Exception as e:
            if settings.DEBUG:
                logger.warning(f"Email sending failed in DEBUG mode (this is okay): {str(e)}")
                logger.info(f"Email would have been sent by {email_func.__name__}")
                return True  # Return success in DEBUG mode even if sending fails
            else:
                # In production, re-raise the exception
                raise
    return wrapper


@send_email_safe
def send_job_application_email(user, job, application):
    """
    Send a confirmation email to the applicant when they apply for a job.

    Args:
        user: User object - the applicant
        job: Job object - the job they applied to
        application: JobApplication object - the application instance

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # Prepare context for email template
        context = {
            'teacher_name': user.full_name or user.first_name or user.email.split('@')[0],
            'job_title': job.title,
            'school_name': job.school_name,
            'job_location': job.location,
            'application_date': application.applied_at.strftime('%B %d, %Y'),
        }

        # Render email templates
        subject = f'Application Confirmation - {job.title} at {job.school_name}'
        text_content = render_to_string('emails/job_application_confirmation.txt', context)
        html_content = render_to_string('emails/job_application_confirmation.html', context)

        # Create email message
        recipient_email = get_recipient_email(user.email)
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email]
        )

        # Attach HTML version
        email.attach_alternative(html_content, "text/html")

        # Send email
        email.send(fail_silently=False)

        logger.info(f"Job application confirmation email sent to {user.email} for job {job.id}")
        return True

    except Exception as e:
        logger.error(f"Failed to send job application email to {user.email}: {str(e)}")
        return False


@send_email_safe
def send_candidate_shortlisted_email(application):
    """
    Send a detailed shortlisted email to the candidate using HTML template.

    Args:
        application: JobApplication object

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        user = application.user
        job = application.job

        # Prepare context for email template
        context = {
            'teacher_name': user.full_name or user.first_name or user.email.split('@')[0],
            'job_title': job.title,
            'school_name': job.school_name,
            'application_date': application.applied_at.strftime('%B %d, %Y'),
        }

        # Render email templates
        subject = f"You've Been Shortlisted - {job.title} at {job.school_name}"
        text_content = render_to_string('emails/candidate_shortlisted.txt', context)
        html_content = render_to_string('emails/candidate_shortlisted.html', context)

        # Create email message
        recipient_email = get_recipient_email(user.email)
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email]
        )

        # Attach HTML version
        email.attach_alternative(html_content, "text/html")

        # Send email
        email.send(fail_silently=False)

        logger.info(f"Candidate shortlisted email sent to {user.email} for job {job.id}")
        return True

    except Exception as e:
        logger.error(f"Failed to send candidate shortlisted email to {user.email}: {str(e)}")
        return False


@send_email_safe
def send_interview_invitation_email(application, interview_details=None):
    """
    Send an interview invitation email to the candidate using HTML template.

    Args:
        application: JobApplication object
        interview_details: dict (optional) - Contains interview_date, interview_time,
                          interview_format, interview_panel

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        user = application.user
        job = application.job

        # Prepare context for email template
        context = {
            'teacher_name': user.full_name or user.first_name or user.email.split('@')[0],
            'job_title': job.title,
            'school_name': job.school_name,
            'interview_date': interview_details.get('interview_date', '') if interview_details else '',
            'interview_time': interview_details.get('interview_time', '') if interview_details else '',
            'interview_format': interview_details.get('interview_format', '') if interview_details else '',
            'interview_panel': interview_details.get('interview_panel', '') if interview_details else '',
        }

        # Render email templates
        subject = f"Interview Invitation - {job.title} at {job.school_name}"
        text_content = render_to_string('emails/interview_invitation.txt', context)
        html_content = render_to_string('emails/interview_invitation.html', context)

        # Create email message
        recipient_email = get_recipient_email(user.email)
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email]
        )

        # Attach HTML version
        email.attach_alternative(html_content, "text/html")

        # Send email
        email.send(fail_silently=True)

        logger.info(f"Interview invitation email sent to {user.email} for job {job.id}")
        return True

    except Exception as e:
        logger.error(f"Failed to send interview invitation email to {user.email}: {str(e)}")
        return False


@send_email_safe
def send_job_offer_email(application):
    """
    Send a job offer congratulations email to the candidate using HTML template.

    Args:
        application: JobApplication object

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        user = application.user
        job = application.job

        # Prepare context for email template
        context = {
            'teacher_name': user.full_name or user.first_name or user.email.split('@')[0],
            'job_title': job.title,
            'school_name': job.school_name,
        }

        # Render email templates
        subject = f"Congratulations - {job.title} at {job.school_name}"
        text_content = render_to_string('emails/job_offer.txt', context)
        html_content = render_to_string('emails/job_offer.html', context)

        # Create email message
        recipient_email = get_recipient_email(user.email)
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email]
        )

        # Attach HTML version
        email.attach_alternative(html_content, "text/html")

        # Send email
        email.send(fail_silently=False)

        logger.info(f"Job offer email sent to {user.email} for job {job.id}")
        return True

    except Exception as e:
        logger.error(f"Failed to send job offer email to {user.email}: {str(e)}")
        return False


@send_email_safe
def send_rejection_email(application):
    """
    Send a supportive rejection email to the candidate using HTML template.

    Args:
        application: JobApplication object

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        user = application.user
        job = application.job

        # Prepare context for email template
        context = {
            'teacher_name': user.full_name or user.first_name or user.email.split('@')[0],
            'job_title': job.title,
            'school_name': job.school_name,
        }

        # Render email templates
        subject = f"Outcome of Your Application - {job.title} at {job.school_name}"
        text_content = render_to_string('emails/application_rejected.txt', context)
        html_content = render_to_string('emails/application_rejected.html', context)

        # Create email message
        recipient_email = get_recipient_email(user.email)
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email]
        )

        # Attach HTML version
        email.attach_alternative(html_content, "text/html")

        # Send email
        email.send(fail_silently=False)

        logger.info(f"Rejection email sent to {user.email} for job {job.id}")
        return True

    except Exception as e:
        logger.error(f"Failed to send rejection email to {user.email}: {str(e)}")
        return False


@send_email_safe
def send_application_status_update_email(application, old_status, new_status):
    """
    Send an email notification when application status changes.

    Args:
        application: JobApplication object
        old_status: str - previous status
        new_status: str - new status

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        user = application.user
        job = application.job

        # If status is 'shortlisted', use the detailed shortlisted email template
        if new_status == 'shortlisted':
            return send_candidate_shortlisted_email(application)

        # If status is 'accepted', use the job offer email template
        if new_status == 'accepted':
            return send_job_offer_email(application)

        # If status is 'rejected', use the supportive rejection email template
        if new_status == 'rejected':
            return send_rejection_email(application)

        # Define status messages for other statuses (only 'reviewed' now)
        status_messages = {
            'reviewed': 'Your application is currently under review by our recruitment team.',
        }

        if new_status not in status_messages:
            return False

        # Prepare context
        context = {
            'teacher_name': user.full_name or user.first_name or user.email.split('@')[0],
            'job_title': job.title,
            'school_name': job.school_name,
            'status': new_status.title(),
            'status_message': status_messages[new_status],
            'application_date': application.applied_at.strftime('%B %d, %Y'),
        }

        # For now, use a simple text email (you can create a template later)
        subject = f'Application Status Update - {job.title}'

        message = f"""Dear {context['teacher_name']},

We wanted to update you on your application for the {context['job_title']} position at {context['school_name']}.

Status: {context['status']}

{context['status_message']}

If you have any questions, please don't hesitate to contact us.

Kind regards,
The TIC Recruitment Team

www.ticrecruitment.com
"""

        # Send email
        from django.core.mail import send_mail
        recipient_email = get_recipient_email(user.email)
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False
        )

        logger.info(f"Application status update email sent to {user.email} - Status: {new_status}")
        return True

    except Exception as e:
        logger.error(f"Failed to send status update email: {str(e)}")
        return False

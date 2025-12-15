from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class TeacherProfile(models.Model):
    QUALIFIED_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
    ]

    ENGLISH_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
    ]

    POSITION_CHOICES = [
        ('teacher', 'Teacher'),
        ('leader', 'Senior Leader'),
        ('other', 'Other'),
    ]

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('others', 'Others'),
    ]

    ROLE_CHOICES = [
        ('teacher', 'Teacher'),
        ('assistant_teacher', 'Assistant Teacher'),
        ('senior_leader', 'Senior Leader'),
    ]

    LEADERSHIP_ROLE_CHOICES = [
        ('coordinator', 'Coordinator'),
        ('hod', 'Head of Department'),
        ('assistant_principal', 'Assistant Principal'),
        ('principal', 'Principal'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')

    # Step 1 - Basic Information
    qualified = models.CharField(max_length=10, choices=QUALIFIED_CHOICES)
    english = models.CharField(max_length=10, choices=ENGLISH_CHOICES)
    position = models.CharField(max_length=20, choices=POSITION_CHOICES)

    # Step 2 - Personal Details
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    nationality = models.CharField(max_length=100)
    second_nationality = models.BooleanField(default=False)
    cv_file = models.FileField(upload_to='cvs/', blank=True, null=True)
    hear_from = models.CharField(max_length=200, blank=True)

    # Step 3 - Teaching Experience
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, blank=True)
    subject = models.CharField(max_length=100, blank=True)
    age_group = models.CharField(max_length=50, blank=True)
    curriculum = models.JSONField(default=list, blank=True)

    # Step 4 - Leadership Experience
    leadership_role = models.CharField(max_length=30, choices=LEADERSHIP_ROLE_CHOICES, blank=True, null=True)

    # Step 5 - Availability
    job_alerts = models.BooleanField(default=False)
    available_day = models.CharField(max_length=2, blank=True)
    available_month = models.CharField(max_length=2, blank=True)
    available_year = models.CharField(max_length=4, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'teacher_profiles'
        verbose_name = 'Teacher Profile'
        verbose_name_plural = 'Teacher Profiles'

    def __str__(self):
        return f"{self.user.email} - Teacher Profile"

    @property
    def available_from(self):
        if self.available_day and self.available_month and self.available_year:
            return f"{self.available_year}-{self.available_month}-{self.available_day}"
        return None


class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('remote', 'Remote'),
        ('casual', 'Casual'),
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
    ]

    SCHOOL_TYPE_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('charter', 'Charter'),
        ('international', 'International'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('closed', 'Closed'),
    ]

    GENDER_PREFERENCE_CHOICES = [
        ('any', 'Any'),
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    SALARY_PACKAGE_CHOICES = [
        ('to_be_confirmed', 'To Be Confirmed'),
        ('tax_free', 'Tax Free Salary'),
        ('competitive', 'Competitive salary based on experience'),
    ]

    # Basic Information
    title = models.CharField(max_length=200)
    school_name = models.CharField(max_length=200)
    school_avatar = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=200)

    # Job Details
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    school_type = models.CharField(max_length=20, choices=SCHOOL_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    gender_preference = models.CharField(max_length=10, choices=GENDER_PREFERENCE_CHOICES, default='any')

    # Job Description
    summary = models.TextField(blank=True)
    description = models.TextField()
    requirements = models.TextField(blank=True)

    # Additional Details
    level = models.CharField(max_length=100, blank=True)
    subjects = models.JSONField(default=list, blank=True)
    curriculum = models.CharField(max_length=100, blank=True)
    education_stage = models.CharField(max_length=100, blank=True)
    contract_type = models.CharField(max_length=100, blank=True)

    # Compensation & Benefits
    international_package = models.CharField(max_length=20, choices=SALARY_PACKAGE_CHOICES, blank=True)
    benefits = models.JSONField(default=list, blank=True)  # Array of: Medical Insurance, Annual Flight, Housing, Tuition Concession

    # Dates
    date_posted = models.DateTimeField(auto_now_add=True)
    closing_date = models.DateField(blank=True, null=True)
    job_start_date = models.DateField(blank=True, null=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'jobs'
        verbose_name = 'Job'
        verbose_name_plural = 'Jobs'
        ordering = ['-date_posted']

    def __str__(self):
        return f"{self.title} at {self.school_name}"

    @property
    def is_expired(self):
        if self.closing_date:
            from datetime import date
            return date.today() > self.closing_date
        return False


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')

    # Application files
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    cover_letter = models.FileField(upload_to='cover_letters/', blank=True, null=True)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'job_applications'
        verbose_name = 'Job Application'
        verbose_name_plural = 'Job Applications'
        ordering = ['-applied_at']
        unique_together = ['user', 'job']  # Prevent duplicate applications

    def __str__(self):
        return f"{self.user.email} - {self.job.title}"


class SavedJob(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')

    # Timestamps
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'saved_jobs'
        verbose_name = 'Saved Job'
        verbose_name_plural = 'Saved Jobs'
        ordering = ['-saved_at']
        unique_together = ['user', 'job']  # Prevent duplicate saves

    def __str__(self):
        return f"{self.user.email} saved {self.job.title}"

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, TeacherProfile, Job, JobApplication, SavedJob


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled.')
                data['user'] = user
                return data
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'phone', 'date_joined', 'subscription_status']
        read_only_fields = ['id', 'date_joined', 'subscription_status']


class TeacherProfileSerializer(serializers.ModelSerializer):
    available_from = serializers.ReadOnlyField()

    class Meta:
        model = TeacherProfile
        fields = [
            'id', 'qualified', 'english', 'position', 'gender', 'nationality',
            'second_nationality', 'cv_file', 'hear_from', 'roles', 'subjects',
             'age_group', 'curriculum', 'leadership_role', 'job_alerts',
            'available_date', 'available_from',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for viewing complete user profile with teacher profile"""
    full_name = serializers.ReadOnlyField()
    teacher_profile = TeacherProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'phone', 'date_joined', 'subscription_status', 'teacher_profile']
        read_only_fields = ['id', 'date_joined', 'subscription_status']


class PreRegisterSerializer(serializers.Serializer):
    VALID_QUALIFIED = ['yes', 'no']
    VALID_ENGLISH = ['yes', 'no']
    VALID_POSITIONS = ['teacher', 'leader', 'other']
    VALID_GENDERS = ['male', 'female', 'others']
    VALID_ROLES = [
        'academic_registrar', 'business_manager', 'careers_counsellor', 'deputy_head_primary',
        'deputy_head_secondary', 'deputy_head_school', 'director', 'director_of_studies',
        'educational_psychologist', 'head_of_department', 'head_of_early_years',
        'head_of_prep_school', 'head_of_primary', 'head_of_secondary', 'head_of_section',
        'head_of_subject', 'head_of_year', 'head_teacher', 'house_master', 'house_mistress',
        'ib_coordinator', 'inspector', 'phase_coordinator', 'principal', 'principal_inspector',
        'psychologist', 'second_in_department', 'senior_inspector', 'teacher', 'vice_director',
        'vice_principal'
    ]
    VALID_LEADERSHIP_ROLES = ['coordinator', 'hod', 'assistant_principal', 'principal']
    VALID_CURRICULA = [
        'American', 'Australian', 'Canadian', 'IB Dip', 'IB MYP',
        'IB PYP', 'Indian', 'IPC', 'New Zealand', 'South African', 'UK National'
    ]
    ALLOWED_FILE_EXTENSIONS = ['pdf', 'doc', 'docx']
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

    # User fields
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, required=False, min_length=8, max_length=128)
    first_name = serializers.CharField(max_length=100, min_length=1)
    last_name = serializers.CharField(max_length=100, min_length=1)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    # Teacher Profile fields - Step 1
    qualified = serializers.CharField(max_length=10)
    english = serializers.CharField(max_length=10)
    position = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )

    # Step 2 - Personal Details
    gender = serializers.CharField(max_length=10)
    nationality = serializers.CharField(max_length=100, min_length=2)
    second_nationality = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    cv_file = serializers.FileField(required=False, allow_null=True)
    hear_from = serializers.CharField(max_length=200, required=False, allow_blank=True)

    # Step 3 - Teaching Experience
    roles = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )
    subjects = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )
    age_group = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )
    curriculum = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )

    # Step 4 - Leadership Experience
    leadership_role = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )

    # Step 5 - Availability
    job_alerts = serializers.BooleanField(default=False)
    available_date = serializers.DateField(required=False, allow_null=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("First name cannot contain numbers.")
        return value.strip()

    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Last name cannot be empty.")
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("Last name cannot contain numbers.")
        return value.strip()

    def validate_phone(self, value):
        if value and value.strip():
            # Remove common phone formatting characters
            cleaned = value.strip().replace(' ', '').replace('-', '').replace('(', '').replace(')', '').replace('+', '')
            # Check if remaining characters are digits
            if not cleaned.isdigit():
                raise serializers.ValidationError("Phone number can only contain digits, spaces, hyphens, parentheses, and plus sign.")
            return value.strip()
        return value

    def validate_qualified(self, value):
        if value.lower() not in self.VALID_QUALIFIED:
            raise serializers.ValidationError(f"Qualified must be one of: {', '.join(self.VALID_QUALIFIED)}")
        return value.lower()

    def validate_english(self, value):
        if value.lower() not in self.VALID_ENGLISH:
            raise serializers.ValidationError(f"English must be one of: {', '.join(self.VALID_ENGLISH)}")
        return value.lower()

    def validate_position(self, value):
        if value:
            invalid_positions = [p for p in value if p.lower() not in self.VALID_POSITIONS]
            if invalid_positions:
                raise serializers.ValidationError(
                    f"Invalid position(s): {', '.join(invalid_positions)}. "
                    f"Valid options: {', '.join(self.VALID_POSITIONS)}"
                )
            return [p.lower() for p in value]
        return value

    def validate_gender(self, value):
        if value.lower() not in self.VALID_GENDERS:
            raise serializers.ValidationError(f"Gender must be one of: {', '.join(self.VALID_GENDERS)}")
        return value.lower()

    def validate_nationality(self, value):
        if not value.strip():
            raise serializers.ValidationError("Nationality cannot be empty.")
        return value.strip()

    def validate_cv_file(self, value):
        if value:
            # Check file size
            if value.size > self.MAX_FILE_SIZE:
                raise serializers.ValidationError(f"File size cannot exceed {self.MAX_FILE_SIZE / (1024*1024)}MB.")

            # Check file extension
            file_extension = value.name.split('.')[-1].lower()
            if file_extension not in self.ALLOWED_FILE_EXTENSIONS:
                raise serializers.ValidationError(
                    f"Only {', '.join(self.ALLOWED_FILE_EXTENSIONS)} files are allowed."
                )
        return value

    def validate_roles(self, value):
        if value:
            invalid_roles = [r for r in value if r.lower() not in self.VALID_ROLES]
            if invalid_roles:
                raise serializers.ValidationError(
                    f"Invalid role(s): {', '.join(invalid_roles)}. "
                    f"Valid options: {', '.join(self.VALID_ROLES)}"
                )
            return [r.lower() for r in value]
        return []

    def validate_subjects(self, value):
        # Subject can be any string, just return as is
        return value if value else []

    def validate_age_group(self, value):
        # Age group can be any string, just return as is
        return value if value else []

    def validate_curriculum(self, value):
        if value:
            invalid_curricula = [c for c in value if c not in self.VALID_CURRICULA]
            if invalid_curricula:
                raise serializers.ValidationError(
                    f"Invalid curriculum(s): {', '.join(invalid_curricula)}. "
                    f"Valid options: {', '.join(self.VALID_CURRICULA)}"
                )
        return value

    # def validate_leadership_role(self, value):
    #     if value:
    #         invalid_roles = [r for r in value if r.lower() not in self.VALID_LEADERSHIP_ROLES]
    #         if invalid_roles:
    #             raise serializers.ValidationError(
    #                 f"Invalid leadership role(s): {', '.join(invalid_roles)}. "
    #                 f"Valid options: {', '.join(self.VALID_LEADERSHIP_ROLES)}"
    #             )
    #         return [r.lower() for r in value]
    #     return value

    def validate_available_date(self, value):
        if value:
            from datetime import date
            current_date = date.today()
            # Check if date is not too far in the past
            if value < current_date.replace(year=current_date.year - 1):
                raise serializers.ValidationError("Available date cannot be more than a year in the past.")
        return value

    def create(self, validated_data):
        from django.db import transaction

        # Generate a random password if not provided
        import secrets
        password = validated_data.pop('password', secrets.token_urlsafe(16))

        # Extract user data
        user_data = {
            'email': validated_data.pop('email'),
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'phone': validated_data.pop('phone', ''),
        }

        # Use atomic transaction to ensure both User and TeacherProfile are created together
        # If either fails, both are rolled back
        with transaction.atomic():
            # Create user
            user = User.objects.create_user(
                password=password,
                **user_data
            )

            # Extract teacher profile data
            profile_data = {
                'user': user,
                'qualified': validated_data.get('qualified'),
                'english': validated_data.get('english'),
                'position': validated_data.get('position', []),
                'gender': validated_data.get('gender'),
                'nationality': validated_data.get('nationality'),
                'second_nationality': validated_data.get('second_nationality', ''),
                'cv_file': validated_data.get('cv_file'),
                'hear_from': validated_data.get('hear_from', ''),
                'roles': validated_data.get('roles', []),
                'subjects': validated_data.get('subjects', []),
                'age_group': validated_data.get('age_group', []),
                'curriculum': validated_data.get('curriculum', []),
                'leadership_role': validated_data.get('leadership_role', []),
                'job_alerts': validated_data.get('job_alerts', False),
                'available_date': validated_data.get('available_date'),
            }

            # Create teacher profile
            teacher_profile = TeacherProfile.objects.create(**profile_data)

        return {
            'user': user,
            'teacher_profile': teacher_profile
        }


class JobSerializer(serializers.ModelSerializer):
    is_expired = serializers.ReadOnlyField()
    is_applied = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'school_name', 'school_avatar', 'location',
            'job_type', 'school_type', 'status', 'gender_preference',
            'summary', 'description', 'requirements', 'level', 'subjects',
            'curriculum', 'education_stage', 'contract_type',
            'international_package', 'benefits', 'package',
            'date_posted', 'closing_date', 'job_start_date', 'is_expired', 'is_applied', 'is_saved',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'date_posted', 'created_at', 'updated_at']

    def get_is_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return JobApplication.objects.filter(user=request.user, job=obj).exists()
        return False

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False


class JobApplicationSerializer(serializers.ModelSerializer):
    ALLOWED_FILE_EXTENSIONS = ['pdf', 'doc', 'docx']
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

    job_title = serializers.CharField(source='job.title', read_only=True)
    job_school = serializers.CharField(source='job.school_name', read_only=True)
    use_profile_resume = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'job_school', 'resume', 'cover_letter',
            'status', 'applied_at', 'updated_at', 'use_profile_resume'
        ]
        read_only_fields = ['id', 'status', 'applied_at', 'updated_at']

    def validate_resume(self, value):
        if value:
            # Check file size
            if value.size > self.MAX_FILE_SIZE:
                raise serializers.ValidationError(
                    f"File size cannot exceed {self.MAX_FILE_SIZE / (1024*1024)}MB."
                )

            # Check file extension
            file_extension = value.name.split('.')[-1].lower()
            if file_extension not in self.ALLOWED_FILE_EXTENSIONS:
                raise serializers.ValidationError(
                    f"Only {', '.join(self.ALLOWED_FILE_EXTENSIONS)} files are allowed."
                )
        return value

    def validate_cover_letter(self, value):
        if value:
            # Check file size
            if value.size > self.MAX_FILE_SIZE:
                raise serializers.ValidationError(
                    f"File size cannot exceed {self.MAX_FILE_SIZE / (1024*1024)}MB."
                )

            # Check file extension
            file_extension = value.name.split('.')[-1].lower()
            if file_extension not in self.ALLOWED_FILE_EXTENSIONS:
                raise serializers.ValidationError(
                    f"Only {', '.join(self.ALLOWED_FILE_EXTENSIONS)} files are allowed."
                )
        return value

    def validate(self, data):
        # Check if user has already applied to this job
        user = self.context['request'].user
        job = data.get('job')

        if JobApplication.objects.filter(user=user, job=job).exists():
            raise serializers.ValidationError("You have already applied to this job.")

        # If use_profile_resume is True, check if user has a CV in their profile
        use_profile_resume = data.get('use_profile_resume', False)
        if use_profile_resume:
            try:
                teacher_profile = user.teacher_profile
                if not teacher_profile.cv_file:
                    raise serializers.ValidationError({
                        'use_profile_resume': 'No resume found in your profile. Please upload a resume to your profile first or provide one in this application.'
                    })
            except AttributeError:
                raise serializers.ValidationError({
                    'use_profile_resume': 'No teacher profile found. Please complete your profile first.'
                })

        return data

    def create(self, validated_data):
        from django.core.files.base import ContentFile
        import os

        # Automatically set the user from the request
        user = self.context['request'].user
        validated_data['user'] = user

        # If use_profile_resume is True, copy the CV from teacher profile
        use_profile_resume = validated_data.pop('use_profile_resume', False)
        if use_profile_resume:
            teacher_profile = user.teacher_profile
            profile_cv = teacher_profile.cv_file

            # Create a copy of the file so it's independent of the profile CV
            if profile_cv:
                # Read the file content
                profile_cv.open('rb')
                file_content = profile_cv.read()
                profile_cv.close()

                # Get the original filename
                original_filename = os.path.basename(profile_cv.name)

                # Create a new file with the same content
                validated_data['resume'] = ContentFile(file_content, name=original_filename)

        return super().create(validated_data)


class UpdatePasswordSerializer(serializers.Serializer):
    current = serializers.CharField(write_only=True, required=True)
    new = serializers.CharField(write_only=True, required=True, min_length=8, max_length=128)
    confirm = serializers.CharField(write_only=True, required=True)

    def validate_current(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, data):
        # Check if new password matches confirmation
        if data['new'] != data['confirm']:
            raise serializers.ValidationError({
                'confirm': 'New password and confirmation do not match.'
            })

        # Check if new password is different from current
        if data['current'] == data['new']:
            raise serializers.ValidationError({
                'new': 'New password must be different from current password.'
            })

        return data

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new'])
        user.save()
        return user


class SavedJobSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'job_details', 'saved_at']
        read_only_fields = ['id', 'saved_at']

    def validate(self, data):
        # Check if user has already saved this job
        user = self.context['request'].user
        job = data.get('job')

        if SavedJob.objects.filter(user=user, job=job).exists():
            raise serializers.ValidationError("You have already saved this job.")

        return data

    def create(self, validated_data):
        # Automatically set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


# Admin Serializers
class AdminCandidateSerializer(serializers.ModelSerializer):
    """Serializer for listing all candidates/teachers"""
    full_name = serializers.ReadOnlyField()
    teacher_profile = TeacherProfileSerializer(read_only=True)
    total_applications = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'is_active', 'date_joined', 'teacher_profile', 'total_applications'
        ]
        read_only_fields = ['id', 'date_joined']

    def get_total_applications(self, obj):
        return JobApplication.objects.filter(user=obj).count()


class AdminJobApplicationSerializer(serializers.ModelSerializer):
    """Serializer for job applications with user details"""
    applicant_email = serializers.EmailField(source='user.email', read_only=True)
    applicant_name = serializers.CharField(source='user.full_name', read_only=True)
    applicant_profile = ProfileSerializer(source='user', read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'applicant_email', 'applicant_name', 'applicant_profile',
            'resume', 'cover_letter', 'status', 'applied_at', 'updated_at'
        ]
        read_only_fields = ['id', 'applied_at', 'updated_at']


class AdminJobSerializer(serializers.ModelSerializer):
    """Serializer for jobs with application count and applicants"""
    is_expired = serializers.ReadOnlyField()
    applications_count = serializers.SerializerMethodField()
    applications = AdminJobApplicationSerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'school_name', 'school_avatar', 'location',
            'job_type', 'school_type', 'status', 'gender_preference',
            'summary', 'description', 'requirements', 'level', 'subjects',
            'curriculum', 'education_stage', 'contract_type',
            'international_package', 'benefits', 'package',
            'date_posted', 'closing_date', 'job_start_date', 'is_expired', 'applications_count',
            'applications', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'date_posted', 'created_at', 'updated_at']

    def get_applications_count(self, obj):
        return obj.applications.count()


class AdminJobCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating jobs (admin only)"""

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'school_name', 'school_avatar', 'location',
            'job_type', 'school_type', 'status', 'gender_preference',
            'summary', 'description', 'requirements', 'level', 'subjects',
            'curriculum', 'education_stage', 'contract_type',
            'international_package', 'benefits', 'package',
            'closing_date', 'job_start_date', 'date_posted', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'date_posted', 'created_at', 'updated_at']

    def validate_status(self, value):
        """Validate job status"""
        valid_statuses = ['active', 'expired', 'closed']
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Status must be one of: {', '.join(valid_statuses)}"
            )
        return value

    def validate_job_type(self, value):
        """Validate job type"""
        valid_types = ['deputy_principal', 'teacher', 'head_of_school']
        if value not in valid_types:
            raise serializers.ValidationError(
                f"Job type must be one of: {', '.join(valid_types)}"
            )
        return value

    def validate_school_type(self, value):
        """Validate school type"""
        valid_types = ['public', 'private', 'charter', 'international']
        if value not in valid_types:
            raise serializers.ValidationError(
                f"School type must be one of: {', '.join(valid_types)}"
            )
        return value

    def validate_gender_preference(self, value):
        """Validate gender preference"""
        valid_preferences = ['any', 'male', 'female', 'other']
        if value not in valid_preferences:
            raise serializers.ValidationError(
                f"Gender preference must be one of: {', '.join(valid_preferences)}"
            )
        return value

    def validate_international_package(self, value):
        """Validate international package"""
        if value:
            valid_packages = ['to_be_confirmed', 'tax_free', 'competitive']
            if value not in valid_packages:
                raise serializers.ValidationError(
                    f"International package must be one of: {', '.join(valid_packages)}"
                )
        return value

    def validate_benefits(self, value):
        """Validate benefits"""
        if value:
            valid_benefits = ['Medical Insurance', 'Annual Flight', 'Housing', 'Tuition Concession']
            invalid_benefits = [b for b in value if b not in valid_benefits]
            if invalid_benefits:
                raise serializers.ValidationError(
                    f"Invalid benefit(s): {', '.join(invalid_benefits)}. "
                    f"Valid options: {', '.join(valid_benefits)}"
                )
        return value


# Profile Serializers
class UpdateProfileSerializer(serializers.Serializer):
    """Serializer for updating both user info and teacher profile"""
    VALID_QUALIFIED = ['yes', 'no']
    VALID_ENGLISH = ['yes', 'no']
    VALID_POSITIONS = ['teacher', 'leader', 'other']
    VALID_GENDERS = ['male', 'female', 'others']
    VALID_ROLES = [
        'academic_registrar', 'business_manager', 'careers_counsellor', 'deputy_head_primary',
        'deputy_head_secondary', 'deputy_head_school', 'director', 'director_of_studies',
        'educational_psychologist', 'head_of_department', 'head_of_early_years',
        'head_of_prep_school', 'head_of_primary', 'head_of_secondary', 'head_of_section',
        'head_of_subject', 'head_of_year', 'head_teacher', 'house_master', 'house_mistress',
        'ib_coordinator', 'inspector', 'phase_coordinator', 'principal', 'principal_inspector',
        'psychologist', 'second_in_department', 'senior_inspector', 'teacher', 'vice_director',
        'vice_principal'
    ]
    VALID_LEADERSHIP_ROLES = ['coordinator', 'hod', 'assistant_principal', 'principal']
    VALID_CURRICULA = [
        'American', 'Australian', 'Canadian', 'IB Dip', 'IB MYP',
        'IB PYP', 'Indian', 'IPC', 'New Zealand', 'South African', 'UK National'
    ]
    ALLOWED_FILE_EXTENSIONS = ['pdf', 'doc', 'docx']
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

    # User fields
    first_name = serializers.CharField(max_length=100, required=False)
    last_name = serializers.CharField(max_length=100, required=False)
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    # Teacher Profile fields
    qualified = serializers.CharField(max_length=10, required=False)
    english = serializers.CharField(max_length=10, required=False)
    position = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    gender = serializers.CharField(max_length=10, required=False)
    nationality = serializers.CharField(max_length=100, required=False)
    second_nationality = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    cv_file = serializers.FileField(required=False, allow_null=True)
    hear_from = serializers.CharField(max_length=200, required=False, allow_blank=True)
    roles = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    subjects = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    age_group = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    curriculum = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    leadership_role = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    job_alerts = serializers.BooleanField(required=False)
    available_date = serializers.DateField(required=False, allow_null=True)

    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("First name cannot contain numbers.")
        return value.strip()

    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Last name cannot be empty.")
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("Last name cannot contain numbers.")
        return value.strip()

    def validate_phone(self, value):
        if value and value.strip():
            # Remove common phone formatting characters
            cleaned = value.strip().replace(' ', '').replace('-', '').replace('(', '').replace(')', '').replace('+', '')
            # Check if remaining characters are digits
            if not cleaned.isdigit():
                raise serializers.ValidationError("Phone number can only contain digits, spaces, hyphens, parentheses, and plus sign.")
            return value.strip()
        return value

    def validate_qualified(self, value):
        if value and value.lower() not in self.VALID_QUALIFIED:
            raise serializers.ValidationError(f"Qualified must be one of: {', '.join(self.VALID_QUALIFIED)}")
        return value.lower() if value else value

    def validate_english(self, value):
        if value and value.lower() not in self.VALID_ENGLISH:
            raise serializers.ValidationError(f"English must be one of: {', '.join(self.VALID_ENGLISH)}")
        return value.lower() if value else value

    def validate_position(self, value):
        if value:
            invalid_positions = [p for p in value if p.lower() not in self.VALID_POSITIONS]
            if invalid_positions:
                raise serializers.ValidationError(
                    f"Invalid position(s): {', '.join(invalid_positions)}. "
                    f"Valid options: {', '.join(self.VALID_POSITIONS)}"
                )
            return [p.lower() for p in value]
        return value

    def validate_gender(self, value):
        if value and value.lower() not in self.VALID_GENDERS:
            raise serializers.ValidationError(f"Gender must be one of: {', '.join(self.VALID_GENDERS)}")
        return value.lower() if value else value

    def validate_nationality(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("Nationality cannot be empty.")
        return value.strip() if value else value

    def validate_cv_file(self, value):
        if value:
            if value.size > self.MAX_FILE_SIZE:
                raise serializers.ValidationError(f"File size cannot exceed {self.MAX_FILE_SIZE / (1024*1024)}MB.")

            file_extension = value.name.split('.')[-1].lower()
            if file_extension not in self.ALLOWED_FILE_EXTENSIONS:
                raise serializers.ValidationError(
                    f"Only {', '.join(self.ALLOWED_FILE_EXTENSIONS)} files are allowed."
                )
        return value

    def validate_roles(self, value):
        if value:
            invalid_roles = [r for r in value if r.lower() not in self.VALID_ROLES]
            if invalid_roles:
                raise serializers.ValidationError(
                    f"Invalid role(s): {', '.join(invalid_roles)}. "
                    f"Valid options: {', '.join(self.VALID_ROLES)}"
                )
            return [r.lower() for r in value]
        return []

    def validate_subjects(self, value):
        # Subject can be any string array, just ensure it's a list
        return value if value else []

    def validate_age_group(self, value):
        # Age group can be any string array, just ensure it's a list
        return value if value else []

    def validate_curriculum(self, value):
        if value:
            invalid_curricula = [c for c in value if c not in self.VALID_CURRICULA]
            if invalid_curricula:
                raise serializers.ValidationError(
                    f"Invalid curriculum(s): {', '.join(invalid_curricula)}. "
                    f"Valid options: {', '.join(self.VALID_CURRICULA)}"
                )
        return value

    # def validate_leadership_role(self, value):
    #     if value:
    #         invalid_roles = [r for r in value if r.lower() not in self.VALID_LEADERSHIP_ROLES]
    #         if invalid_roles:
    #             raise serializers.ValidationError(
    #                 f"Invalid leadership role(s): {', '.join(invalid_roles)}. "
    #                 f"Valid options: {', '.join(self.VALID_LEADERSHIP_ROLES)}"
    #             )
    #         return [r.lower() for r in value]
    #     return value

    def validate_available_date(self, value):
        if value:
            from datetime import date
            current_date = date.today()
            # Check if date is not too far in the past
            if value < current_date.replace(year=current_date.year - 1):
                raise serializers.ValidationError("Available date cannot be more than a year in the past.")
        return value

    def validate(self, data):
        # No cross-field validation needed currently
        return data

    def update(self, instance, validated_data):
        # Extract user fields
        user_fields = ['first_name', 'last_name', 'email', 'phone']
        user_data = {k: v for k, v in validated_data.items() if k in user_fields}

        # Update user if user fields are present
        if user_data:
            for key, value in user_data.items():
                setattr(instance, key, value)
            instance.save()

        # Extract teacher profile fields
        teacher_profile_fields = [
            'qualified', 'english', 'position', 'gender', 'nationality',
            'second_nationality', 'cv_file', 'hear_from', 'roles', 'subjects',
            'age_group', 'curriculum', 'leadership_role', 'job_alerts',
            'available_date'
        ]
        teacher_data = {k: v for k, v in validated_data.items() if k in teacher_profile_fields}

        # Update teacher profile if teacher fields are present
        if teacher_data:
            try:
                teacher_profile = instance.teacher_profile
                for key, value in teacher_data.items():
                    setattr(teacher_profile, key, value)
                teacher_profile.save()
            except AttributeError:
                pass  # Teacher profile doesn't exist, skip

        return instance

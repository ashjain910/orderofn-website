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
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class TeacherProfileSerializer(serializers.ModelSerializer):
    available_from = serializers.ReadOnlyField()

    class Meta:
        model = TeacherProfile
        fields = [
            'id', 'qualified', 'english', 'position', 'gender', 'nationality',
            'second_nationality', 'cv_file', 'hear_from', 'role', 'subject',
            'age_group', 'curriculum', 'leadership_role', 'job_alerts',
            'available_day', 'available_month', 'available_year', 'available_from',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PreRegisterSerializer(serializers.Serializer):
    VALID_QUALIFIED = ['yes', 'no']
    VALID_ENGLISH = ['yes', 'no']
    VALID_POSITIONS = ['teacher', 'leader', 'other']
    VALID_GENDERS = ['male', 'female', 'others']
    VALID_ROLES = ['teacher', 'assistant_teacher', 'senior_leader']
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
    firstName = serializers.CharField(max_length=100, min_length=1)
    lastName = serializers.CharField(max_length=100, min_length=1)

    # Teacher Profile fields - Step 1
    qualified = serializers.CharField(max_length=10)
    english = serializers.CharField(max_length=10)
    position = serializers.CharField(max_length=20)

    # Step 2 - Personal Details
    gender = serializers.CharField(max_length=10)
    nationality = serializers.CharField(max_length=100, min_length=2)
    secondNationality = serializers.BooleanField(default=False)
    cvFile = serializers.FileField(required=False, allow_null=True)
    hearFrom = serializers.CharField(max_length=200, required=False, allow_blank=True)

    # Step 3 - Teaching Experience
    role = serializers.CharField(max_length=30, required=False, allow_blank=True)
    subject = serializers.CharField(max_length=100, required=False, allow_blank=True)
    ageGroup = serializers.CharField(max_length=50, required=False, allow_blank=True)
    curriculum = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )

    # Step 4 - Leadership Experience
    leadershipRole = serializers.CharField(max_length=30, required=False, allow_blank=True, allow_null=True)

    # Step 5 - Availability
    exampleRadio = serializers.BooleanField(default=False)
    day = serializers.CharField(max_length=2, required=False, allow_blank=True)
    month = serializers.CharField(max_length=2, required=False, allow_blank=True)
    year = serializers.CharField(max_length=4, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def validate_firstName(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("First name cannot contain numbers.")
        return value.strip()

    def validate_lastName(self, value):
        if not value.strip():
            raise serializers.ValidationError("Last name cannot be empty.")
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("Last name cannot contain numbers.")
        return value.strip()

    def validate_qualified(self, value):
        if value.lower() not in self.VALID_QUALIFIED:
            raise serializers.ValidationError(f"Qualified must be one of: {', '.join(self.VALID_QUALIFIED)}")
        return value.lower()

    def validate_english(self, value):
        if value.lower() not in self.VALID_ENGLISH:
            raise serializers.ValidationError(f"English must be one of: {', '.join(self.VALID_ENGLISH)}")
        return value.lower()

    def validate_position(self, value):
        if value.lower() not in self.VALID_POSITIONS:
            raise serializers.ValidationError(f"Position must be one of: {', '.join(self.VALID_POSITIONS)}")
        return value.lower()

    def validate_gender(self, value):
        if value.lower() not in self.VALID_GENDERS:
            raise serializers.ValidationError(f"Gender must be one of: {', '.join(self.VALID_GENDERS)}")
        return value.lower()

    def validate_nationality(self, value):
        if not value.strip():
            raise serializers.ValidationError("Nationality cannot be empty.")
        return value.strip()

    def validate_cvFile(self, value):
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

    def validate_role(self, value):
        if value and value.lower() not in self.VALID_ROLES:
            raise serializers.ValidationError(f"Role must be one of: {', '.join(self.VALID_ROLES)}")
        return value.lower() if value else value

    def validate_curriculum(self, value):
        if value:
            invalid_curricula = [c for c in value if c not in self.VALID_CURRICULA]
            if invalid_curricula:
                raise serializers.ValidationError(
                    f"Invalid curriculum(s): {', '.join(invalid_curricula)}. "
                    f"Valid options: {', '.join(self.VALID_CURRICULA)}"
                )
        return value

    def validate_leadershipRole(self, value):
        if value and value.lower() not in self.VALID_LEADERSHIP_ROLES:
            raise serializers.ValidationError(
                f"Leadership role must be one of: {', '.join(self.VALID_LEADERSHIP_ROLES)}"
            )
        return value.lower() if value else value

    def validate_day(self, value):
        if value:
            try:
                day = int(value)
                if day < 1 or day > 31:
                    raise serializers.ValidationError("Day must be between 1 and 31.")
            except ValueError:
                raise serializers.ValidationError("Day must be a valid number.")
        return value

    def validate_month(self, value):
        if value:
            try:
                month = int(value)
                if month < 1 or month > 12:
                    raise serializers.ValidationError("Month must be between 1 and 12.")
            except ValueError:
                raise serializers.ValidationError("Month must be a valid number.")
        return value

    def validate_year(self, value):
        if value:
            try:
                year = int(value)
                from datetime import datetime
                current_year = datetime.now().year
                if year < current_year or year > current_year + 10:
                    raise serializers.ValidationError(
                        f"Year must be between {current_year} and {current_year + 10}."
                    )
            except ValueError:
                raise serializers.ValidationError("Year must be a valid number.")
        return value

    def validate(self, data):
        # Cross-field validation for availability date
        day = data.get('day')
        month = data.get('month')
        year = data.get('year')

        # If any date field is provided, all should be provided
        date_fields = [day, month, year]
        if any(date_fields) and not all(date_fields):
            raise serializers.ValidationError({
                'availability': 'If providing availability date, all fields (day, month, year) are required.'
            })

        # Validate complete date if all fields are present
        if all(date_fields):
            try:
                from datetime import datetime
                datetime(int(year), int(month), int(day))
            except ValueError:
                raise serializers.ValidationError({
                    'availability': 'Invalid date. Please check day, month, and year values.'
                })

        return data

    def create(self, validated_data):
        # Generate a random password if not provided
        import secrets
        password = validated_data.pop('password', secrets.token_urlsafe(16))

        # Extract user data
        user_data = {
            'email': validated_data.pop('email'),
            'first_name': validated_data.pop('firstName'),
            'last_name': validated_data.pop('lastName'),
        }

        # Create user
        user = User.objects.create_user(
            password=password,
            **user_data
        )

        # Extract teacher profile data and convert camelCase to snake_case
        profile_data = {
            'user': user,
            'qualified': validated_data.get('qualified'),
            'english': validated_data.get('english'),
            'position': validated_data.get('position'),
            'gender': validated_data.get('gender'),
            'nationality': validated_data.get('nationality'),
            'second_nationality': validated_data.get('secondNationality', False),
            'cv_file': validated_data.get('cvFile'),
            'hear_from': validated_data.get('hearFrom', ''),
            'role': validated_data.get('role', ''),
            'subject': validated_data.get('subject', ''),
            'age_group': validated_data.get('ageGroup', ''),
            'curriculum': validated_data.get('curriculum', []),
            'leadership_role': validated_data.get('leadershipRole', ''),
            'job_alerts': validated_data.get('exampleRadio', False),
            'available_day': validated_data.get('day', ''),
            'available_month': validated_data.get('month', ''),
            'available_year': validated_data.get('year', ''),
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
            'date_posted', 'closing_date', 'is_expired', 'is_applied', 'is_saved',
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

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'job_school', 'resume', 'cover_letter',
            'status', 'applied_at', 'updated_at'
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

        return data

    def create(self, validated_data):
        # Automatically set the user from the request
        validated_data['user'] = self.context['request'].user
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
    applicant_profile = TeacherProfileSerializer(source='user.teacher_profile', read_only=True)

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
            'date_posted', 'closing_date', 'is_expired', 'applications_count',
            'applications', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'date_posted', 'created_at', 'updated_at']

    def get_applications_count(self, obj):
        return obj.applications.count()

"""
Django management command to export teacher profiles to CSV.

Usage:
    python manage.py export_teachers
    python manage.py export_teachers --output my_teachers.csv
    python manage.py export_teachers --active-only
"""

import csv
from django.core.management.base import BaseCommand
from app.models import TeacherProfile


FIELDS = [
    'email',
    'first_name',
    'last_name',
    'phone',
    'date_joined',
    'subscription_status',
    'qualified',
    'english',
    'position',
    'gender',
    'nationality',
    'second_nationality',
    'roles',
    'subjects',
    'age_group',
    'curriculum',
    'leadership_role',
    'job_alerts',
    'available_date',
    'hear_from',
]


class Command(BaseCommand):
    help = 'Export teacher profiles to a CSV file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            type=str,
            default='teachers_export.csv',
            help='Output CSV filename (default: teachers_export.csv)',
        )
        parser.add_argument(
            '--active-only',
            action='store_true',
            help='Only export teachers with active or trialing subscriptions',
        )

    def handle(self, *args, **options):
        qs = TeacherProfile.objects.select_related('user').order_by('user__date_joined')

        if options['active_only']:
            qs = qs.filter(user__subscription_status__in=['active', 'trialing'])

        total = qs.count()
        if total == 0:
            self.stdout.write(self.style.WARNING('No teacher profiles found.'))
            return

        output_file = options['output']

        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=FIELDS)
            writer.writeheader()

            for profile in qs:
                user = profile.user
                writer.writerow({
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'phone': user.phone,
                    'date_joined': user.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
                    'subscription_status': user.subscription_status,
                    'qualified': profile.qualified,
                    'english': profile.english,
                    'position': ', '.join(profile.position) if profile.position else '',
                    'gender': profile.gender,
                    'nationality': profile.nationality,
                    'second_nationality': profile.second_nationality or '',
                    'roles': ', '.join(profile.roles) if profile.roles else '',
                    'subjects': ', '.join(profile.subjects) if profile.subjects else '',
                    'age_group': ', '.join(profile.age_group) if profile.age_group else '',
                    'curriculum': ', '.join(profile.curriculum) if profile.curriculum else '',
                    'leadership_role': ', '.join(profile.leadership_role) if profile.leadership_role else '',
                    'job_alerts': profile.job_alerts,
                    'available_date': profile.available_date.isoformat() if profile.available_date else '',
                    'hear_from': profile.hear_from,
                })

        self.stdout.write(self.style.SUCCESS(
            f'Exported {total} teacher(s) to {output_file}'
        ))

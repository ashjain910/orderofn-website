#!/usr/bin/env python
"""
Script to convert TeacherProfile string fields to JSON arrays for production.
Run this BEFORE running migrations on production.

Usage:
    python fix_production_data.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

def fix_teacher_profile_data():
    """Convert string fields to JSON arrays in teacher_profiles table"""

    print("Starting data conversion...")

    with connection.cursor() as cursor:
        # Get all teacher profiles
        cursor.execute("SELECT id, position, role, subject, age_group FROM teacher_profiles")
        profiles = cursor.fetchall()

        print(f"Found {len(profiles)} teacher profiles to convert")

        for profile_id, position, role, subject, age_group in profiles:
            updates = []
            params = []

            # Convert position
            if position and not (position.startswith('[') and position.endswith(']')):
                updates.append("position = ?")
                params.append(f'["{position}"]')
            elif not position or position == '':
                updates.append("position = ?")
                params.append('[]')

            # Convert role
            if role and not (role.startswith('[') and role.endswith(']')):
                updates.append("role = ?")
                params.append(f'["{role}"]')
            elif not role or role == '':
                updates.append("role = ?")
                params.append('[]')

            # Convert subject
            if subject and not (subject.startswith('[') and subject.endswith(']')):
                updates.append("subject = ?")
                params.append(f'["{subject}"]')
            elif not subject or subject == '':
                updates.append("subject = ?")
                params.append('[]')

            # Convert age_group
            if age_group and not (age_group.startswith('[') and age_group.endswith(']')):
                updates.append("age_group = ?")
                params.append(f'["{age_group}"]')
            elif not age_group or age_group == '':
                updates.append("age_group = ?")
                params.append('[]')

            # Update if needed
            if updates:
                params.append(profile_id)
                sql = f"UPDATE teacher_profiles SET {', '.join(updates)} WHERE id = ?"
                cursor.execute(sql, params)
                print(f"  Updated profile {profile_id}")

        print("\nData conversion completed!")
        print("You can now run: python manage.py migrate")

if __name__ == '__main__':
    try:
        fix_teacher_profile_data()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

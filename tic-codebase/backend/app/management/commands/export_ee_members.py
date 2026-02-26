"""
Django management command to export Expression Engine members to CSV.

This command connects to an Expression Engine database and exports
email addresses and first names to a CSV file for the welcome email campaign.

Usage:
    python manage.py export_ee_members --host localhost --database ee_db --user root --password pass
    python manage.py export_ee_members --output my_contacts.csv
"""

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
import csv
import sys
import getpass


class Command(BaseCommand):
    help = 'Export Expression Engine members to CSV for welcome email campaign'

    def add_arguments(self, parser):
        parser.add_argument(
            '--host',
            type=str,
            default='localhost',
            help='Database host (default: localhost)'
        )
        parser.add_argument(
            '--database',
            type=str,
            required=True,
            help='Expression Engine database name (required)'
        )
        parser.add_argument(
            '--user',
            type=str,
            default='root',
            help='Database user (default: root)'
        )
        parser.add_argument(
            '--password',
            type=str,
            help='Database password (will prompt if not provided)'
        )
        parser.add_argument(
            '--port',
            type=int,
            default=3306,
            help='Database port (default: 3306)'
        )
        parser.add_argument(
            '--table-prefix',
            type=str,
            default='exp_',
            help='EE table prefix (default: exp_)'
        )
        parser.add_argument(
            '--output',
            type=str,
            default='ee_members_export.csv',
            help='Output CSV filename (default: ee_members_export.csv)'
        )
        parser.add_argument(
            '--limit',
            type=int,
            help='Limit number of members to export (optional)'
        )
        parser.add_argument(
            '--exclude-test',
            action='store_true',
            help='Exclude emails containing "test" or "example"'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be exported without actually creating the file'
        )

    def handle(self, *args, **options):
        try:
            import mysql.connector
        except ImportError:
            raise CommandError(
                'mysql-connector-python is required. Install with: '
                'pip install mysql-connector-python'
            )

        # Get password if not provided
        password = options['password']
        if not password:
            password = getpass.getpass(
                f"Enter password for {options['user']}@{options['host']}: "
            )

        # Build query
        table_name = f"{options['table_prefix']}members"

        query = f"""
            SELECT
                email,
                CASE
                    WHEN screen_name IS NOT NULL AND screen_name != '' THEN screen_name
                    WHEN username IS NOT NULL AND username != '' THEN username
                    ELSE ''
                END AS first_name
            FROM {table_name}
            WHERE email IS NOT NULL
                AND email != ''
                AND email LIKE '%@%'
        """

        # Add exclusions if requested
        if options['exclude_test']:
            query += """
                AND email NOT LIKE '%test%'
                AND email NOT LIKE '%example%'
                AND email NOT LIKE '%@noreply%'
            """

        query += " ORDER BY join_date DESC"

        # Add limit if specified
        if options['limit']:
            query += f" LIMIT {options['limit']}"

        self.stdout.write(self.style.NOTICE(
            f"Connecting to {options['host']}:{options['port']}..."
        ))

        try:
            # Connect to database
            conn = mysql.connector.connect(
                host=options['host'],
                port=options['port'],
                database=options['database'],
                user=options['user'],
                password=password
            )
            cursor = conn.cursor()

            self.stdout.write(self.style.SUCCESS('✓ Connected to database'))

            # Execute query
            self.stdout.write(self.style.NOTICE('Executing query...'))
            cursor.execute(query)
            results = cursor.fetchall()

            if not results:
                self.stdout.write(self.style.WARNING('No members found!'))
                return

            self.stdout.write(self.style.SUCCESS(f'✓ Found {len(results)} members'))

            # Process results
            members = []
            skipped = 0

            for row in results:
                email, first_name = row

                # Clean and validate
                if email and '@' in email and '.' in email:
                    email = email.strip().lower()

                    # Clean first name - take first word if it's a full name
                    if first_name:
                        first_name = first_name.split()[0].strip()

                    members.append({
                        'email': email,
                        'first_name': first_name
                    })
                else:
                    skipped += 1

            if skipped > 0:
                self.stdout.write(self.style.WARNING(
                    f'Skipped {skipped} invalid email(s)'
                ))

            # Dry run mode
            if options['dry_run']:
                self.stdout.write(self.style.NOTICE('\n=== DRY RUN MODE ==='))
                self.stdout.write(f"Would export {len(members)} members to {options['output']}")
                self.stdout.write('\nSample data (first 10):')
                for i, member in enumerate(members[:10], 1):
                    self.stdout.write(
                        f"  {i}. {member['email']}, {member['first_name'] or '(no name)'}"
                    )
                if len(members) > 10:
                    self.stdout.write(f"  ... and {len(members) - 10} more")

                self.stdout.write(self.style.NOTICE(
                    f"\nTo actually export, run without --dry-run"
                ))
                return

            # Write to CSV
            output_file = options['output']
            self.stdout.write(self.style.NOTICE(f'Writing to {output_file}...'))

            with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=['email', 'first_name'])
                writer.writeheader()
                writer.writerows(members)

            self.stdout.write(self.style.SUCCESS(
                f'\n✓ Successfully exported {len(members)} members to {output_file}'
            ))

            # Next steps
            self.stdout.write(self.style.NOTICE('\n' + '='*70))
            self.stdout.write(self.style.NOTICE('NEXT STEPS:'))
            self.stdout.write(self.style.NOTICE('='*70))
            self.stdout.write('1. Review the CSV file:')
            self.stdout.write(f'   cat {output_file} | head -20')
            self.stdout.write('\n2. Test with dry run:')
            self.stdout.write(f'   python manage.py send_welcome_emails --file {output_file} --dry-run --limit 5')
            self.stdout.write('\n3. Send to test group:')
            self.stdout.write(f'   python manage.py send_welcome_emails --file {output_file} --campaign test --limit 5')
            self.stdout.write('\n4. Launch full campaign:')
            self.stdout.write(f'   python manage.py send_welcome_emails --file {output_file} --campaign launch')
            self.stdout.write(self.style.NOTICE('='*70 + '\n'))

            # Close connection
            cursor.close()
            conn.close()

        except mysql.connector.Error as err:
            raise CommandError(f'Database error: {err}')
        except Exception as e:
            raise CommandError(f'Unexpected error: {e}')

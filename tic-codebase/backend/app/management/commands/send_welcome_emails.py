"""
Django management command to send welcome emails from a CSV file.

Usage:
    # Dry run with first 5 emails from CSV
    python manage.py send_welcome_emails --file contacts.csv --dry-run --limit 5

    # Send to all emails in CSV
    python manage.py send_welcome_emails --file contacts.csv

    # Send with custom campaign name
    python manage.py send_welcome_emails --file contacts.csv --campaign launch2024

    # Resume failed emails
    python manage.py send_welcome_emails --retry-failed --campaign launch2024
"""

import csv
import time
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db import transaction
from app.email_utils import send_welcome_email
from app.models import WelcomeEmailLog
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Send welcome emails from a CSV file with tracking'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            help='Path to CSV file with columns: email,first_name (first_name is optional)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Simulate sending without actually sending emails'
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=None,
            help='Limit number of emails to send (useful for testing)'
        )
        parser.add_argument(
            '--campaign',
            type=str,
            default='launch',
            help='Campaign name for tracking (default: launch)'
        )
        parser.add_argument(
            '--batch-size',
            type=int,
            default=10,
            help='Number of emails to send per batch (default: 10)'
        )
        parser.add_argument(
            '--delay',
            type=float,
            default=1.0,
            help='Delay in seconds between batches (default: 1.0)'
        )
        parser.add_argument(
            '--retry-failed',
            action='store_true',
            help='Retry sending to previously failed emails'
        )

    def handle(self, *args, **options):
        file_path = options['file']
        dry_run = options['dry_run']
        limit = options['limit']
        campaign = options['campaign']
        batch_size = options['batch_size']
        delay = options['delay']
        retry_failed = options['retry_failed']

        if retry_failed:
            self.retry_failed_emails(campaign, dry_run, limit, batch_size, delay)
            return

        if not file_path:
            raise CommandError('Please provide a CSV file with --file argument')

        self.stdout.write(f"\n{'='*70}")
        self.stdout.write(self.style.SUCCESS('WELCOME EMAIL CAMPAIGN'))
        self.stdout.write(f"{'='*70}\n")

        if dry_run:
            self.stdout.write(self.style.WARNING('🔍 DRY RUN MODE - No emails will be sent\n'))

        # Read and validate CSV
        recipients = self.read_csv(file_path)
        total_recipients = len(recipients)

        if limit:
            recipients = recipients[:limit]
            self.stdout.write(
                self.style.WARNING(f'📊 Limited to first {limit} recipients (out of {total_recipients} total)\n')
            )
        else:
            self.stdout.write(f'📊 Total recipients: {total_recipients}\n')

        # Show summary
        self.stdout.write(f'Campaign: {campaign}')
        self.stdout.write(f'Batch size: {batch_size}')
        self.stdout.write(f'Delay between batches: {delay}s\n')

        # Confirm before sending (if not dry run)
        if not dry_run:
            confirm = input(f'\n⚠️  Ready to send {len(recipients)} emails. Continue? (yes/no): ')
            if confirm.lower() != 'yes':
                self.stdout.write(self.style.WARNING('Aborted.'))
                return

        # Send emails in batches
        self.send_emails_in_batches(recipients, campaign, dry_run, batch_size, delay)

    def read_csv(self, file_path):
        """Read and validate CSV file"""
        recipients = []

        try:
            with open(file_path, 'r', encoding='utf-8') as csvfile:
                # Try to detect if file has headers
                sample = csvfile.read(1024)
                csvfile.seek(0)
                has_header = csv.Sniffer().has_header(sample)

                reader = csv.DictReader(csvfile) if has_header else csv.reader(csvfile)

                for row_num, row in enumerate(reader, start=1):
                    try:
                        if isinstance(row, dict):
                            # CSV has headers
                            email = row.get('email', '').strip()
                            first_name = row.get('first_name', '').strip()
                        else:
                            # CSV without headers: assume first column is email, second is first_name
                            email = row[0].strip() if len(row) > 0 else ''
                            first_name = row[1].strip() if len(row) > 1 else ''

                        if not email:
                            self.stdout.write(
                                self.style.WARNING(f'⚠️  Row {row_num}: Skipping - no email address')
                            )
                            continue

                        # Basic email validation
                        if '@' not in email:
                            self.stdout.write(
                                self.style.WARNING(f'⚠️  Row {row_num}: Skipping invalid email: {email}')
                            )
                            continue

                        recipients.append({
                            'email': email,
                            'first_name': first_name
                        })

                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'❌ Row {row_num}: Error parsing row - {str(e)}')
                        )
                        continue

        except FileNotFoundError:
            raise CommandError(f'File not found: {file_path}')
        except Exception as e:
            raise CommandError(f'Error reading CSV file: {str(e)}')

        if not recipients:
            raise CommandError('No valid recipients found in CSV file')

        self.stdout.write(self.style.SUCCESS(f'✅ Loaded {len(recipients)} valid recipients\n'))
        return recipients

    def send_emails_in_batches(self, recipients, campaign, dry_run, batch_size, delay):
        """Send emails in batches with rate limiting"""
        total = len(recipients)
        sent = 0
        failed = 0
        skipped = 0

        self.stdout.write(f"\n{'='*70}")
        self.stdout.write('SENDING EMAILS...\n')
        self.stdout.write(f"{'='*70}\n")

        for i in range(0, total, batch_size):
            batch = recipients[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            total_batches = (total + batch_size - 1) // batch_size

            self.stdout.write(f'\n📦 Batch {batch_num}/{total_batches}:')

            for recipient in batch:
                email = recipient['email']
                first_name = recipient['first_name']

                # Check if already sent
                existing = WelcomeEmailLog.objects.filter(
                    email=email,
                    campaign_name=campaign,
                    status='sent'
                ).first()

                if existing:
                    self.stdout.write(f'   ⏭️  {email} - Already sent (skipped)')
                    skipped += 1
                    continue

                if dry_run:
                    # Dry run - just log
                    name_display = f' ({first_name})' if first_name else ''
                    self.stdout.write(f'   🔍 {email}{name_display} - Would send (dry run)')
                    sent += 1
                else:
                    # Actually send email
                    success, error_msg = self.send_single_email(email, first_name, campaign)

                    if success:
                        self.stdout.write(self.style.SUCCESS(f'   ✅ {email} - Sent'))
                        sent += 1
                    else:
                        self.stdout.write(self.style.ERROR(f'   ❌ {email} - Failed: {error_msg}'))
                        failed += 1

            # Delay between batches (except for last batch)
            if i + batch_size < total and not dry_run:
                self.stdout.write(f'   ⏳ Waiting {delay}s before next batch...')
                time.sleep(delay)

        # Final summary
        self.stdout.write(f"\n{'='*70}")
        self.stdout.write(self.style.SUCCESS('SUMMARY'))
        self.stdout.write(f"{'='*70}\n")
        self.stdout.write(f'Total recipients: {total}')
        self.stdout.write(self.style.SUCCESS(f'✅ Successfully sent: {sent}'))
        if skipped > 0:
            self.stdout.write(self.style.WARNING(f'⏭️  Skipped (already sent): {skipped}'))
        if failed > 0:
            self.stdout.write(self.style.ERROR(f'❌ Failed: {failed}'))
            self.stdout.write(f'\n💡 Tip: Run with --retry-failed --campaign {campaign} to retry failed emails')

        if dry_run:
            self.stdout.write(self.style.WARNING('\n🔍 This was a DRY RUN - no emails were actually sent'))

        self.stdout.write(f"\n{'='*70}\n")

    def send_single_email(self, email, first_name, campaign):
        """Send email to a single recipient and log the result"""
        log_entry = None

        try:
            # Create or get log entry
            log_entry, created = WelcomeEmailLog.objects.get_or_create(
                email=email,
                campaign_name=campaign,
                defaults={
                    'first_name': first_name,
                    'status': 'pending'
                }
            )

            # If already sent successfully, skip
            if log_entry.status == 'sent' and not created:
                return True, None

            # Update first_name if provided and different
            if first_name and log_entry.first_name != first_name:
                log_entry.first_name = first_name
                log_entry.save()

            # Send email
            success = send_welcome_email(email, first_name)

            if success:
                log_entry.status = 'sent'
                log_entry.sent_at = timezone.now()
                log_entry.error_message = None
                log_entry.save()
                return True, None
            else:
                raise Exception("Email sending returned False")

        except Exception as e:
            error_msg = str(e)
            if log_entry:
                log_entry.status = 'failed'
                log_entry.error_message = error_msg
                log_entry.save()
            return False, error_msg

    def retry_failed_emails(self, campaign, dry_run, limit, batch_size, delay):
        """Retry sending to previously failed emails"""
        self.stdout.write(f"\n{'='*70}")
        self.stdout.write(self.style.WARNING('RETRY FAILED EMAILS'))
        self.stdout.write(f"{'='*70}\n")

        # Get failed emails for this campaign
        failed_logs = WelcomeEmailLog.objects.filter(
            campaign_name=campaign,
            status='failed'
        ).order_by('created_at')

        if limit:
            failed_logs = failed_logs[:limit]

        total_failed = failed_logs.count()

        if total_failed == 0:
            self.stdout.write(self.style.SUCCESS(f'✅ No failed emails found for campaign: {campaign}'))
            return

        self.stdout.write(f'Found {total_failed} failed emails for campaign: {campaign}\n')

        # Convert to recipients format
        recipients = [
            {'email': log.email, 'first_name': log.first_name}
            for log in failed_logs
        ]

        if not dry_run:
            confirm = input(f'\n⚠️  Retry sending to {len(recipients)} failed emails? (yes/no): ')
            if confirm.lower() != 'yes':
                self.stdout.write(self.style.WARNING('Aborted.'))
                return

        # Send emails
        self.send_emails_in_batches(recipients, campaign, dry_run, batch_size, delay)

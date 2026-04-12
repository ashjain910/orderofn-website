"""
Django management command to send reminder emails from a CSV file.

Usage:
    # Dry run with first 5 emails from CSV
    python manage.py send_reminder_emails --file contacts.csv --dry-run --limit 5

    # Send to all emails in CSV
    python manage.py send_reminder_emails --file contacts.csv

    # Send with custom campaign name
    python manage.py send_reminder_emails --file contacts.csv --campaign reminder2

    # Resume failed emails
    python manage.py send_reminder_emails --retry-failed --campaign reminder1
"""

import csv
import time
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from app.email_utils import send_reminder_email
from app.models import WelcomeEmailLog
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Send reminder emails from a CSV file with tracking'

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
            default='reminder1',
            help='Campaign name for tracking (default: reminder1)'
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
        self.stdout.write(self.style.SUCCESS('REMINDER EMAIL CAMPAIGN'))
        self.stdout.write(f"{'='*70}\n")

        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No emails will be sent\n'))

        recipients = self.read_csv(file_path)
        total_recipients = len(recipients)

        if limit:
            recipients = recipients[:limit]
            self.stdout.write(
                self.style.WARNING(f'Limited to first {limit} recipients (out of {total_recipients} total)\n')
            )
        else:
            self.stdout.write(f'Total recipients: {total_recipients}\n')

        self.stdout.write(f'Campaign: {campaign}')
        self.stdout.write(f'Batch size: {batch_size}')
        self.stdout.write(f'Delay between batches: {delay}s\n')

        if not dry_run:
            confirm = input(f'\nReady to send {len(recipients)} emails. Continue? (yes/no): ')
            if confirm.lower() != 'yes':
                self.stdout.write(self.style.WARNING('Aborted.'))
                return

        self.send_emails_in_batches(recipients, campaign, dry_run, batch_size, delay)

    def read_csv(self, file_path):
        recipients = []

        try:
            with open(file_path, 'r', encoding='utf-8-sig') as csvfile:
                sample = csvfile.read(1024)
                csvfile.seek(0)
                has_header = csv.Sniffer().has_header(sample)

                reader = csv.DictReader(csvfile) if has_header else csv.reader(csvfile)

                for row_num, row in enumerate(reader, start=1):
                    try:
                        if isinstance(row, dict):
                            # Normalize keys to lowercase to handle case variations
                            row_lower = {k.lower().strip(): v for k, v in row.items()}
                            email = (row_lower.get('email') or '').strip()
                            first_name = (row_lower.get('first_name') or '').strip()
                        else:
                            email = row[0].strip() if len(row) > 0 else ''
                            first_name = row[1].strip() if len(row) > 1 else ''

                        if not email:
                            self.stdout.write(
                                self.style.WARNING(f'Row {row_num}: Skipping - no email address')
                            )
                            continue

                        if '@' not in email:
                            self.stdout.write(
                                self.style.WARNING(f'Row {row_num}: Skipping invalid email: {email}')
                            )
                            continue

                        recipients.append({'email': email, 'first_name': first_name})

                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'Row {row_num}: Error parsing row - {str(e)}')
                        )
                        continue

        except FileNotFoundError:
            raise CommandError(f'File not found: {file_path}')
        except Exception as e:
            raise CommandError(f'Error reading CSV file: {str(e)}')

        if not recipients:
            raise CommandError('No valid recipients found in CSV file')

        self.stdout.write(self.style.SUCCESS(f'Loaded {len(recipients)} valid recipients\n'))
        return recipients

    def send_emails_in_batches(self, recipients, campaign, dry_run, batch_size, delay):
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

            self.stdout.write(f'\nBatch {batch_num}/{total_batches}:')

            for recipient in batch:
                email = recipient['email']
                first_name = recipient['first_name']

                existing = WelcomeEmailLog.objects.filter(
                    email=email,
                    campaign_name=campaign,
                    status='sent'
                ).first()

                if existing:
                    self.stdout.write(f'   {email} - Already sent (skipped)')
                    skipped += 1
                    continue

                if dry_run:
                    name_display = f' ({first_name})' if first_name else ''
                    self.stdout.write(f'   {email}{name_display} - Would send (dry run)')
                    sent += 1
                else:
                    success, error_msg = self.send_single_email(email, first_name, campaign)

                    if success:
                        self.stdout.write(self.style.SUCCESS(f'   {email} - Sent'))
                        sent += 1
                    else:
                        self.stdout.write(self.style.ERROR(f'   {email} - Failed: {error_msg}'))
                        failed += 1

            if i + batch_size < total and not dry_run:
                self.stdout.write(f'   Waiting {delay}s before next batch...')
                time.sleep(delay)

        self.stdout.write(f"\n{'='*70}")
        self.stdout.write(self.style.SUCCESS('SUMMARY'))
        self.stdout.write(f"{'='*70}\n")
        self.stdout.write(f'Total recipients: {total}')
        self.stdout.write(self.style.SUCCESS(f'Successfully sent: {sent}'))
        if skipped > 0:
            self.stdout.write(self.style.WARNING(f'Skipped (already sent): {skipped}'))
        if failed > 0:
            self.stdout.write(self.style.ERROR(f'Failed: {failed}'))
            self.stdout.write(f'\nTip: Run with --retry-failed --campaign {campaign} to retry failed emails')

        if dry_run:
            self.stdout.write(self.style.WARNING('\nThis was a DRY RUN - no emails were actually sent'))

        self.stdout.write(f"\n{'='*70}\n")

    def send_single_email(self, email, first_name, campaign):
        log_entry = None

        try:
            log_entry, created = WelcomeEmailLog.objects.get_or_create(
                email=email,
                campaign_name=campaign,
                defaults={
                    'first_name': first_name,
                    'status': 'pending'
                }
            )

            if log_entry.status == 'sent' and not created:
                return True, None

            if first_name and log_entry.first_name != first_name:
                log_entry.first_name = first_name
                log_entry.save()

            success = send_reminder_email(email, first_name)

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
        self.stdout.write(f"\n{'='*70}")
        self.stdout.write(self.style.WARNING('RETRY FAILED EMAILS'))
        self.stdout.write(f"{'='*70}\n")

        failed_logs = WelcomeEmailLog.objects.filter(
            campaign_name=campaign,
            status='failed'
        ).order_by('created_at')

        if limit:
            failed_logs = failed_logs[:limit]

        total_failed = failed_logs.count()

        if total_failed == 0:
            self.stdout.write(self.style.SUCCESS(f'No failed emails found for campaign: {campaign}'))
            return

        self.stdout.write(f'Found {total_failed} failed emails for campaign: {campaign}\n')

        recipients = [
            {'email': log.email, 'first_name': log.first_name}
            for log in failed_logs
        ]

        if not dry_run:
            confirm = input(f'\nRetry sending to {len(recipients)} failed emails? (yes/no): ')
            if confirm.lower() != 'yes':
                self.stdout.write(self.style.WARNING('Aborted.'))
                return

        self.send_emails_in_batches(recipients, campaign, dry_run, batch_size, delay)

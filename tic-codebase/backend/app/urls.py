from django.urls import path
from . import views

urlpatterns = [
    # Public/User endpoints
    path('login', views.login, name='login'),
    path('pre-register', views.pre_register, name='pre-register'),
    path('profile', views.get_profile, name='get-profile'),
    path('profile/update', views.update_profile, name='update-profile'),
    path('update-password', views.update_password, name='update-password'),
    path('jobs', views.job_list, name='job-list'),
    path('jobs/<int:job_id>', views.job_detail, name='job-detail'),
    path('jobs/<int:job_id>/apply', views.apply_to_job, name='apply-to-job'),
    path('jobs/<int:job_id>/save', views.save_job, name='save-job'),
    path('jobs/<int:job_id>/unsave', views.unsave_job, name='unsave-job'),
    path('saved-jobs', views.saved_jobs_list, name='saved-jobs-list'),

    # Admin endpoints
    path('admin/candidates', views.admin_candidates_list, name='admin-candidates-list'),
    path('admin/candidates/<int:candidate_id>', views.admin_candidate_detail, name='admin-candidate-detail'),
    path('admin/jobs', views.admin_jobs_list, name='admin-jobs-list'),
    path('admin/jobs/create', views.admin_create_job, name='admin-create-job'),
    path('admin/jobs/<int:job_id>', views.admin_job_detail, name='admin-job-detail'),
    path('admin/jobs/<int:job_id>/update', views.admin_update_job, name='admin-update-job'),
    path('admin/jobs/<int:job_id>/delete', views.admin_delete_job, name='admin-delete-job'),
    path('admin/applications/<int:application_id>/status', views.admin_update_application_status, name='admin-update-application-status'),
    path('admin/dashboard/stats', views.admin_dashboard_stats, name='admin-dashboard-stats'),
]

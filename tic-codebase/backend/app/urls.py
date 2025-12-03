from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login, name='login'),
    path('pre-register', views.pre_register, name='pre-register'),
    path('jobs', views.job_list, name='job-list'),
    path('jobs/<int:job_id>', views.job_detail, name='job-detail'),
    path('jobs/<int:job_id>/apply', views.apply_to_job, name='apply-to-job'),
    path('jobs/<int:job_id>/save', views.save_job, name='save-job'),
    path('jobs/<int:job_id>/unsave', views.unsave_job, name='unsave-job'),
    path('saved-jobs', views.saved_jobs_list, name='saved-jobs-list'),
    path('update-password', views.update_password, name='update-password'),
]

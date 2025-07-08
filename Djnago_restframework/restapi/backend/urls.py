from django.contrib import admin
from django.urls import path,include
from backend import views
from backend.views import get_users


urlpatterns = [
    path('get-users', views.get_users, name='get_users'),
    path('create-users', views.create_users, name='create_users'),
    path('get-users/<int:user_id>', views.get_user_by_id, name='get_user_by_id'),
    path('delete-user/<int:user_id>', views.delete_user, name='delete_user')
    
]

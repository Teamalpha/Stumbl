from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from core import views
from rest_framework import routers
from api import views as api_views
from core.backends import MyRegistrationView
from django.contrib.auth.views import(
    PasswordResetView,
    PasswordResetDoneView,
    PasswordResetConfirmView,
    PasswordResetCompleteView,
)
from django.views.generic import TemplateView

# Router for api url's
router = routers.DefaultRouter()
router.register('users', api_views.UserViewSet)
router.register('playlists', api_views.PlaylistViewSet)
router.register('destinations', api_views.DestinationViewSet)
router.register('votes', api_views.VoteViewSet)

urlpatterns = [
    path('', views.index, name='home'),
    path('shared_gemlist/<sharedPlaylistPk>/', views.shared, name='shared_playlist'),    
    path('about/', views.about, name='about'),
    path('accounts/password/reset/', PasswordResetView.as_view(), {'template_name': 'registration/password_reset_form.html'}, name="password_reset"),
    path('accounts/password/reset/done/', PasswordResetDoneView.as_view(), {'template_name': 'registration/password_reset_done.html'}, name="password_reset_done"),
    path('accounts/password/reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), {'template_name': 'registration/password_reset_confirm.html'}, name="password_reset_confirm"),
    path('accounts/password/done/', PasswordResetCompleteView.as_view(),
        {'template_name': 'registration/password_reset_complete.html'},
        name="password_reset_complete"),
    path('accounts/registration/', MyRegistrationView.as_view(), name='registration_register'),
    path('api/', include((router.urls, 'core'), namespace='api')),
    path('admin/', admin.site.urls),
    path('accounts/', include('registration.backends.simple.urls')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
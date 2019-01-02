"""
Sets up the app's URLs.
"""

from django.conf.urls import include, url
from django.contrib.auth import views as auth_views
from rest_framework import routers
from rest_framework import urls as rest_framework_urls
from rest_framework.authtoken import views as rest_framework_views

from listery import views
from listery import apis


router = routers.DefaultRouter()
router.register(r'lists', apis.ListViewSet, basename='list')
router.register(r'list_items', apis.ListItemViewSet, basename='list-item')


urlpatterns = [
	url(r'^login/$', auth_views.LoginView.as_view(template_name='registration/login.html')),
	url(r'^logout/$', auth_views.LogoutView.as_view(template_name='registration/login.html')),
	url(r'^api/v1/', include((rest_framework_urls, 'rest_framework'), namespace='rest_framework')),
	url(r'^api/v1/token/$', rest_framework_views.obtain_auth_token),
	url(r'^api/v1/', include((router.urls, 'listery'), namespace='listery-api-v1')),
	url(r'', views.index, name='index'),
]

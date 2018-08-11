from django.conf.urls import include, url
from django.contrib.auth import views as auth_views
from rest_framework import routers
from rest_framework import urls as rest_framework_urls
from rest_framework.authtoken import views as rest_framework_views

from listery import views
from listery import apis


router = routers.DefaultRouter()
router.register(r'lists', apis.ListViewSet)
router.register(r'list_items', apis.ListItemViewSet)


urlpatterns = [
	url(r'^login/$', auth_views.LoginView.as_view(template_name='registration/login.html')),
	url(r'^logout/$', auth_views.LogoutView.as_view(template_name='registration/login.html')),
	url(r'^api/v1/', include(rest_framework_urls, namespace='rest_framework')),
	url(r'^api/v1/token/$', rest_framework_views.obtain_auth_token),
	url(r'^api/v1/', include(router.urls, namespace='api_v1')),
	url(r'^#list/<int:list_id>', views.redirect_to_new_url, name='redirect_to_new_url'),
	url(r'', views.index, name='index'),
]

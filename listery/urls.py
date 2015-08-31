from django.conf.urls import include, url
from rest_framework import routers
from rest_framework import urls as rest_framework_urls
from rest_framework.authtoken import views as rest_framework_views

from listery import apis, views


router = routers.DefaultRouter()
router.register(r'users', apis.UserViewSet)
router.register(r'lists', apis.ListViewSet)
router.register(r'listitems', apis.ListItemViewSet)


urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^api/v1/', include(rest_framework_urls, namespace='rest_framework')),
	url(r'^api/v1/token/$', rest_framework_views.obtain_auth_token),
	url(r'^api/v1/', include(router.urls, namespace='api')),
]

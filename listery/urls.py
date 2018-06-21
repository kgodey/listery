from django.conf.urls import include, url
from django.contrib.auth import views as auth_views
from rest_framework import routers
from rest_framework import urls as rest_framework_urls
from rest_framework.authtoken import views as rest_framework_views

from listery import views
from listery.apis import v1_apis, v2_apis


v1_router = routers.DefaultRouter()
v1_router.register(r'users', v1_apis.UserViewSet)
v1_router.register(r'lists', v1_apis.ListViewSet)
v1_router.register(r'list_counts', v1_apis.ListCountViewSet)
v1_router.register(r'listitems', v1_apis.ListItemViewSet)


v2_router = routers.DefaultRouter()
v2_router.register(r'lists', v2_apis.ListViewSet)
v2_router.register(r'list_items', v2_apis.ListItemViewSet)


urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^new/', views.new_index, name='new_index'),
	url(r'^login/$', auth_views.LoginView.as_view(template_name='registration/login.html')),
	url(r'^logout/$', auth_views.LogoutView.as_view(template_name='registration/login.html')),
	url(r'^api/v1/', include(rest_framework_urls, namespace='rest_framework')),
	url(r'^api/v1/token/$', rest_framework_views.obtain_auth_token),
	url(r'^api/v1/', include(v1_router.urls, namespace='api_v1')),
	url(r'^api/v2/', include(v2_router.urls, namespace='api_v2')),
]

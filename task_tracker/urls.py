from django.conf.urls import include, url
from django.contrib import admin

from tasks import urls as task_urls

urlpatterns = [
	url(r'^admin/', include(admin.site.urls)),
	
	url('^', include('django.contrib.auth.urls')),
	url(r'', include(task_urls))
]

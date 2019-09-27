from django.conf.urls import include, url
from django.contrib import admin

from listery import urls as listery_urls


urlpatterns = [
	url(r'^admin/', admin.site.urls),
	url('^', include('django.contrib.auth.urls')),
	url(r'', include(listery_urls))
]

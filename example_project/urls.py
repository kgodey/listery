from django.conf.urls import include, url

from listery import urls as listery_urls
from listery.admin import admin_site


urlpatterns = [
	url(r'^admin/', admin_site.urls),
	url('^', include('django.contrib.auth.urls')),
	url(r'', include(listery_urls))
]

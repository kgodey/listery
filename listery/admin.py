"""
Sets up the Django admin interface.
"""

from django.contrib.admin import AdminSite

from listery.models import List, ListItem


class ListeryAdminSite(AdminSite):
	site_header = 'Listery administration'


admin_site = ListeryAdminSite(name='listery')
admin_site.register(List)
admin_site.register(ListItem)

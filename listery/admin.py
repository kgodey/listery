"""
Sets up the Django admin interface.
"""

from django.contrib.admin import AdminSite

from listery.models import List, ListItem


class ListeryAdminSite(AdminSite):
	"""Admin site class for Listery, nothing fancy."""
	site_header = 'Listery administration'


admin_site = ListeryAdminSite(name='listery') # pylint: disable=invalid-name
admin_site.register(List)
admin_site.register(ListItem)

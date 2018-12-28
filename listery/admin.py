"""
Sets up the Django admin interface.
"""

from django.contrib import admin

from listery.models import List, ListItem


admin.site.register(List, admin.ModelAdmin)
admin.site.register(ListItem, admin.ModelAdmin)

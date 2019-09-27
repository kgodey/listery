"""
Sets up the Django admin interface.
"""

from django.contrib import admin

from listery.models import List, ListItem, TaggedList, TaggedListItem


admin.site.register(List)
admin.site.register(ListItem)
admin.site.register(TaggedList)
admin.site.register(TaggedListItem)

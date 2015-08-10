from django.contrib import admin

from tasks.models import List, ListItem


admin.site.register(List, admin.ModelAdmin)
admin.site.register(ListItem, admin.ModelAdmin)
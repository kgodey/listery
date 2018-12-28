"""
Sets up the filters available to filter data returned through the API.
"""

from django_filters import rest_framework as filters

from listery.models import List, ListItem


class ListFilter(filters.FilterSet):
	"""Filters for List API."""
	class Meta:
		model = List
		fields = ['owner_id']


class ListItemFilter(filters.FilterSet):
	"""Filters for List Item API."""
	list_id = filters.CharFilter(name='list__id', lookup_expr='exact')

	class Meta:
		model = ListItem
		fields = ['list_id', 'completed']

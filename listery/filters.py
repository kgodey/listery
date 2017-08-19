from django_filters import rest_framework as filters

from listery.models import List, ListItem


class ListFilter(filters.FilterSet):
	class Meta:
		model = List
		fields = ['owner_id']


class ListItemFilter(filters.FilterSet):
	list_id = filters.CharFilter(name='list__id', lookup_expr='exact')

	class Meta:
		model = ListItem
		fields = ['list_id', 'completed']

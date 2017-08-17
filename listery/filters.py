from django_filters import rest_framework as filters

from listery.models import List, ListItem


class ListFilter(filters.FilterSet):
	first = filters.BooleanFilter(method='filter_first')

	class Meta:
		model = List
		fields = ['owner_id']

	def filter_first(self, queryset, name, value):
		first_list = queryset.order_by('order').first()
		return queryset.filter(**{
			'id': first_list.id if first_list else None
		})


class ListItemFilter(filters.FilterSet):
	list_id = filters.CharFilter(name='list__id', lookup_expr='exact')

	class Meta:
		model = ListItem
		fields = ['list_id', 'completed']

from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from listery.filters import ListFilter, ListItemFilter
from listery.models import List, ListItem
from listery.serializers.v2_serializers import ListSerializer, ListItemSerializer


class ListViewSet(viewsets.ModelViewSet):
	queryset = List.objects.filter(archived=False).order_by('order')
	serializer_class = ListSerializer
	permission_classes = (IsAuthenticated,)
	filter_class = ListFilter

	def perform_create(self, serializer):
		serializer.save(owner=self.request.user)

	def get_queryset(self):
		return self.queryset.filter(Q(owner=self.request.user) | Q(private=False))


class ListItemViewSet(viewsets.ModelViewSet):
	queryset = ListItem.objects.order_by('order')
	serializer_class = ListItemSerializer
	permission_classes = (IsAuthenticated,)
	filter_class = ListItemFilter

	def get_queryset(self):
		return self.queryset.filter(Q(list__owner=self.request.user) | Q(list__private=False))

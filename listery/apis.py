"""
Sets up the views for the APIs.
TODO: merge this with views.py
"""

from django.http import HttpResponse
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from listery.filters import ListFilter, ListItemFilter
from listery.models import List, ListItem
from listery.serializers import ListSerializer, ListItemSerializer, MinimalListSerializer


class ListViewSet(viewsets.ModelViewSet):
	"""ViewSet controlling List API."""
	# pylint: disable=too-many-ancestors
	queryset = List.objects.filter(archived=False).order_by('-order')
	permission_classes = (IsAuthenticated,)
	filter_class = ListFilter

	def perform_create(self, serializer):
		"""Overrides create new item to set owner to currently logged in user."""
		serializer.save(owner=self.request.user)

	def get_queryset(self):
		"""Overrides default queryset to filter to lists the user has access to."""
		return self.queryset.all_for_user(self.request.user)

	def get_serializer_class(self):
		"""Sets serializer based on whether the API action is list or detail."""
		if self.action == 'list':
			return MinimalListSerializer
		return ListSerializer

	def destroy(self, request, *args, **kwargs):
		"""Overrides default destroy method to mark the item as archived instead of removing it from the database."""
		item = self.get_object()
		item.archived = True
		item.save()
		return Response(status=status.HTTP_204_NO_CONTENT)

	@action(detail=True, methods=['post'], url_path='actions/quick_sort')
	def quick_sort(self, request, pk=None):
		"""Sorts the list according to the rules defined by the quick sort method."""
		# pylint: disable=unused-argument
		item = self.get_object()
		item.quick_sort()
		serializer = self.get_serializer_class()(item)
		return Response(serializer.data, status=status.HTTP_200_OK)

	@action(detail=True, methods=['post'], url_path='actions/complete_all')
	def complete_all(self, request, pk=None):
		"""Marks all list items belonging to the list as completed."""
		# pylint: disable=unused-argument
		item = self.get_object()
		item.complete_all()
		serializer = self.get_serializer_class()(item)
		return Response(serializer.data, status=status.HTTP_200_OK)

	@action(detail=True, methods=['post'], url_path='actions/uncomplete_all')
	def uncomplete_all(self, request, pk=None):
		"""Marks all list items belonging to the list as not completed."""
		# pylint: disable=unused-argument
		item = self.get_object()
		item.uncomplete_all()
		serializer = self.get_serializer_class()(item)
		return Response(serializer.data, status=status.HTTP_200_OK)

	@action(detail=True, methods=['post'])
	def plaintext(self, request, pk=None):
		"""Returns plaintext file containing a representation of the list."""
		# pylint: disable=unused-argument
		item = self.get_object()
		response = HttpResponse(item.plaintext, content_type='text/plain')
		response['Content-Disposition'] = 'attachment; filename="%s-%s.txt"' % (item.name, timezone.now())
		return response

	@action(detail=True, methods=['post'])
	def reorder(self, request, pk=None):
		"""Reorders a list (with respect to other lists) based on the order passed in."""
		# pylint: disable=unused-argument
		item = self.get_object()
		position = request.data.get('order', None)
		if position is not None:
			item.to(int(position))
			serializer = ListSerializer(item)
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response({'order': ['Please specify an order.']}, status=status.HTTP_400_BAD_REQUEST)


class ListItemViewSet(viewsets.ModelViewSet):
	"""ViewSet controlling List Item API."""
	# pylint: disable=too-many-ancestors
	queryset = ListItem.objects.order_by('order')
	serializer_class = ListItemSerializer
	permission_classes = (IsAuthenticated,)
	filter_class = ListItemFilter

	def get_queryset(self):
		"""Overrides default queryset to filter to list items the user has access to."""
		return self.queryset.all_for_user(self.request.user)

	@action(detail=True, methods=['post'])
	def reorder(self, request, pk=None):
		"""Reorders a list item (with respect to other list items in the list) based on the order passed in."""
		# pylint: disable=unused-argument
		item = self.get_object()
		position = request.data.get('order', None)
		if position is not None:
			item.to(int(position))
			serializer = ListItemSerializer(item)
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response({'order': ['Please specify an order.']}, status=status.HTTP_400_BAD_REQUEST)

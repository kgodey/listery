from django.db.models import Q
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from listery.filters import ListFilter, ListItemFilter
from listery.models import List, ListItem
from listery.serializers.v2_serializers import ListSerializer, ListItemSerializer, MinimalListSerializer


class ListViewSet(viewsets.ModelViewSet):
	queryset = List.objects.filter(archived=False).order_by('-order')
	serializer_class = ListSerializer
	permission_classes = (IsAuthenticated,)
	filter_class = ListFilter

	def perform_create(self, serializer):
		serializer.save(owner=self.request.user)

	def get_queryset(self):
		return self.queryset.all_for_user(self.request.user)

	def get_serializer_class(self):
		if self.action == 'list':
			return MinimalListSerializer
		return ListSerializer

	def destroy(self, request, *args, **kwargs):
		item = self.get_object()
		item.archived = True
		item.save()
		return Response(status=status.HTTP_204_NO_CONTENT)

	@detail_route(methods=['post'], url_path='actions/quick_sort')
	def quick_sort(self, request, pk=None):
		item = self.get_object()
		item.quick_sort()
		serializer = self.get_serializer_class()(item)
		return Response(serializer.data, status=status.HTTP_200_OK)

	@detail_route(methods=['post'], url_path='actions/complete_all')
	def complete_all(self, request, pk=None):
		item = self.get_object()
		item.check_all()
		serializer = self.get_serializer_class()(item)
		return Response(serializer.data, status=status.HTTP_200_OK)

	@detail_route(methods=['post'], url_path='actions/uncomplete_all')
	def uncomplete_all(self, request, pk=None):
		item = self.get_object()
		item.uncheck_all()
		serializer = self.get_serializer_class()(item)
		return Response(serializer.data, status=status.HTTP_200_OK)

	@detail_route(methods=['post'])
	def plaintext(self, request, pk=None):
		item = self.get_object()
		response = HttpResponse(item.plaintext, content_type='text/plain')
		response['Content-Disposition'] = 'attachment; filename="%s-%s.txt"' % (item.name, timezone.now())
		return response

class ListItemViewSet(viewsets.ModelViewSet):
	queryset = ListItem.objects.order_by('order')
	serializer_class = ListItemSerializer
	permission_classes = (IsAuthenticated,)
	filter_class = ListItemFilter

	def get_queryset(self):
		return self.queryset.all_for_user(self.request.user)

from django.contrib.auth.models import User
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tasks.models import List, ListItem
from tasks.serializers import UserSerializer, ListSerializer, ListItemSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = (IsAuthenticated,)


class ListViewSet(viewsets.ModelViewSet):
	queryset = List.objects.filter(archived=False).order_by('order')
	serializer_class = ListSerializer
	permission_classes = (IsAuthenticated,)
	
	@detail_route(methods=['get', 'post'])
	def download(self, request, pk=None):
		item = self.get_object()
		response = HttpResponse(item.plaintext, content_type='text/plain')
		response['Content-Disposition'] = 'attachment; filename="%s-%s.txt"' % (item.name, timezone.now())
		return response
	
	@detail_route(methods=['post'])
	def reorder(self, request, pk=None):
		item = self.get_object()
		position = request.data.get('order', None)
		if position is not None:
			item.to(int(position))
			serializer = ListSerializer(item)
			return Response(serializer.data, status=status.HTTP_200_OK)
		else:
			return Response({'order': ['Please specify an order.']}, status=status.HTTP_400_BAD_REQUEST)


class ListItemViewSet(viewsets.ModelViewSet):
	queryset = ListItem.objects.order_by('order')
	serializer_class = ListItemSerializer
	permission_classes = (IsAuthenticated,)
	
	@detail_route(methods=['post'])
	def reorder(self, request, pk=None):
		item = self.get_object()
		position = request.data.get('order', None)
		if position is not None:
			item.to(int(position))
			serializer = ListItemSerializer(item)
			return Response(serializer.data, status=status.HTTP_200_OK)
		else:
			return Response({'order': ['Please specify an order.']}, status=status.HTTP_400_BAD_REQUEST)
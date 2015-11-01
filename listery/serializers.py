from django.contrib.auth.models import User
from rest_framework import serializers

from listery.models import List, ListItem


class UserSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = User
		fields = ('id', 'username', 'email')


class ListItemSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = ListItem


class ListSerializer(serializers.ModelSerializer):
	items = ListItemSerializer(many=True, read_only=True)
	
	class Meta:
		model = List
	
	def validate(self, data):
		owner = self.context['request'].user
		if 'name' in data:
			same_name_lists = List.objects.filter(owner=owner, archived=False, name__iexact=data['name'])
			if same_name_lists.exists():
				raise serializers.ValidationError('An active list with that name already exists.')
		return data


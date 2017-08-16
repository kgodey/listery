from rest_framework import serializers

from listery.models import List, ListItem


class ListItemSerializer(serializers.ModelSerializer):
	class Meta:
		model = ListItem
		fields = ['id', 'title', 'description', 'created_at', 'completed', 'list_id', 'order']


class ListSerializer(serializers.ModelSerializer):

	class Meta:
		model = List
		fields = ['id', 'name', 'order', 'private', 'created_at', 'owner_id']

	def validate(self, data):
		owner = self.context['request'].user
		if 'name' in data:
			same_name_lists = List.objects.filter(owner=owner, archived=False, name__iexact=data['name'])
			if same_name_lists.exists():
				raise serializers.ValidationError('An active list with that name already exists.')
		return data

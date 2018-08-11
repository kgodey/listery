from rest_framework import serializers

from listery.models import List, ListItem


class ListItemSerializer(serializers.ModelSerializer):
	list_id = serializers.PrimaryKeyRelatedField(source='list', queryset=List.objects.all())

	class Meta:
		model = ListItem
		fields = ['id', 'title', 'description', 'created_at', 'completed', 'list_id', 'order']


class MinimalListSerializer(serializers.ModelSerializer):
	item_count = serializers.ReadOnlyField()
	completed_item_count = serializers.ReadOnlyField(source='checked_item_count')

	class Meta:
		model = List
		fields = ['id', 'name', 'order', 'private', 'created_at', 'owner_id', 'item_count', 'completed_item_count']

	def validate(self, data):
		owner = self.context['request'].user
		if 'name' in data:
			same_name_lists = List.objects.filter(owner=owner, archived=False, name__iexact=data['name'])
			if self.instance and self.instance.id:
				same_name_lists = same_name_lists.exclude(id=self.instance.id)
			if same_name_lists.exists():
				raise serializers.ValidationError('An active list with that name already exists.')
		return data


class ListSerializer(MinimalListSerializer):
	items = ListItemSerializer(many=True, read_only=True)

	class Meta:
		model = List
		fields = ['id', 'name', 'order', 'private', 'created_at', 'owner_id', 'items', 'item_count', 'completed_item_count']

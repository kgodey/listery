"""
Sets up the serializers to convert data between Django models and the JSON APIs.
"""

from rest_framework import serializers

from listery.models import List, ListItem


class ListItemSerializer(serializers.ModelSerializer):
	"""Serializes ListItem model."""
	list_id = serializers.PrimaryKeyRelatedField(source='list', queryset=List.objects.all())

	class Meta:
		model = ListItem
		fields = ['id', 'title', 'description', 'created_at', 'updated_at', 'completed', 'list_id', 'order']


class MinimalListSerializer(serializers.ModelSerializer):
	"""Minimal serializer for List model (used for list views)."""
	item_count = serializers.ReadOnlyField()
	completed_item_count = serializers.ReadOnlyField()

	class Meta:
		model = List
		fields = ['id', 'name', 'order', 'private', 'created_at', 'updated_at', 'owner_id', 'item_count', 'completed_item_count']

	def validate(self, attrs):
		owner = self.context['request'].user
		if 'name' in attrs:
			same_name_lists = List.objects.filter(owner=owner, archived=False, name__iexact=attrs['name'])
			if self.instance and self.instance.id:
				same_name_lists = same_name_lists.exclude(id=self.instance.id)
			if same_name_lists.exists():
				raise serializers.ValidationError('An active list with that name already exists.')
		return attrs


class ListSerializer(MinimalListSerializer):
	"""Serializer for List model (used for detail views)."""
	items = ListItemSerializer(many=True, read_only=True)

	class Meta:
		model = List
		fields = ['id', 'name', 'order', 'private', 'created_at', 'updated_at', 'owner_id', 'items', 'item_count', 'completed_item_count']

"""
Sets up the serializers to convert data between Django models and the JSON APIs.
"""

from rest_framework import serializers
from taggit.models import Tag

from listery.models import List, ListItem


class TagField(serializers.RelatedField):
	def to_representation(self, value):
		return {
			'id': value.slug,
			'text': value.name
		}

	def to_internal_value(self, data):
		return data


class ListItemSerializer(serializers.ModelSerializer):
	"""Serializes ListItem model."""
	list_id = serializers.PrimaryKeyRelatedField(source='list', queryset=List.objects.all())
	tags = TagField(many=True, queryset=Tag.objects.all(), read_only=False, required=False)

	def create(self, validated_data):
		tags = None
		if 'tags' in validated_data:
			tags = [tag['text'] for tag in validated_data.pop('tags')]
		list_item = ListItem.objects.create(**validated_data)
		if tags is not None:
			list_item.update_tags(tags)
		return list_item

	def update(self, instance, validated_data):
		tags = None
		if 'tags' in validated_data:
			tags = [tag['text'] for tag in validated_data.pop('tags')]
		instance.title = validated_data.get('title', instance.title)
		instance.description = validated_data.get('description', instance.description)
		instance.completed = validated_data.get('completed', instance.completed)
		instance.list_id = validated_data.get('list_id', instance.list_id)
		instance.save()
		if tags is not None:
			instance.update_tags(tags)
		return instance

	class Meta:
		model = ListItem
		fields = ['id', 'title', 'description', 'created_at', 'updated_at', 'completed', 'list_id', 'order', 'tags']


class MinimalListSerializer(serializers.ModelSerializer):
	"""Minimal serializer for List model (used for list views)."""
	item_count = serializers.ReadOnlyField()
	completed_item_count = serializers.ReadOnlyField()
	tags = TagField(many=True, read_only=True)

	class Meta:
		model = List
		fields = ['id', 'name', 'order', 'private', 'created_at', 'updated_at', 'owner_id', 'item_count', 'completed_item_count', 'show_tags', 'tags']

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
		fields = ['id', 'name', 'order', 'private', 'created_at', 'updated_at', 'owner_id', 'items', 'item_count', 'completed_item_count', 'show_tags', 'tags']

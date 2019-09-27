"""
Sets up Django models.
"""

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Q
from django.db.transaction import atomic
from ordered_model.models import OrderedModel
from taggit.managers import TaggableManager
from taggit.models import Tag, TaggedItemBase


class TaggedList(TaggedItemBase):
	"""
	Through model for tags for lists
	"""
	content_object = models.ForeignKey('List')

	def __unicode__(self):
		"""Returns a short identifying description of the list tag."""
		return 'Tag "%s" for list "%s"' % (self.tag.name, self.content_object.name)


class TaggedListItem(TaggedItemBase):
	"""
	Through model for tags for list items
	"""
	content_object = models.ForeignKey('ListItem')

	def __unicode__(self):
		"""Returns a short identifying description of the list item tag."""
		return 'Tag "%s" for list item "%s" from list "%s"' % (self.tag.name, self.content_object.title, self.content_object.list.name)


class ListQuerySet(models.QuerySet):
	"""Helper methods to retrieve various subsets of lists."""
	def all_for_user(self, user):
		"""Get all lists visible to the given user."""
		return self.filter((Q(owner=user) | Q(private=False)) & Q(archived=False))

	def all(self):
		"""Overrides default method to retrieve all lists to sort them by the order attribute."""
		return super(ListQuerySet, self).all().order_by('order')

	def filter(self, *args, **kwargs):
		"""Overrides default method to filter lists to sort them by the order attribute."""
		return super(ListQuerySet, self).filter(*args, **kwargs).order_by('order')


class List(OrderedModel):
	"""Model representing a list."""
	name = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	archived = models.BooleanField(default=False)
	private = models.BooleanField(default=True)
	owner = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
	show_tags = models.BooleanField(default=False)
	tags = TaggableManager(through=TaggedList)

	objects = ListQuerySet.as_manager()

	@property
	def items(self):
		"""Returns ordered list of list items belonging to the list."""
		return self.listitem_set.order_by('order')

	@property
	def item_count(self):
		"""Returns count of list items belonging to the list."""
		return self.items.count()

	@property
	def completed_item_count(self):
		"""Returns count of list items belonging to the list that have the checked attribute set to True."""
		return self.items.filter(completed=True).count()

	def plaintext(self, filter_items, item_ids, filtered_tags, filtered_text):
		"""Returns a plaintext representation of the list for download."""
		# pylint: disable=bad-continuation
		text = u'%s\n' % self.name.upper()
		if filter_items and (filtered_tags or filtered_text):
			filter_description = []
			if filtered_text:
				filter_description.append('text: "%s"' % filtered_text)
			if filtered_tags:
				filter_description.append('tags: %s' % ', '.join(filtered_tags))
			text += u'Filtered by %s\n' % (' & '.join(filter_description))
		if self.items.exists():
			text += u'\n'
			for item in self.items:
				if (not filter_items) or (filter_items and item.id in item_ids):
					text += u'[%(checked)s] %(title)s%(description)s%(tags)s\n' % {
						'checked': u'x' if item.completed else u' ',
						'title': item.title,
						'description': u'\n\t%s' % item.description if item.description else u'',
						'tags': u'\n\ttags: [%s]' % ', '.join([tag.name for tag in item.tags.all()]) if item.tags.exists() and self.show_tags else u'',
					}
		return text

	def __unicode__(self):
		"""Returns a short identifying description of the list."""
		return self.name

	@atomic
	def save(self, *args, **kwargs):
		"""Override of default save method to ensure that new lists are ordered at the top."""
		move_to_top = False
		if not self.pk:
			move_to_top = True
		super(List, self).save(*args, **kwargs)
		if move_to_top:
			self.to(1)

	@atomic
	def reindex(self):
		"""Update order of all list items such that current order is preserved but order values are consecutive and start at 1."""
		index = 1
		for item in self.items:
			old_order = item.order
			if old_order != index:
				item.order = index
				item.save()
			index += 1

	@atomic
	def quick_sort(self):
		"""Update order of all list items such that all un-completed items are ordered alphabetically on top and then all completed items are ordered alphabetically below."""
		index = 1
		non_completed = self.items.filter(completed=False).order_by('title')
		completed = self.items.filter(completed=True).order_by('title')
		for item in non_completed:
			item.order = index
			item.save()
			index += 1
		for item in completed:
			item.order = index
			item.save()
			index += 1

	def uncomplete_all(self):
		"""Marks all list items as not completed."""
		self.items.update(completed=False)

	def complete_all(self):
		"""Marks all list items as completed."""
		self.items.update(completed=True)


class ListItemQuerySet(models.QuerySet):
	"""Helper methods to retrieve various subsets of list items."""
	def all_for_user(self, user):
		"""Get all list items visible to the given user."""
		return self.filter(Q(list__owner=user) | Q(list__private=False))

	def all(self):
		"""Overrides default method to retrieve all list items to sort them by the order attribute."""
		return super(ListItemQuerySet, self).all().order_by('order')

	def filter(self, *args, **kwargs):
		"""Overrides default method to filter list items to sort them by the order attribute."""
		return super(ListItemQuerySet, self).filter(*args, **kwargs).order_by('order')


class ListItem(OrderedModel):
	"""Model representing an item in a list."""
	title = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	description = models.TextField(null=True, blank=True)
	completed = models.BooleanField(default=False)
	list = models.ForeignKey(List, on_delete=models.CASCADE)
	order_with_respect_to = 'list'

	tags = TaggableManager(through=TaggedListItem)
	objects = ListItemQuerySet.as_manager()

	def __unicode__(self):
		"""Returns a short identifying description of the list item."""
		return '%s (%s)' % (self.title, self.list.name)

	@atomic
	def save(self, *args, **kwargs):
		"""Override of the default save method that orders new items and items newly-moved between lists on top and then reindexes the entire list (and old list, if applicable) for consistency."""
		move_to_top = False
		old_list = None
		if not self.pk:
			move_to_top = True
		else:
			old_item = ListItem.objects.get(id=self.pk)
			if old_item.list != self.list:
				old_list = old_item.list
				move_to_top = True
		super(ListItem, self).save(*args, **kwargs)
		if move_to_top:
			self.to(1)
			self.list.reindex()
		if old_list:
			old_list.reindex()

	def update_tags(self, tags):
		"""
		Set the tags of the list based on the the tags of all the list items belonging to that list.
		"""
		# Add all passed in tags to list and set list item tags to the tags passed in
		self.list.tags.add(*tags)
		self.tags.set(*tags)
		# Remove tags from the list if no list item belonging to the list has them anymore
		all_list_item_tags = Tag.objects.filter(listery_taggedlistitem_items__content_object__list=self.list).distinct()
		all_list_tags = Tag.objects.filter(listery_taggedlist_items__content_object=self.list).distinct()
		tags_to_remove = []
		for tag in all_list_tags:
			if tag not in all_list_item_tags:
				tags_to_remove.append(tag.name)
		self.list.tags.remove(*tags_to_remove)

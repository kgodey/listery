from django.contrib.auth.models import User
from django.db import models
from ordered_model.models import OrderedModel


class List(OrderedModel):
	name = models.CharField(max_length=255, unique=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	archived = models.BooleanField(default=False)
	private = models.BooleanField(default=True)
	owner = models.ForeignKey(User, null=True, blank=True)
	
	@property
	def items(self):
		return self.listitem_set.order_by('order')
	
	@property
	def plaintext(self):
		text = u'%s\n' % self.name.upper()
		if self.items.exists():
			text += u'\n'
			for item in self.items:
				text += u'[%(checked)s] %(title)s%(description)s\n' % {
					'checked': u'x' if item.completed else u' ',
					'title': item.title,
					'description': u'\n\t%s' % item.description if item.description else u'',
				}
		return text
	
	def __unicode__(self):
		return self.name
	
	def save(self, *args, **kwargs):
		move_to_top = False
		if not self.pk:
			move_to_top = True
		super(List, self).save(*args, **kwargs)
		if move_to_top:
			self.top()


class ListItem(OrderedModel):
	title = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	description = models.TextField(null=True, blank=True)
	completed = models.BooleanField(default=False)
	assignee = models.ForeignKey(User, null=True, blank=True)
	due_date = models.DateTimeField(null=True, blank=True)
	list = models.ForeignKey(List)
	order_with_respect_to = 'list'
	
	def __unicode__(self):
		return '%s (%s)' % (self.title, self.list.name)
	
	def save(self, *args, **kwargs):
		move_to_top = False
		if not self.pk:
			move_to_top = True
		else:
			old_item = ListItem.objects.get(id=self.pk)
			if old_item.list != self.list:
				move_to_top = True
		super(ListItem, self).save(*args, **kwargs)
		if move_to_top:
			self.top()

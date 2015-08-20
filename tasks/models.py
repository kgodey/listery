from django.contrib.auth.models import User
from django.db import models
from ordered_model.models import OrderedModel


class List(models.Model):
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archived = models.BooleanField(default=False)
    
    @property
    def items(self):
        return self.listitem_set.order_by('order')
    
    def __unicode__(self):
        return self.name


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
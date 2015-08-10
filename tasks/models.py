from django.contrib.auth.models import User
from django.db import models


class List(models.Model):
    name = models.CharField(max_length=255)
    
    @property
    def items(self):
        return self.listitem_set.all()
    
    def __unicode__(self):
        return self.name


class ListItem(models.Model):
    description = models.TextField()
    list = models.ForeignKey(List)
    assignee = models.ForeignKey(User, null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    
    def __unicode__(self):
        return self.description
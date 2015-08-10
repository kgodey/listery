from django.contrib.auth.models import User
from rest_framework import serializers

from tasks.models import List, ListItem


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



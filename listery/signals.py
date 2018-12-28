"""
Sets up Django signals.
"""

from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
	"""Create auth token whenever a new user is created."""
	# pylint: disable=unused-argument
	if created:
		Token.objects.create(user=instance)

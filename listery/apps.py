"""
Sets up the Listery Django app.
"""
from django.apps import AppConfig


class ListeryConfig(AppConfig):
	"""App config for Listery."""
	name = 'listery'
	verbose_name = "Listery"

	def ready(self):
		import listery.signals  # pylint: disable=unused-variable

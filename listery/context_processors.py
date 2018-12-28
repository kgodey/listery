"""
Sets up the variables available to the templates rendering the HTML.
"""

from django.conf import settings


def listery_info(request):
	"""Makes Listery Django settings available in templates."""
	# pylint: disable=unused-argument
	listery_settings = settings.LISTERY if hasattr(settings, 'LISTERY') else {}
	if 'LISTERY_TITLE' not in listery_settings:
		listery_settings['LISTERY_TITLE'] = 'Listery'
	if 'LISTERY_FRONTEND_LOGS_ENABLED' not in listery_settings:
		listery_settings['LISTERY_FRONTEND_LOGS_ENABLED'] = settings.DEBUG
	return listery_settings

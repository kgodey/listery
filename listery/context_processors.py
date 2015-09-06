from django.conf import settings


def listery_info(request):
	return {'LISTERY_TITLE': settings.LISTERY_TITLE }
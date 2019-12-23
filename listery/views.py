"""
Sets up non-API Django views.
"""

from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from listery.models import List


@login_required
def web(request):
	"""Renders base page for the single-page app."""
	first_list = List.objects.all_for_user(request.user).first()
	page_list_id = first_list.id if first_list else None
	return render(request, 'listery/web.html', {'page_list_id': page_list_id})


@login_required
def mobile(request, list_id=None):
	"""Renders base page for the single-page app."""
	if not list_id:
		first_list = List.objects.all_for_user(request.user).first()
		list_id = first_list.id if first_list else None
	return render(request, 'listery/mobile.html', {'page_list_id': list_id})

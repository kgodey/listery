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
	first_list_id = first_list.id if first_list else None
	return render(request, 'listery/web.html', {'first_list_id': first_list_id})

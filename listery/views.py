from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from listery.models import List


@login_required
def index(request):
	first_list = List.objects.all_for_user(request.user).first()
	first_list_id = first_list.id if first_list else None
	return render(request, 'listery/index.html', {'first_list_id': first_list_id})


def redirect_to_new_url(request, list_id):
	return redirect('/%d' % list_id)

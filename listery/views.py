from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.shortcuts import render

from listery.models import List


@login_required
def index(request):
	lists = List.objects.all()
	return render(request, 'listery/index.html', {'lists': lists})


@login_required
def new_index(request):
	first_list = List.objects.all_for_user(request.user).first()
	first_list_id = first_list.id if first_list else None
	return render(request, 'listery/listery_v2/index.html', {'first_list_id': first_list_id})

from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from listery.models import List


@login_required
def index(request):
	lists = List.objects.all()
	return render(request, 'listery/index.html', {'lists': lists})


@login_required
def new_index(request):
	lists = List.objects.all()
	return render(request, 'listery/listery_v2/index.html', {'lists': lists})

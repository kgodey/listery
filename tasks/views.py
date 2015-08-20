from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from tasks.models import List


@login_required
def index(request):
    lists = List.objects.all()
    return render(request, 'tasks/index.html', {'lists': lists})

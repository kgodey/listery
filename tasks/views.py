from django.shortcuts import render

from tasks.models import List


def index(request):
    lists = List.objects.all()
    return render(request, 'tasks/index.html', {'lists': lists})

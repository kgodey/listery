# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0005_list_owner'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listitem',
            name='assignee',
        ),
        migrations.RemoveField(
            model_name='listitem',
            name='due_date',
        ),
    ]

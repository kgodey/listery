# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0003_auto_20150823_2133'),
    ]

    operations = [
        migrations.AddField(
            model_name='list',
            name='private',
            field=models.BooleanField(default=True),
        ),
    ]

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_auto_20150820_0118'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='list',
            options={'ordering': ('order',)},
        ),
        migrations.AddField(
            model_name='list',
            name='order',
            field=models.PositiveIntegerField(default=0, editable=False, db_index=True),
            preserve_default=False,
        ),
    ]

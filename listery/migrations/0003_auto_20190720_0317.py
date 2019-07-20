# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-07-20 03:17
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import taggit.managers


class Migration(migrations.Migration):

    dependencies = [
        ('taggit', '0002_auto_20150616_2121'),
        ('listery', '0002_auto_20151031_2235'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaggedList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TaggedListItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content_object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='listery.ListItem')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='listery_taggedlistitem_items', to='taggit.Tag')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='list',
            name='show_tags',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='taggedlist',
            name='content_object',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='listery.List'),
        ),
        migrations.AddField(
            model_name='taggedlist',
            name='tag',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='listery_taggedlist_items', to='taggit.Tag'),
        ),
        migrations.AddField(
            model_name='list',
            name='tags',
            field=taggit.managers.TaggableManager(help_text='A comma-separated list of tags.', through='listery.TaggedList', to='taggit.Tag', verbose_name='Tags'),
        ),
        migrations.AddField(
            model_name='listitem',
            name='tags',
            field=taggit.managers.TaggableManager(help_text='A comma-separated list of tags.', through='listery.TaggedListItem', to='taggit.Tag', verbose_name='Tags'),
        ),
    ]

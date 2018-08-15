# Listery

Listery is a simple single-page list management application built with Django and Backbone/Marionette. It has an intuitive drag and drop interface, supports multiple users with a simple shared list mechanic, and can export lists to text files.

Tests: [![CircleCI](https://circleci.com/gh/kgodey/listery/tree/master.svg?style=svg)](https://circleci.com/gh/kgodey/listery/tree/master)

## Demo

A Listery demo is available at https://dry-scrubland-6661.herokuapp.com/. There are two user accounts available:
Username: `demo1`, password: `demo1`
Username: `demo2`, password: `demo2`

## Local setup

You should be able to run Listery locally using the example Django project provided. `npm install` will install the necessary JavaScript packages, and `npm run watch` will rebuild the JavaScript files on save.

## Using Listery as an app

* Add the following to your `INSTALLED_APPS` in your project `settings.py` file:

```
'ordered_model',
'django_filters',
'rest_framework',
'rest_framework.authtoken',
'listery',
```

* Add the following to your template context processors in your project `settings.py` file:

```
'listery.context_processors.listery_info'
```

* Make sure your Django REST framework setup has session authentication and token authentication enabled and includes the `django-filter` backend as one of the default filter backends. The settings are:

```
REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': (
		'rest_framework.authentication.SessionAuthentication',
		'rest_framework.authentication.TokenAuthentication',
	),
	'DEFAULT_FILTER_BACKENDS': (
		'django_filters.rest_framework.DjangoFilterBackend',
	)
}
```

* Optionally set your site title and whether to enable frontend JS logs using the setting `LISTERY` as follows. `LISTERY_FRONTEND_LOGS_ENABLED` will use the value of `DEBUG` if it is not set.

```
LISTERY = {
	'LISTERY_TITLE': 'Listery Demo',
	'LISTERY_FRONTEND_LOGS_ENABLED': True
}
```

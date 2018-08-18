# Listery

Listery is a simple single-page list management application built with Django, React, and Redux. It has an intuitive drag and drop interface, supports multiple users with a simple shared list mechanic, and can export lists to text files.

Tests: [![CircleCI](https://circleci.com/gh/kgodey/listery/tree/master.svg?style=svg)](https://circleci.com/gh/kgodey/listery/tree/master)

## Demo

A Listery demo is available at https://dry-scrubland-6661.herokuapp.com/. There are two user accounts available:
Username: `demo1`, password: `demo1`
Username: `demo2`, password: `demo2`

## Local Development

You should be able to run Listery locally using the example Django project provided.

1. Make sure you have Python & npm installed locally. Listery is tested against Python 2.7 (for now).
2. Install the Python requirements using `pip install -r requirements.txt`
3. Install the JavaScript requirements using `npm install`
4. Run `python manage.py runserver` to serve the backend at `localhost:8000`.
5. Run `npm run watch` to build the JavaScript files and rebuild them whenever there is an update to the JS code. Use `npm run start` (development mode) or `npm run build` (production mode) to build the JavaScript without any automatic rebuilding on save.


## Setting Up Listery as a Django App

This guide assumes you have an existing Django project already set up. Do NOT use the example project provided in production since the `SECRET_KEY` setting is public and it is insecure.

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

## Upgrading Listery

If you would like to upgrade Listery to the latest code, please follow these steps:

1. Pull the latest code from the `master` branch of this git repository.
2. Run any new Django migrations using `python manage.py migrate`.
3. Run `npm run build` to build the JavaScript and CSS files (with production settings) into the `listery` app folder's `static/listery` directory.
4. Run `python manage.py collecstatic` to copy the static files over to the static root folder that you have configured in your Django settings.
5. Restart your web server(s). You should be up and running.

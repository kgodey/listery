# Listery

Listery is a simple single-page list management application built with Django, React, and Redux. It has an intuitive drag and drop interface, supports multiple users with a simple shared list mechanic, and can export lists to text files.

Tests: [![CircleCI](https://circleci.com/gh/kgodey/listery/tree/master.svg?style=svg)](https://circleci.com/gh/kgodey/listery/tree/master)


## Installation

You can [clone this repository](https://help.github.com/articles/cloning-a-repository/) to install a local copy of Listery.

You can either run Listery using the example project provided (for local development) or install Listery as an app in an existing Django project. In either case, follow these steps first:

1. Make sure you have Python installed locally. Listery is currently tested against Python 2.7.
1. Make sure you have [npm installed locally](https://www.npmjs.com/get-npm).
1. Install the Python requirements using `pip install -r requirements.txt`
1. Install the JavaScript requirements using `npm install`

### Using the example project

1. Run `python manage.py runserver` to serve the backend at `localhost:8000`.
1. Run `npm run watch` to build the JavaScript files and rebuild them whenever there is an update to the JS code. You can also use `npm run start` (development mode) or `npm run build` (production mode) to build the JavaScript without any automatic rebuilding on save.

Do NOT use the example project provided in production,. There are a lot of reasons why that's a terrble idea including the `SECRET_KEY` setting being public and insecure and the database being SQLite.

### Setting up Listery in an existing project.

This guide assumes you have an existing Django project already set up. The `listery` folder in this repository contains the app, a PyPI package will be released eventually to make it easier to install.

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

* If you use the `STATICFILES_FINDERS` setting, make sure that `django.contrib.staticfiles.finders.AppDirectoriesFinder` is specified in it. If you don't have the setting defined, don't worry about it since the `AppDirectoriesFinder` is used by default.

## Upgrading Listery

If you would like to upgrade Listery to the latest code, please follow these steps:

1. Pull the latest code from the `master` branch of this git repository.
1. Update the Python requirements using `pip install -r requirements.txt`
1. Run any new Django migrations using `python manage.py migrate`.
1. Ensure that all the settings present in the **Setting up Listery in an existing project** section above are present in your project's `settings.py`.
1. Update the JavaScript requirements using `npm install`
1. Run `npm run build` to build the JavaScript and CSS files (with production settings) into the `listery` app folder's `static/listery` directory.
1. Run `python manage.py collecstatic` to copy the static files over to the static root folder that you have configured in your Django settings.
1. Restart your web server(s). You should be up and running.

## Tests

* You can run tests locally using `npm test` which will run the tests via Jest.
* To pass additional options, use `npm test -- <Jest options here>`. For example, to update component snapshots, run `npm test -- --updateSnapshot`.

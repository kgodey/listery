# Listery

Listery is a simple single-page list management application built with Django and Backbone/Marionette. It has an intuitive drag and drop interface, supports multiple users with a simple shared list mechanic, and can export lists to text files.

## Local setup

You should be able to run Listery locally using the example project provided.

## Using Listery as an app

1. Add the following to your `INSTALLED_APPS` in your project `settings.py` file:

```
'ordered_model',
'rest_framework',
'rest_framework.authtoken',
'listery',
```

2. Add the following to your template context processors in your project `settings.py` file:

```
'listery.context_processors.listery_info'
```

3. Make sure your Django REST framework setup has session authentication and token authentication enabled. The settings are:

```
REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': (
		'rest_framework.authentication.TokenAuthentication',
		'rest_framework.authentication.SessionAuthentication',
	)
}
```

4. Optionally set your site title using the setting `LISTERY_TITLE`
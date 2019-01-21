"""
Tests the List and List Item APIs.
"""

from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class ListAPITests(APITestCase):
	"""Tests for the List API"""

	def test_list_lists_without_authentication(self):
		"""Ensure that the List API returns a 403 response without provided authentication."""
		url = reverse('listery-api-v1:list-list')
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

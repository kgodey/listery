"""
Tests the List and List Item APIs.
"""

from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from listery.models import List


class APITestsWithoutAuthentication(APITestCase):
	"""Tests for the List and List Item APIs without authentication"""
	fixtures = ['testing_data.json']

	def test_list_lists_without_authentication(self):
		"""Ensure that the List API returns a 403 response without provided authentication."""
		url = reverse('listery-api-v1:list-list')
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_list_listitems_without_authentication(self):
		"""Ensure that the List Item API returns a 403 response without provided authentication."""
		url = reverse('listery-api-v1:list-item-list')
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ListAPITests(APITestCase):
	"""Tests for the List API with authentication"""
	fixtures = ['testing_data.json']

	def setUp(self):
		self.client.login(username='test', password='password')

	def test_list_lists(self):
		"""Ensure that the List API returns a 200 response and correct data with valid authentication."""
		url = reverse('listery-api-v1:list-list')
		response = self.client.get(url)
		list_data = response.json()
		list_names = [item['name'] for item in list_data]
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(list_data), 2)
		self.assertTrue('Pizzas' in list_names)
		self.assertTrue('Food' in list_names)

	def test_create_list(self):
		"""Ensure that list creation works and is assigned the correct owner."""
		url = reverse('listery-api-v1:list-list')
		response = self.client.post(url, {'name': 'Movies'})
		list_data = response.json()
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(list_data['name'], 'Movies')
		self.assertEqual(list_data['owner_id'], 1)

	def test_get_active_list(self):
		"""Ensure that retrieving a single list works and returns list items."""
		url = reverse('listery-api-v1:list-detail', args=[4])
		response = self.client.get(url)
		list_data = response.json()
		list_items = list_data['items']
		list_item_titles = [item['title'] for item in list_items]
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(list_data['name'], 'Food')
		self.assertEqual(len(list_items), 2)
		self.assertTrue('Chicken' in list_item_titles)
		self.assertTrue('Pork' in list_item_titles)

	def test_get_archived_list(self):
		"""Ensure that retrieving an archived list returns a 404."""
		url = reverse('listery-api-v1:list-detail', args=[2])
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_delete_list(self):
		"""Test that deleting a list works and marks the object as archived in the background instead of deleting the object."""
		test_list = List.objects.create(name='Delete Me', owner_id=1)
		self.assertFalse(test_list.archived)
		url = reverse('listery-api-v1:list-detail', args=[test_list.id])
		response = self.client.delete(url)
		test_list.refresh_from_db()
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertTrue(test_list.archived)

	def test_partial_update_list(self):
		"""Test that updating a list's name using PATCH works and does not update other fields."""
		test_list = List.objects.create(name='Fruits', owner_id=1, private=True)
		self.assertTrue(test_list.private)
		self.assertEqual(test_list.name, 'Fruits')
		url = reverse('listery-api-v1:list-detail', args=[test_list.id])
		response = self.client.patch(url, {'name': 'Vegetables'})
		list_data = response.json()
		test_list.refresh_from_db()
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(list_data['name'], 'Vegetables')
		self.assertEqual(test_list.name, 'Vegetables')
		self.assertTrue(test_list.private)

	def test_update_list(self):
		"""Test that updating a list using PUT updates all fields, not just the fields explicitly passed."""
		test_list = List.objects.create(name='Fruits', owner_id=1, private=True)
		self.assertEqual(test_list.name, 'Fruits')
		self.assertTrue(test_list.private)
		url = reverse('listery-api-v1:list-detail', args=[test_list.id])
		response = self.client.put(url, {'name': 'Vegetables'})
		list_data = response.json()
		test_list.refresh_from_db()
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(list_data['name'], 'Vegetables')
		self.assertEqual(test_list.name, 'Vegetables')
		self.assertFalse(test_list.private)

import { sync } from './base'
import { fetchActiveList } from './list'

export const ADD_NEW_LIST_ITEM = 'ADD_NEW_LIST_ITEM'
export const RECEIVE_NEW_LIST_ITEM = 'RECEIVE_NEW_LIST_ITEM'
export const UPDATE_LIST_ITEM = 'UPDATE_LIST_ITEM'
export const RECEIVE_UPDATED_LIST_ITEM = 'RECEIVE_UPDATED_LIST_ITEM'
export const REMOVE_LIST_ITEM = 'REMOVE_LIST_ITEM'
export const RECEIVE_REMOVED_LIST_ITEM = 'RECEIVE_REMOVED_LIST_ITEM'

const LIST_ITEM_API_URL = '/api/v2/list_items/'


const addNewListItem = (data) => ({
	type: ADD_NEW_LIST_ITEM,
	data
})


const receiveNewListItem = (data) => ({
	type: RECEIVE_NEW_LIST_ITEM,
	data
})


const updateListItem = (id, data) => ({
	type: UPDATE_LIST_ITEM,
	id,
	data
})


const receiveUpdatedListItem = (data) => ({
	type: RECEIVE_UPDATED_LIST_ITEM,
	data
})


const removeListItem = (id, listID) => ({
	type: REMOVE_LIST_ITEM,
	id,
	listID
})


const receiveRemovedListItem = (id) => ({
	type: RECEIVE_REMOVED_LIST_ITEM,
	id
})


export const createListItem = (title, listID) => {
	let itemData = {
		title: title,
		list_id: listID
	}
	return function(dispatch) {
		dispatch(addNewListItem(itemData))
		return sync(LIST_ITEM_API_URL, {
			method: 'POST',
			body: JSON.stringify(itemData)
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveNewListItem(data)))
		.then(
			dispatch(fetchActiveList(listID))
		)
	}
}


export const patchListItem = (id, data) => {
	return function(dispatch) {
		dispatch(updateListItem(id, data))
		return sync(LIST_ITEM_API_URL + id + '/', {
			method: 'PATCH',
			body: JSON.stringify(data)
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveUpdatedListItem(data)))
		.then(
			dispatch(fetchActiveList(data.list_id))
		)
	}
}


export const deleteListItem = (id, listID) => {
	return function(dispatch) {
		dispatch(removeListItem(id, listID))
		return sync(LIST_ITEM_API_URL + id + '/', {
			method: 'DELETE'
		})
		.then(
			data => dispatch(receiveRemovedListItem(id)))
		.then(
			dispatch(fetchActiveList(listID))
		)
	}
}

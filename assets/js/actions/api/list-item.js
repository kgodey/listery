import { sync } from './base'


export const ADD_NEW_LIST_ITEM = 'ADD_NEW_LIST_ITEM'
export const RECEIVE_NEW_LIST_ITEM = 'RECEIVE_NEW_LIST_ITEM'
export const UPDATE_LIST_ITEM = 'UPDATE_LIST_ITEM'
export const RECEIVE_UPDATED_LIST_ITEM = 'RECEIVE_UPDATED_LIST_ITEM'
export const REMOVE_LIST_ITEM = 'REMOVE_LIST_ITEM'
export const RECEIVE_REMOVED_LIST_ITEM = 'RECEIVE_REMOVED_LIST_ITEM'

const LIST_ITEM_API_URL = '/api/v2/list_items/'


const addNewListItem = (data) => {
	return {
		type: ADD_NEW_LIST_ITEM,
		data
	}
}


const receiveNewListItem = (data) => {
	return {
		type: RECEIVE_NEW_LIST_ITEM,
		data
	}
}


const updateListItem = (id, data) => {
	return {
		type: UPDATE_LIST_ITEM,
		id,
		data
	}
}


const receiveUpdatedListItem = (data) => {
	return {
		type: RECEIVE_UPDATED_LIST_ITEM,
		data
	}
}


const removeListItem = (id) => {
	return {
		type: REMOVE_LIST_ITEM,
		id
	}
}


const receiveRemovedListItem = (id) => {
	return {
		type: RECEIVE_REMOVED_LIST_ITEM,
		id
	}
}


export const createNewListItem = (title, listID) => {
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
			data => dispatch(receiveNewListItem(data))
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
			data => dispatch(receiveUpdatedListItem(data))
		)
	}
}


export const deleteListItem = (id) => {
	return function(dispatch) {
		dispatch(removeListItem(id))
		return sync(LIST_ITEM_API_URL + id + '/', {
			method: 'DELETE'
		})
		.then(
			data => dispatch(receiveRemovedListItem(id))
		)
	}
}

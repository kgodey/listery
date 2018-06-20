import { sync } from './base'
import { fetchActiveList } from './list'

export const ADD_NEW_LIST_ITEM = 'ADD_NEW_LIST_ITEM'
export const RECEIVE_NEW_LIST_ITEM = 'RECEIVE_NEW_LIST_ITEM'
export const UPDATE_LIST_ITEM = 'UPDATE_LIST_ITEM'
export const RECEIVE_UPDATED_LIST_ITEM = 'RECEIVE_UPDATED_LIST_ITEM'
export const REMOVE_LIST_ITEM = 'REMOVE_LIST_ITEM'
export const RECEIVE_REMOVED_LIST_ITEM = 'RECEIVE_REMOVED_LIST_ITEM'
export const REORDER_LIST_ITEM = 'REORDER_LIST_ITEM'
export const RECEIVE_REORDERED_LIST_ITEM = 'RECEIVE_REORDERED_LIST_ITEM'
export const RECEIVE_MOVED_LIST_ITEM = 'RECEIVE_MOVED_LIST_ITEM'

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


const reorderListItem = (id, order) => ({
	type: REORDER_LIST_ITEM,
	id,
	order
})


const receiveReorderedListItem = (id, order) => ({
	type: RECEIVE_REORDERED_LIST_ITEM,
	id,
	order
})


const receiveMovedListItem = (id, data) => ({
	type: RECEIVE_MOVED_LIST_ITEM,
	id,
	data
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
			response => dispatch(fetchActiveList(listID, listID))
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
			response => {
				let listID = response.data.list_id
				dispatch(fetchActiveList(listID, listID))
			}
		)
	}
}


export const moveListItem = (id, listID, oldListID) => {
	return function(dispatch) {
		let data = {list_id: listID}
		dispatch(updateListItem(id, data))
		return sync(LIST_ITEM_API_URL + id + '/', {
			method: 'PATCH',
			body: JSON.stringify(data)
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveMovedListItem(data)))
		.then(
			response => dispatch(fetchActiveList(oldListID, oldListID))
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
			response => dispatch(fetchActiveList(listID, listID)))
		.then(
			data => dispatch(receiveRemovedListItem(id))
		)
	}
}


export const updateListItemOrder = (id, order, listID) => {
	return function(dispatch) {
		dispatch(reorderListItem(id, order))
		return sync(LIST_ITEM_API_URL + id + '/reorder/', {
			method: 'POST',
			body: JSON.stringify({order: order})
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveReorderedListItem(id, order))
		)
	}
}


export const changeUIListOrder = (dragID, dropOrder) => {
	return function(dispatch) {
		return dispatch(receiveReorderedListItem(dragID, dropOrder))
	}
}

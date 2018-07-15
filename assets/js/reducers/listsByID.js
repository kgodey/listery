import { compareByOrder, getReorderedItems, addItemToTop } from './utils.js'
import * as listAPIActions from '../actions/list'


export const listsByID = (state, action) => {
	let newState = {...state}
	if (!(firstListID in newState)) {
		newState[firstListID] = {}
	}
	switch(action.type) {
		case listAPIActions.RECEIVE_ALL_LISTS:
			return Object.assign(...action.data.map(item => ({[item.id]: item})))
		case listAPIActions.RECEIVE_ARCHIVED_LIST:
			delete newState[action.id]
			return newState
		case listAPIActions.RECEIVE_NEW_LIST:
			newState[action.data.id] = action.data
			return addItemToTop(newState, action.data.id)
		case listAPIActions.RECEIVE_ACTIVE_LIST:
		case listAPIActions.RECEIVE_UPDATED_LIST:
			if (action.data.id) {
				newState[action.data.id] = action.data
				return newState
			}
			return newState
		case listAPIActions.RECEIVE_REORDERED_LIST:
			return getReorderedItems(state, action)
		default:
			return newState
	}
}


export const getSortedLists = (state) => {
	if (state.listsByID) {
		let items = Object.keys(state.listsByID).map(item => state.listsByID[item])
		// Remove empty objects from items
		items = items.filter((item) => { return Object.keys(item).length > 0 })
		return items.sort(compareByOrder)
	}
	return []
}


export const getNextList = (state, listID) => {
	let sortedLists = getSortedLists(state)
	// if there are no lists or only one list, return null
	if (sortedLists.length > 1) {
		// otherwise, return next sorted list
		let currentOrder = sortedLists.find(x => x.id === listID).order
		let list
		for (var listKey in sortedLists) {
			list = sortedLists[listKey]
			// return the first item whose order is greater
			// than or equal to the given item's order
			if (list.order >= currentOrder && list.id != listID) {
				return list.id
			}
		}
	}
	// return first list by default if it exists
	return sortedLists.length > 1 ? sortedLists[0].id : null
}

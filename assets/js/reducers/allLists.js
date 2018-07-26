import { compareByOrder, getReorderedItems, addItemToTop } from './utils'
import * as listAPIActions from '../actions/list'


export const allLists = (state={}, action) => {
	let newState = {...state}
	if (!(firstListID in newState)) {
		newState[firstListID] = {}
	}
	switch(action.type) {
		case listAPIActions.FETCH_ALL_LISTS_SUCCESS:
		case listAPIActions.FETCH_LIST_SUCCESS:
			if (action.data) {
				return {
					...state,
					...action.data.entities.lists
				}
			}
		case listAPIActions.ARCHIVE_LIST_SUCCESS:
			delete newState[action.id]
			return newState
		case listAPIActions.REORDER_LIST_SUCCESS:
			return getReorderedItems(state, action)
		default:
			return newState
	}
}


export const fetchingAllLists = (state, action) => {
	let newState = state !== undefined ? state : false
	switch(action.type) {
		case listAPIActions.FETCH_ALL_LISTS_REQUEST:
			return true
		case listAPIActions.FETCH_ALL_LISTS_SUCCESS:
			return false
		case listAPIActions.FETCH_ALL_LISTS_ERROR:
			return false
		default:
			return newState
	}
}


export const getAllListsFetchStatus = (state) => {
	return state.fetchingAllLists
}


export const getSortedLists = (state) => {
	if (state.allLists) {
		let items = Object.keys(state.allLists).map(item => state.allLists[item])
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

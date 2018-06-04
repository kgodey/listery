import { combineReducers } from 'redux'
import * as listAPIActions from '../actions//list'
import * as listItemAPIActions from '../actions//list-item'


const compareByOrder = (listA, listB) => {
	if (listA.order < listB.order)
		return -1
	if (listA.order > listB.order)
		return 1
	return 0
}


const updateActiveListItems = (state={}, action) => {
	let newState
	switch(action.type) {
		case listAPIActions.RECEIVE_ACTIVE_LIST:
		case listAPIActions.RECEIVE_NEW_LIST:
		case listAPIActions.RECEIVE_UPDATED_LIST:
			if (action.data.items && action.data.items.length > 0) {
				return Object.assign(...action.data.items.map(item => ({[item.id]: item})))
			}
			return {}
		case listItemAPIActions.RECEIVE_NEW_LIST_ITEM:
		case listItemAPIActions.RECEIVE_UPDATED_LIST_ITEM:
			newState = {...state}
			newState[action.data.id] = action.data
			return newState
		case listItemAPIActions.RECEIVE_REORDERED_LIST_ITEM:
			// Update the order of all affected objects.
			newState = {...state}
			newState[action.id].order = action.order
			for (var key in newState) {
				if (newState[key].order >= action.order && newState[key].id != action.id) {
					newState[key].order = newState[key].order + 1
				}
			}
			return newState
		case listItemAPIActions.RECEIVE_REMOVED_LIST_ITEM:
			newState = {...state}
			delete newState[action.id]
			return newState
		default:
			return state
	}
}


const updateActiveListID = (state=firstListID, action) => {
	switch(action.type) {
		case listAPIActions.RECEIVE_REMOVED_LIST:
			// if the current list has been deleted, load the default list
			if (state == action.id) {
				return action.nextListID
			}
			return state
		case listAPIActions.RECEIVE_ACTIVE_LIST:
		case listAPIActions.RECEIVE_NEW_LIST:
		case listAPIActions.RECEIVE_UPDATED_LIST:
			if (action.data.id) {
				return action.data.id
			}
			return state
		default:
			return state
	}
}


const updateAllLists = (state, action) => {
	let newState = {...state}
	if (!(firstListID in newState)) {
		newState[firstListID] = {}
	}
	switch(action.type) {
		case listAPIActions.RECEIVE_ALL_LISTS:
			return Object.assign(...action.data.map(item => ({[item.id]: item})))
		case listAPIActions.RECEIVE_REMOVED_LIST:
			newState = {...state}
			delete newState[action.id]
			return newState
		case listAPIActions.RECEIVE_ACTIVE_LIST:
		case listAPIActions.RECEIVE_NEW_LIST:
		case listAPIActions.RECEIVE_UPDATED_LIST:
			if (action.data.id) {
				newState = {...state}
				newState[action.data.id] = action.data
				return newState
			}
			return newState
		default:
			return newState
	}
}


export const listeryApp = combineReducers({
	activeListID: updateActiveListID,
	activeListItems: updateActiveListItems,
	listsByID: updateAllLists
})


export const getSortedListItems = (state) => {
	let items = Object.keys(state.activeListItems).map(item => state.activeListItems[item])
	return items.sort(compareByOrder)
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
	var listIDs = Object.keys(state.listsByID)
	// if there are no lists, return null
	if (listIDs.length == 0) {
		return null
	}
	// if the list ID passed in is the same as the first list on the page...
	if (listID == state.listsByID[listIDs[listIDs.length - 1]].id) {
		// if there's only one list and it's the current one, return null
		if (listIDs.length == 1) {
			return null
		// if there's more than one list, return the second list
		} else {
			return state.listsByID[listIDs[listIDs.length - 2]].id
		}
	}
	// return the active list ID by default
	return state.activeListID
}

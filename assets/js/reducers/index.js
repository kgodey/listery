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


const getReorderedItems = (state, action) => {
	let newState = {...state}
	let oldOrder = newState[action.id].order
	newState[action.id].order = action.order
	if (action.order > oldOrder) {
		for (var key in newState) {
			if (newState[key].order <= action.order && newState[key].order > oldOrder && newState[key].id != action.id) {
				newState[key].order = newState[key].order - 1
			}
		}
	} else if (action.order < oldOrder) {
		for (var key in newState) {
			if (newState[key].order >= action.order && newState[key].order < oldOrder && newState[key].id != action.id) {
				newState[key].order = newState[key].order + 1
			}
		}
	}
	return newState
}

const addItemToTop = (newState, itemID) => {
	newState[itemID].order == 1
	for (var key in newState) {
		if (key != itemID) {
			newState[key].order++
		}
	}
	return newState
}


const updateActiveListItems = (state={}, action) => {
	let newState = {...state}
	switch(action.type) {
		case listAPIActions.RECEIVE_ACTIVE_LIST:
		case listAPIActions.RECEIVE_NEW_LIST:
		case listAPIActions.RECEIVE_UPDATED_LIST:
			if (action.data.items && action.data.items.length > 0) {
				return Object.assign(...action.data.items.map(item => ({[item.id]: item})))
			}
			return {}
		case listItemAPIActions.RECEIVE_NEW_LIST_ITEM:
			newState[action.data.id] = action.data
			return addItemToTop(newState, action.data.id)
		case listItemAPIActions.RECEIVE_UPDATED_LIST_ITEM:
			newState[action.data.id] = action.data
			return newState
		case listItemAPIActions.RECEIVE_REORDERED_LIST_ITEM:
			// Update the order of all affected objects.
			return getReorderedItems(state, action)
		case listItemAPIActions.RECEIVE_REMOVED_LIST_ITEM:
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


const updateFetchingActiveList = (state, action) => {
	let newState = state !== undefined ? state : false
	switch(action.type) {
		case listAPIActions.REQUEST_ACTIVE_LIST_CHANGE:
			return true
		case listAPIActions.RECEIVE_ACTIVE_LIST:
			return false
		default:
			return newState
	}
}


const updateFetchingListItems = (state, action) => {
	let newState = {...state}
	switch(action.type) {
		case listItemAPIActions.UPDATE_LIST_ITEM:
			newState[action.id] = true
			return newState
		case listItemAPIActions.REORDER_LIST_ITEM:
			newState[action.id] = true
			return newState
		case listItemAPIActions.RECEIVE_UPDATED_LIST_ITEM:
			newState[action.data.id] = false
			return newState
		case listItemAPIActions.RECEIVE_REORDERED_LIST_ITEM:
			newState[action.id] = false
			return newState
	}
	return newState
}


export const listeryApp = combineReducers({
	activeListID: updateActiveListID,
	activeListItems: updateActiveListItems,
	listsByID: updateAllLists,
	fetchingActiveList: updateFetchingActiveList,
	fetchingListItems: updateFetchingListItems
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

export const getActiveListFetchStatus = (state) => {
	return state.fetchingActiveList
}


export const getListItemFetchStatus = (state, id) => {
	if (state.fetchingListItems && id in state.fetchingListItems) {
		return state.fetchingListItems[id]
	}
	return false
}

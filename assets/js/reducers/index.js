import { combineReducers } from 'redux'
import * as listAPIActions from '../actions//list'
import * as listItemAPIActions from '../actions//list-item'


const compareByOrder = (a, b) => {
	if (a.order < b.order)
		return -1;
	if (a.order > b.order)
		return 1;
	return 0;
}


const updateActiveListItems = (state={}, action) => {
	let newState
	switch(action.type) {
		case listAPIActions.RECEIVE_ACTIVE_LIST:
		case listAPIActions.RECEIVE_NEW_LIST:
		case listAPIActions.RECEIVE_UPDATED_LIST:
			if (action.data.items != undefined && action.data.items.length > 0) {
				return Object.assign(...action.data.items.map(item => ({[item.id]: item})))
			} else {
				return state
			}
		case listItemAPIActions.RECEIVE_NEW_LIST_ITEM:
		case listItemAPIActions.RECEIVE_UPDATED_LIST_ITEM:
			newState = {...state}
			newState[action.data.id] = action.data
			return newState
		case listItemAPIActions.RECEIVE_REMOVED_LIST_ITEM:
			newState = {...state}
			delete newState[action.data.id]
			return newState
		default:
			return state
	}
}


const updateActiveListID = (state=firstListID, action) => {
	switch(action.type) {
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
	allLists: updateAllLists
})


export const getSortedListItems = (state) => {
	let items = Object.keys(state.activeListItems).map(item => state.activeListItems[item])
	return items.sort(compareByOrder)
}


export const getSortedLists = (state) => {
	return state.allLists
}

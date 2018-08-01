import { compareByOrder, getReorderedItems, addItemToTop } from './utils'
import * as listAPIActions from '../actions/list'
import * as listItemAPIActions from '../actions/list-item'


export const activeListItems = (state={}, action) => {
	let newState = {...state}
	switch(action.type) {
		case listAPIActions.CREATE_LIST_SUCCESS:
		case listAPIActions.FETCH_ACTIVE_LIST_SUCCESS:
			if (action.data) {
				return {...action.data.entities.listItems}
			}
		case listItemAPIActions.CREATE_LIST_ITEM_SUCCESS:
			newState = {
				...state,
				...action.data.entities.listItems
			}
			return addItemToTop(newState, action.id)
		case listItemAPIActions.FETCH_LIST_ITEM_SUCCESS:
			if (action.data) {
				return {
					...state,
					...action.data.entities.listItems
				}
			}
		case listItemAPIActions.REORDER_LIST_ITEM_SUCCESS:
			// Update the order of all affected objects.
			return getReorderedItems(state, action)
		case listItemAPIActions.MOVE_LIST_ITEM_SUCCESS:
		case listItemAPIActions.DELETE_LIST_ITEM_SUCCESS:
			delete newState[action.id]
			return newState
		default:
			return state
	}
}


export const fetchingListItems = (state, action) => {
	let newState = {...state}
	switch(action.type) {
		case listItemAPIActions.FETCH_LIST_ITEM_REQUEST:
		case listItemAPIActions.REORDER_LIST_ITEM_REQUEST:
		case listItemAPIActions.MOVE_LIST_ITEM_REQUEST:
			newState[action.id] = true
			return newState
		case listItemAPIActions.FETCH_LIST_ITEM_SUCCESS:
		case listItemAPIActions.REORDER_LIST_ITEM_SUCCESS:
		case listItemAPIActions.MOVE_LIST_ITEM_SUCCESS:
			newState[action.id] = false
			return newState
		default:
			return newState
	}
}


export const getSortedListItems = (state) => {
	let items = Object.keys(state.activeListItems).map(item => state.activeListItems[item])
	return items.sort(compareByOrder)
}


export const getListItemFetchStatus = (state, id) => {
	if (state.fetchingListItems && id in state.fetchingListItems) {
		return state.fetchingListItems[id]
	}
	return false
}

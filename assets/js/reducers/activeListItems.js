import { compareByOrder, getReorderedItems, addItemToTop } from './utils'
import * as listAPIActions from '../actions/list'
import * as listItemAPIActions from '../actions/list-item'


export const activeListItems = (state={}, action) => {
	let newState = {...state}
	let newValues
	switch(action.type) {
		case listAPIActions.CREATE_LIST_SUCCESS:
		case listAPIActions.FETCH_ACTIVE_LIST_SUCCESS:
		case listAPIActions.UPDATE_ACTIVE_LIST_SUCCESS:
			if (action.data) {
				return {...action.data.entities.listItems}
			}
			/* falls through */
		case listItemAPIActions.CREATE_LIST_ITEM_REQUEST:
			// Make a temporary list item so that the new item appears immediately.
			// This will be removed when the API request succeeds.
			newValues = {
				id: action.tempID,
				completed: false,
				order: 0
			}
			action.data[newValues.id] = {
				...action.data[newValues.id],
				...newValues
			}
			newState = {
				...state,
				...action.data
			}
			return addItemToTop(newState, newValues.id)
		case listItemAPIActions.CREATE_LIST_ITEM_SUCCESS:
			newState = {
				...state,
				...action.data.entities.listItems
			}
			// Remove temporary list item created earlier.
			delete newState[action.tempID]
			return addItemToTop(newState, action.id)
		case listAPIActions.UPDATE_ACTIVE_LIST_ERROR:
		case listItemAPIActions.UPDATE_LIST_ITEM_SUCCESS:
		case listItemAPIActions.UPDATE_LIST_ITEM_ERROR:
			return {
				...state,
				...action.data.entities.listItems
			}
		case listItemAPIActions.CREATE_LIST_ITEM_ERROR:
			// Remove temporary list item created earlier.
			delete newState[action.tempID]
			return newState
		case listItemAPIActions.REORDER_LIST_ITEM_PREVIEW:
			// Update the order of all affected objects.
			return getReorderedItems(state, action)
		case listItemAPIActions.MOVE_LIST_ITEM_SUCCESS:
		case listItemAPIActions.DELETE_LIST_ITEM_SUCCESS:
			delete newState[action.id]
			return newState
		case listAPIActions.FILTER_LIST_SUCCESS:
			Object.keys(newState).forEach(itemID => {
				if (action.visibleListItemIDs.indexOf(Number(itemID)) > -1) {
					newState[itemID].hidden = false
				} else {
					newState[itemID].hidden = true
				}
			})
			return newState
		default:
			return state
	}
}


export const fetchingListItems = (state, action) => {
	let newState = {...state}
	switch(action.type) {
		case listItemAPIActions.UPDATE_LIST_ITEM_REQUEST:
		case listItemAPIActions.REORDER_LIST_ITEM_REQUEST:
		case listItemAPIActions.MOVE_LIST_ITEM_REQUEST:
			newState[action.id] = true
			return newState
		case listItemAPIActions.UPDATE_LIST_ITEM_SUCCESS:
		case listItemAPIActions.UPDATE_LIST_ITEM_ERROR:
		case listItemAPIActions.REORDER_LIST_ITEM_SUCCESS:
		case listItemAPIActions.MOVE_LIST_ITEM_SUCCESS:
			newState[action.id] = false
			return newState
		default:
			return newState
	}
}


export const listItemInitialOrders = (state={}, action) => {
	let newState
	switch(action.type) {
		case listAPIActions.CREATE_LIST_SUCCESS:
		case listAPIActions.FETCH_ACTIVE_LIST_SUCCESS:
		case listAPIActions.UPDATE_ACTIVE_LIST_SUCCESS:
		case listAPIActions.UPDATE_ACTIVE_LIST_ERROR:
			newState = {}
			if (action.data.entities.listItems !== undefined) {
				Object.keys(action.data.entities.listItems).map(key => {
					newState[key] = action.data.entities.listItems[key].order
				})
			}
			return newState
		case listItemAPIActions.CREATE_LIST_ITEM_SUCCESS:
		case listItemAPIActions.UPDATE_LIST_ITEM_SUCCESS:
		case listItemAPIActions.UPDATE_LIST_ITEM_ERROR:
			newState = state
			newState[action.id] = action.data.entities.listItems[action.id].order
			return newState
		case listItemAPIActions.MOVE_LIST_ITEM_SUCCESS:
		case listItemAPIActions.DELETE_LIST_ITEM_SUCCESS:
			newState = state
			delete newState[action.id]
			return newState
		default:
			return state
	}
}


export const numTempItems = (state=0, action) => {
	let newState = state
	switch(action.type) {
		case listItemAPIActions.CREATE_LIST_ITEM_REQUEST:
			newState++
			return newState
		case listItemAPIActions.CREATE_LIST_ITEM_ERROR:
		case listItemAPIActions.CREATE_LIST_ITEM_SUCCESS:
			newState--
			return newState
		default:
			return state
	}
}


export const getListItem = (state, id) => {
	if (id != null) {
		return state.activeListItems[id]
	}
	return {}
}


export const getListItemInitialOrders = (state) => {
	return state.listItemInitialOrders
}


export const getNumTempItems = (state) => {
	return state.numTempItems
}


export const getActiveListItems = (state) => {
	return state.activeListItems
}


export const getVisibleListIDs = (state) => {
	const idStrings = Object.keys(state.activeListItems).filter(itemID => !state.activeListItems[itemID].hidden)
	return idStrings.map(itemID => Number(itemID))
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

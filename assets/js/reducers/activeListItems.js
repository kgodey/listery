import { compareByOrder, getReorderedItems, addItemToTop } from './utils.js'
import * as listAPIActions from '../actions/list'
import * as listItemAPIActions from '../actions/list-item'


export const activeListItems = (state={}, action) => {
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
		case listItemAPIActions.RECEIVE_DELETED_LIST_ITEM:
			delete newState[action.id]
			return newState
		default:
			return state
	}
}


export const getSortedListItems = (state) => {
	let items = Object.keys(state.activeListItems).map(item => state.activeListItems[item])
	return items.sort(compareByOrder)
}

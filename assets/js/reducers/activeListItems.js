import { compareByOrder, getReorderedItems, addItemToTop } from './utils.js'
import * as listAPIActions from '../actions/list'
import * as listItemAPIActions from '../actions/list-item'


export const activeListItems = (state={}, action) => {
	let newState = {...state}
	switch(action.type) {
		case listAPIActions.FETCH_LIST_SUCCESS:
			if (action.data.items && action.data.items.length > 0) {
				return Object.assign(...action.data.items.map(item => ({[item.id]: item})))
			}
			return {}
		case listItemAPIActions.FETCH_LIST_ITEM_SUCCESS:
			const created = (action.data.id in newState)
			newState[action.data.id] = action.data
			if (created === true) {
				addItemToTop(newState, action.data.id)
			}
			return newState
		case listItemAPIActions.REORDER_LIST_ITEM_SUCCESS:
			// Update the order of all affected objects.
			return getReorderedItems(state, action)
		case listItemAPIActions.DELETE_LIST_ITEM_SUCCESS:
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

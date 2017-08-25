import { combineReducers } from 'redux'
import * as listAPIActions from '../actions/api/list'
import * as listItemAPIActions from '../actions/api/list-item'
import { switchActiveList } from '../actions/ui'


const updateActiveList = (state={}, action) => {
	switch(action.type) {
		case listAPIActions.RECEIVE_ACTIVE_LIST:
		case listAPIActions.RECEIVE_NEW_LIST:
		case listAPIActions.RECEIVE_UPDATED_LIST:
			return action.data
		case listItemAPIActions.RECEIVE_NEW_LIST_ITEM:
			if (state) {
				let oldItems = state.items
				oldItems.unshift(action.data)
				return {
					...state,
					items: oldItems
				}
			} else {
				return state
			}
		case listItemAPIActions.RECEIVE_UPDATED_LIST_ITEM:
			return {
				...state,
				// transform the one with a matching ID, otherwise return original item
				items: state.items.map(item => item.id === action.data.id ? action.data : item)
			}
		case listItemAPIActions.RECEIVE_REMOVED_LIST_ITEM:
			return {
				...state,
				items: state.items.filter(item => item.id !== action.id)
			}
		default:
			return state
	}
}


const updateAllLists = (state=[], action) => {
	switch(action.type) {
		case listAPIActions.RECEIVE_ALL_LISTS:
			return action.data
		case listAPIActions.RECEIVE_NEW_LIST:
			if (state) {
				let newState = [...state]
				newState.unshift(action.data)
				return newState
			} else {
				return state
			}
		case listAPIActions.RECEIVE_UPDATED_LIST:
			// transform the one with a matching ID, otherwise return original item
			return state.map(item => item.id === action.data.id ? action.data : item)
		default:
			return state
	}
}


export const listeryApp = combineReducers({
	activeList: updateActiveList,
	allLists: updateAllLists
})

import { combineReducers } from 'redux'
import * as apiActions from '../actions/api'
import { switchActiveList } from '../actions/ui'


const updateActiveList = (state={}, action) => {
	switch(action.type) {
		case apiActions.RECEIVE_ACTIVE_LIST:
		case apiActions.RECEIVE_NEW_LIST:
		case apiActions.RECEIVE_UPDATED_LIST:
			return action.data
		case apiActions.RECEIVE_NEW_LIST_ITEM:
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
		case apiActions.RECEIVE_UPDATED_LIST_ITEM:
			return {
				...state,
				// transform the one with a matching ID, otherwise return original item
				items: state.items.map(item => item.id === action.data.id ? action.data : item)
			}
		case apiActions.RECEIVE_REMOVED_LIST_ITEM:
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
		case apiActions.RECEIVE_ALL_LISTS:
			return action.data
		case apiActions.RECEIVE_NEW_LIST:
			if (state) {
				let newState = [...state]
				newState.unshift(action.data)
				return newState
			} else {
				return state
			}
		case apiActions.RECEIVE_UPDATED_LIST:
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

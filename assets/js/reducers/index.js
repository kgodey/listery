import { combineReducers } from 'redux';
import { RECEIVE_ACTIVE_LIST, RECEIVE_ALL_LISTS, RECEIVE_NEW_LIST_ITEM, RECEIVE_NEW_LIST } from '../actions/api'
import { switchActiveList } from '../actions/ui'


const updateActiveList = (state={}, action) => {
	switch(action.type) {
		case RECEIVE_ACTIVE_LIST:
		case RECEIVE_NEW_LIST:
			return action.data
		case RECEIVE_NEW_LIST_ITEM:
			if (state) {
				let newState = {
					...state
				}
				newState.items.unshift(action.data)
				return newState
			} else {
				return state
			}
		default:
			return state
	}
}


const updateAllLists = (state=[], action) => {
	switch(action.type) {
		case RECEIVE_ALL_LISTS:
			return action.data
		case RECEIVE_NEW_LIST:
			if (state) {
				let newState = [...state]
				newState.unshift(action.data)
				return newState
			} else {
				return state
			}
		default:
			return state
	}
}


export const listeryApp = combineReducers({
  activeList: updateActiveList,
  allLists: updateAllLists
});

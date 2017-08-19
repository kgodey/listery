import { combineReducers } from 'redux';
import { RECEIVE_ACTIVE_LIST, RECEIVE_ALL_LISTS } from '../actions/api'


const setActiveList = (state={}, action) => {
	switch(action.type) {
		case RECEIVE_ACTIVE_LIST:
			return action.json
		default:
			return state
	}
}


const setAllLists = (state=[], action) => {
	switch(action.type) {
		case RECEIVE_ALL_LISTS:
			return action.json
		default:
			return state
	}
}



export const listeryApp = combineReducers({
  activeList: setActiveList,
  allLists: setAllLists
});

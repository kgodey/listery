import { combineReducers } from 'redux';
import { REQUEST_LIST, RECEIVE_LIST } from '../actions/api'


export const list = (state={}, action) => {
	switch(action.type) {
		case RECEIVE_LIST:
			return action.json
		default:
			return state
	}
}

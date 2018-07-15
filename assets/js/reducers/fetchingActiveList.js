import * as listAPIActions from '../actions/list'


export const fetchingActiveList = (state, action) => {
	let newState = state !== undefined ? state : false
	switch(action.type) {
		case listAPIActions.REQUEST_ACTIVE_LIST_CHANGE:
			return true
		case listAPIActions.RECEIVE_ACTIVE_LIST:
		case listAPIActions.RECEIVE_ACTIVE_LIST_ERROR:
			return false
		default:
			return newState
	}
}


export const getActiveListFetchStatus = (state) => {
	return state.fetchingActiveList
}

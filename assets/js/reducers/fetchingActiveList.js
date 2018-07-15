import * as listAPIActions from '../actions/list'


export const fetchingActiveList = (state, action) => {
	let newState = state !== undefined ? state : false
	switch(action.type) {
		case listAPIActions.ACTIVE_LIST_CHANGED:
			return true
		case listAPIActions.FETCH_LIST_SUCCESS:
			if (action.isActive) {
				return false
			}
		case listAPIActions.FETCH_ACTIVE_LIST_ERROR:
			return false
		default:
			return newState
	}
}


export const getActiveListFetchStatus = (state) => {
	return state.fetchingActiveList
}

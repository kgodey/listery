import * as listAPIActions from '../actions/list'


export const activeListID = (state=firstListID, action) => {
	switch(action.type) {
		case listAPIActions.FETCH_ACTIVE_LIST_REQUEST:
			return action.id
		case listAPIActions.CREATE_LIST_SUCCESS:
			if (action.data.result) {
				return action.data.result
			}
			return state
		case listAPIActions.FETCH_ACTIVE_LIST_ERROR:
		case listAPIActions.NO_ACTIVE_LIST_AVAILABLE:
			return null
		default:
			return state
	}
}


export const fetchingActiveList = (state, action) => {
	let newState = state !== undefined ? state : false
	switch(action.type) {
		case listAPIActions.FETCH_ACTIVE_LIST_REQUEST:
			return true
		case listAPIActions.FETCH_ACTIVE_LIST_SUCCESS:
			return false
		case listAPIActions.CREATE_LIST_SUCCESS:
		case listAPIActions.FETCH_ACTIVE_LIST_ERROR:
			return false
		default:
			return newState
	}
}


export const activeListError = (state, action) => {
	let defaultState = {
		isError: false,
		errorMessage: null
	}
	let newState = state !== undefined ? state : defaultState
	switch(action.type) {
		case listAPIActions.FETCH_ACTIVE_LIST_ERROR:
			return {
				isError: true,
				errorMessage: action.errorMessage
			}
		case listAPIActions.UPDATE_ACTIVE_LIST_ERROR:
		case listAPIActions.FETCH_ACTIVE_LIST_SUCCESS:
			return defaultState
		default:
			return newState
	}
}


export const getActiveListID = (state) => {
	return state.activeListID
}


export const getActiveList = (state) => {
	return state.allLists[state.activeListID]
}


export const getActiveListFetchStatus = (state) => {
	return state.fetchingActiveList
}


export const getActiveListErrorStatus = (state) => {
	return state.activeListError
}

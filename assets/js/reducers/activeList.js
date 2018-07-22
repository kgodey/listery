import * as listAPIActions from '../actions/list'


export const activeListID = (state=firstListID, action) => {
	switch(action.type) {
		case listAPIActions.ARCHIVE_LIST_SUCCESS:
			// if the current list has been deleted, load the default list
			if (state == action.id) {
				return action.nextListID
			}
			return state
		case listAPIActions.FETCH_LIST_SUCCESS:
			if (action.data.id) {
				return action.data.id
			}
			return state
		case listAPIActions.FETCH_ACTIVE_LIST_ERROR:
			return null
		default:
			return state
	}
}


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
				errorMessage: action.errorData.detail
			}
		case listAPIActions.FETCH_LIST_SUCCESS:
			if (action.isActive) {
				return defaultState
			}
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

import * as listAPIActions from '../actions/list'


export const activeListError = (state, action) => {
	let defaultState = {
		isError: false,
		errorMessage: null
	}
	let newState = state !== undefined ? state : defaultState
	switch(action.type) {
		case listAPIActions.RECEIVE_ACTIVE_LIST_ERROR:
			return {
				isError: true,
				errorMessage: action.errorData.detail
			}
		case listAPIActions.RECEIVE_ACTIVE_LIST:
			return defaultState
		default:
			return newState
	}
}


export const getActiveListErrorStatus = (state) => {
	return state.activeListError
}

import * as listAPIActions from '../actions/list'


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


export const getActiveListErrorStatus = (state) => {
	return state.activeListError
}

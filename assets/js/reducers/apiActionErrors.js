import * as commonActions from '../actions/common'


export const apiActionError = (state, action) => {
	let defaultState = {
		isError: false,
		errorMessage: null
	}
	let newState = state !== undefined ? state : defaultState
	switch(action.type) {
		case commonActions.API_ACTION_FAILURE:
			return {
				isError: true,
				errorMessage: action.errorMessage
			}
		case commonActions.API_ERROR_DISMISSED:
			return defaultState
		default:
			return newState
	}
}


export const getCurrentAPIError = (state) => {
	return state.apiActionError
}

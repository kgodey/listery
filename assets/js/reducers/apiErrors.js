import * as commonActions from '../actions/common'
import * as listAPIActions from '../actions/list'
import * as listItemAPIActions from '../actions/list-item'


export const apiError = (state, action) => {
	let defaultState = {
		isError: false,
		errorMessage: null
	}
	let newState = state !== undefined ? state : defaultState
	switch(action.type) {
		case commonActions.GENERIC_API_ACTION_FAILURE:
		case listItemAPIActions.UPDATE_LIST_ITEM_ERROR:
		case listAPIActions.UPDATE_ACTIVE_LIST_ERROR:
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
	return state.apiError
}

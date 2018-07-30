export const API_ACTION_FAILURE = 'API_ACTION_FAILURE'
export const API_ERROR_DISMISSED = 'API_ERROR_DISMISSED'


export const apiActionFailure = (errorMessage) => ({
	type: API_ACTION_FAILURE,
	errorMessage
})


export const apiErrorDismissed = () => {
	return {
		type: API_ERROR_DISMISSED
	}
}

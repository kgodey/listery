export const GENERIC_API_ACTION_FAILURE = 'GENERIC_API_ACTION_FAILURE'
export const API_ERROR_DISMISSED = 'API_ERROR_DISMISSED'


export const genericAPIActionFailure = (errorMessage) => ({
	type: GENERIC_API_ACTION_FAILURE,
	errorMessage
})


export const apiErrorDismissed = () => {
	return {
		type: API_ERROR_DISMISSED
	}
}

import * as listAPIActions from '../actions/list'


export const activeListID = (state=firstListID, action) => {
	switch(action.type) {
		case listAPIActions.RECEIVE_ARCHIVED_LIST:
			// if the current list has been deleted, load the default list
			if (state == action.id) {
				return action.nextListID
			}
			return state
		case listAPIActions.RECEIVE_ACTIVE_LIST:
		case listAPIActions.RECEIVE_NEW_LIST:
		case listAPIActions.RECEIVE_UPDATED_LIST:
			if (action.data.id) {
				return action.data.id
			}
			return state
		case listAPIActions.RECEIVE_ACTIVE_LIST_ERROR:
			return null
		default:
			return state
	}
}

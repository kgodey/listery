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

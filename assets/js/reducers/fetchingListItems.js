import * as listItemAPIActions from '../actions/list-item'


export const fetchingListItems = (state, action) => {
	let newState = {...state}
	switch(action.type) {
		case listItemAPIActions.REQUEST_LIST_ITEM_UPDATE:
			newState[action.id] = true
			return newState
		case listItemAPIActions.REQUEST_LIST_ITEM_REORDER:
			newState[action.id] = true
			return newState
		case listItemAPIActions.RECEIVE_UPDATED_LIST_ITEM:
			newState[action.data.id] = false
			return newState
		case listItemAPIActions.RECEIVE_REORDERED_LIST_ITEM:
			newState[action.id] = false
			return newState
		default:
			return newState
	}
}


export const getListItemFetchStatus = (state, id) => {
	if (state.fetchingListItems && id in state.fetchingListItems) {
		return state.fetchingListItems[id]
	}
	return false
}

import * as listItemAPIActions from '../actions/list-item'


export const fetchingListItems = (state, action) => {
	let newState = {...state}
	switch(action.type) {
		case listItemAPIActions.FETCH_LIST_ITEM_REQUEST:
			newState[action.id] = true
			return newState
		case listItemAPIActions.REORDER_LIST_ITEM_REQUEST:
			newState[action.id] = true
			return newState
		case listItemAPIActions.FETCH_LIST_ITEM_SUCCESS:
			newState[action.data.id] = false
			return newState
		case listItemAPIActions.REORDER_LIST_ITEM_SUCCESS:
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

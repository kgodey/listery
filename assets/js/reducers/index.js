import { combineReducers } from 'redux'

import { activeListID, fetchingActiveList, activeListError } from './activeList'
import { activeListItems, fetchingListItems } from './activeListItems'
import { allLists, fetchingAllLists, allListsError } from './allLists'


export const listeryApp = combineReducers({
	fetchingActiveList,
	activeListID,
	fetchingListItems,
	activeListItems,
	activeListError,
	fetchingAllLists,
	allLists,
	allListsError
})

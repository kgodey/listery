import { combineReducers } from 'redux'

import { activeListID, fetchingActiveList, activeListError } from './activeList'
import { activeListItems, fetchingListItems } from './activeListItems'
import { allLists, fetchingAllLists, allListsError } from './allLists'
import { apiError } from './apiErrors'


export const listeryApp = combineReducers({
	activeListID,
	fetchingActiveList,
	fetchingListItems,
	activeListItems,
	activeListError,
	fetchingAllLists,
	allLists,
	allListsError,
	apiError
})

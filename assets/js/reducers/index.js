import { combineReducers } from 'redux'

import { activeListID, fetchingActiveList, activeListError } from './activeList'
import { activeListItems, fetchingListItems } from './activeListItems'
import { allLists } from './allLists'


export const listeryApp = combineReducers({
	activeListID,
	fetchingActiveList,
	activeListError,
	activeListItems,
	fetchingListItems,
	allLists,
})

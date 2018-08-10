import { combineReducers } from 'redux'

import { activeListID, fetchingActiveList, activeListError } from './activeList'
import { activeListItems, fetchingListItems, listItemInitialOrders } from './activeListItems'
import { allLists, loadingAllLists, allListsError, listInitialOrders } from './allLists'
import { apiError } from './apiErrors'


export const listeryApp = combineReducers({
	activeListID,
	fetchingActiveList,
	fetchingListItems,
	activeListItems,
	activeListError,
	loadingAllLists,
	allLists,
	allListsError,
	apiError,
	listItemInitialOrders,
	listInitialOrders
})

import { combineReducers } from 'redux'

import { activeListID, fetchingActiveList, activeListError, showFilterInterface } from './activeList'
import { activeListItems, fetchingListItems, listItemInitialOrders, numTempItems } from './activeListItems'
import { allLists, loadingAllLists, allListsError, listInitialOrders } from './allLists'
import { apiError } from './apiErrors'


export const listeryApp = combineReducers({
	activeListID,
	fetchingActiveList,
	fetchingListItems,
	showFilterInterface,
	activeListItems,
	activeListError,
	loadingAllLists,
	allLists,
	allListsError,
	apiError,
	listItemInitialOrders,
	listInitialOrders,
	numTempItems
})

import { combineReducers } from 'redux'

import { activeListID } from './activeListID'
import { fetchingActiveList } from './fetchingActiveList'
import { activeListError } from './activeListError'
import { activeListItems } from './activeListItems'
import { fetchingListItems } from './fetchingListItems'
import { listsByID } from './listsByID'


export const listeryApp = combineReducers({
	activeListID,
	fetchingActiveList,
	activeListError,
	activeListItems,
	fetchingListItems,
	listsByID,
})

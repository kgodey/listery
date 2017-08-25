import store from '../store'
import * as listAPIActions from './api/list'
import * as listItemAPIActions from './api/list-item'


export const switchActiveList = (id) => {
	store.dispatch(listAPIActions.fetchActiveList(id))
}


export const saveListName = (id, value) => {
	store.dispatch(listAPIActions.patchList(id, {name: value}))
}


export const saveListPrivacy = (id, value) => {
	store.dispatch(listAPIActions.patchList(id, {private: value}))
}


export const addNewList = (listName) => {
	store.dispatch(listAPIActions.createNewList(listName))
}


export const performActionOnList = (id, actionURL) => {
	if ([listAPIActions.QUICK_SORT, listAPIActions.CHECK_ALL, listAPIActions.UNCHECK_ALL].includes(actionURL)) {
		store.dispatch(listAPIActions.performActionOnList(id, actionURL))
	}
}


export const addNewListItem = (title, listID) => {
	store.dispatch(listItemAPIActions.createNewListItem(title, listID))
}


export const removeListItem = (listID) => {
	store.dispatch(listItemAPIActions.deleteListItem(listID))
}


export const toggleListItemCompletion = (id, value) => {
	store.dispatch(listItemAPIActions.patchListItem(id, {completed: value}))
}


export const saveListItemTitle = (id, value) => {
	store.dispatch(listItemAPIActions.patchListItem(id, {title: value}))
}

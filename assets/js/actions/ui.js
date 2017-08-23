import store from '../store'
import * as apiActions from './api'


export const switchActiveList = (id) => {
	store.dispatch(apiActions.fetchActiveList(id))
}


export const addNewListItem = (title, listId) => {
	store.dispatch(apiActions.createNewListItem(title, listId))
}


export const addNewList = (listName) => {
	store.dispatch(apiActions.createNewList(listName))
}


export const toggleListItemCompletion = (id, value) => {
	store.dispatch(apiActions.patchListItem(id, {completed: value}))
}


export const saveListItemTitle = (id, value) => {
	store.dispatch(apiActions.patchListItem(id, {title: value}))
}


export const saveListName = (id, value) => {
	store.dispatch(apiActions.patchList(id, {name: value}))
}

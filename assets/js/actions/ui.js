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


export const toggleCompleted = (id, value) => {
	store.dispatch(apiActions.toggleListItemCompleted(id, value))
}

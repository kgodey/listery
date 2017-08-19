import store from '../store'
import { fetchActiveList, createNewListItem, createNewList } from './api'


export const switchActiveList = (id) => {
	store.dispatch(fetchActiveList(id));
}


export const addNewListItem = (title, listId) => {
	store.dispatch(createNewListItem(title, listId))
}


export const addNewList = (listName) => {
	store.dispatch(createNewList(listName))
}

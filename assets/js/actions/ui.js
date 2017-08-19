import store from '../store'
import { fetchActiveList } from './api'


export const switchActiveList = (id) => {
	store.dispatch(fetchActiveList(id));
}

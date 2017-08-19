import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { listeryApp } from './reducers/index'


const configureStore = () => {
	const middlewares = [thunk, createLogger()]
	return createStore(
		listeryApp,
		applyMiddleware(...middlewares)
	)
}

export default configureStore()

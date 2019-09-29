import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import { listeryApp } from './reducers/index'


const configureStore = () => {
	let middlewares = [thunk]
	if (frontendLogsEnabled) {
		middlewares.push(createLogger())
	}
	return createStore(
		listeryApp,
		applyMiddleware(...middlewares)
	)
}

export default configureStore

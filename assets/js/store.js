import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { list } from './reducers/index'


const configureStore = () => {
	const middlewares = [thunk, createLogger()];
	return createStore(
		list,
		applyMiddleware(...middlewares)
	);
};

export default configureStore();

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'

import App from './components/App.jsx'
import configureStore from './store'


const store = configureStore()


ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Route path='/:id?' component={App} />
		 </BrowserRouter>
	</Provider>,
	document.getElementById('app')
)

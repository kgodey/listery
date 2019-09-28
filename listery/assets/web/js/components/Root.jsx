import PropTypes from 'prop-types'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'

import App from './App.jsx'


const Root = ({ store }) => (
	<Provider store={store}>
		<BrowserRouter>
			<div>
				<Route exact path='/' component={App} />
				<Route exact path='/lists/' component={App} />
				<Route path='/lists/:id' component={App} />
			</div>
		</BrowserRouter>
	</Provider>
)


Root.propTypes = {
  store: PropTypes.object.isRequired,
}


export default Root

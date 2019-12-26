import PropTypes from 'prop-types'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'

import WebApp from './WebApp.jsx'


const WebRoot = ({ store }) => (
	<Provider store={store}>
		<BrowserRouter>
			<div>
				<Route exact path='/' component={WebApp} />
				<Route exact path='/lists/' component={WebApp} />
				<Route path='/lists/:id' component={WebApp} />
			</div>
		</BrowserRouter>
	</Provider>
)


WebRoot.propTypes = {
  store: PropTypes.object.isRequired,
}


export default WebRoot

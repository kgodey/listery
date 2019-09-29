import React from 'react'
import { render } from 'react-dom'

import Root from './components/Root.jsx'
import configureStore from './store'

import '../css/web.css'
import 'bootstrap/dist/css/bootstrap.min.css'


const store = configureStore()
render(
	<Root store={store} />,
	document.getElementById('app')
)

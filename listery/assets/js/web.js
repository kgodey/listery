import React from 'react'
import { render } from 'react-dom'

import WebRoot from './components/WebRoot.jsx'
import configureStore from './store'

import '../css/web.css'
import 'bootstrap/dist/css/bootstrap.min.css'


const store = configureStore()
render(
	<WebRoot store={store} />,
	document.getElementById('app')
)

// Import React and ReactDOM
import React from 'react'
import { render } from 'react-dom'

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle.js'
import Framework7React from 'framework7-react'

// Import styles
import 'framework7/css/framework7.bundle.css'
import '../css/icons.scss'
import '../css/mobile.scss'

// Import root compontnent and store
import MobileApp from './components/MobileApp.jsx'
import configureStore from './store'

// Init F7 React Plugin
Framework7.use(Framework7React)

// Mount React application
const store = configureStore()
render(
	<MobileApp store={store} />,
	document.getElementById('app'),
)

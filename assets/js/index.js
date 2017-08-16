import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/App'
import store from './store'


const render = () => {
	ReactDOM.render(<App store={store} />, document.getElementById('app'));
}

store.subscribe(render);
render();

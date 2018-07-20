import PropTypes from 'prop-types'
import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import ActiveList from './App/ActiveList.jsx'
import ListSwitcher from './App/ListSwitcher.jsx'


const switcherStyle = {
	cursor: 'pointer'
}


// this cannot be a stateless functional component because it needs a DragDropContext
class App extends React.Component {
	render() {
		return (
			<div className="container-fluid col-sm-10">
				<div className="row">
					<div className="col-sm-8 mt-3">
						<ActiveList />
					</div>
					<div className="col-sm-4 list-group mt-3" style={switcherStyle}>
						<ListSwitcher />
					</div>
				</div>
			</div>
		)
	}
}


export default DragDropContext(HTML5Backend)(App)

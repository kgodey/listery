import PropTypes from 'prop-types'
import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { connect } from 'react-redux'

import { fetchAllLists } from '../actions/list'
import ActiveList from './App/ActiveList.jsx'
import ListSwitcher from './App/ListSwitcher.jsx'


const switcherStyle = {
	cursor: 'pointer'
}


class App extends React.Component {
	componentDidMount() {
		// Load initial data from backend once components mounts.
		const { fetchAllLists } = this.props
		fetchAllLists()
	}

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


App.propTypes = {
	fetchAllLists: PropTypes.func.isRequired,
}


App = connect(
	null,
	{ fetchAllLists }
)(App)
export default DragDropContext(HTML5Backend)(App)

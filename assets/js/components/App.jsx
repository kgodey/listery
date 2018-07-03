import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { connect } from 'react-redux'

import { fetchActiveList, fetchAllLists } from '../actions//list'
import { getActiveListErrorStatus } from '../reducers/index'
import ActiveList from './App/ActiveList.jsx'
import ListSwitcher from './App/ListSwitcher.jsx'


class App extends React.Component {
	componentDidMount() {
		// Load initial data from backend once components mounts.
		this.props.getActiveList()
		this.props.getAllLists()
	}

	render() {
		return (
			<div className="container-fluid col-sm-10">
				<div className="row">
					<ActiveList error={this.props.activeListError} />
					<ListSwitcher />
				</div>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		activeListError: getActiveListErrorStatus(state)
	}
}


const mapDispatchToProps = (dispatch, ownProps) => {
	let activeListID
	if (ownProps.match.params.id !== undefined) {
		activeListID = ownProps.match.params.id
	}
	return {
		getActiveList: () => {
			dispatch(fetchActiveList(activeListID))
		},
		getAllLists: () => {
			dispatch(fetchAllLists())
		}
	}
}

App = connect(mapStateToProps, mapDispatchToProps)(App)

export default DragDropContext(HTML5Backend)(App)

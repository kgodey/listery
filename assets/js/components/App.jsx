import PropTypes from 'prop-types'
import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { connect } from 'react-redux'

import { fetchActiveList, fetchAllLists } from '../actions//list'
import { getActiveListErrorStatus } from '../reducers/index'
import ActiveList from './App/ActiveList.jsx'
import ListSwitcher from './App/ListSwitcher.jsx'


const switcherStyle = {
	cursor: 'pointer'
}


class App extends React.Component {
	componentDidMount() {
		// Load initial data from backend once components mounts.
		const { fetchActiveList, fetchAllLists } = this.props
		fetchActiveList()
		fetchAllLists()
	}

	render() {
		const { activeListError } = this.props
		return (
			<div className="container-fluid col-sm-10">
				<div className="row">
					<div className="col-sm-8 mt-3">
						<ActiveList error={activeListError} />
					</div>
					<div className="col-sm-4 list-group mt-3" style={switcherStyle}>
						<ListSwitcher />
					</div>
				</div>
			</div>
		)
	}
}


const mapStateToProps = (state) => ({
	activeListError: getActiveListErrorStatus(state)
})


const mapDispatchToProps = (dispatch, ownProps) => ({
	fetchActiveList: () => {
		let activeListID
		if (ownProps.match.params.id !== undefined) {
			activeListID = ownProps.match.params.id
		}
		dispatch(fetchActiveList(activeListID))
	},
	fetchAllLists: () => {
		dispatch(fetchAllLists())
	}
})


App.propTypes = {
	fetchActiveList: PropTypes.func.isRequired,
	fetchAllLists: PropTypes.func.isRequired,
}


App = connect(mapStateToProps, mapDispatchToProps)(App)
export default DragDropContext(HTML5Backend)(App)

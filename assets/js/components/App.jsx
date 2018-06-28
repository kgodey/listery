import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle'
import { connect } from 'react-redux'

import { fetchActiveList, fetchAllLists } from '../actions//list'
import { getActiveListErrorStatus } from '../reducers/index'
import ActiveList from './App/ActiveList.jsx'
import ListSwitcher from './App/ListSwitcher.jsx'


class App extends React.Component {
	constructor(props) {
		super(props)
		this.fetchData = this.fetchData.bind(this)
	}

	componentDidMount() {
		this.fetchData()
	}

	fetchData() {
		this.props.getActiveList()
		this.props.getAllLists()
	}

	render() {
		if (this.props.activeListError.isError) {
			return (
				<div className="container-fluid col-md-10">
					<div className="row">
						<div className="col-md-8 mt-3">
							<div className="card border-danger">
								<div className="card-header bg-danger text-white">
									<FaExclamationTriangle style={{marginRight: '0.5em'}} className="align-middle"/>
									<span className="align-middle">Error!</span>
								</div>
								<div className="card-body">
									This list could not be retrieved. Error message: <em>{this.props.activeListError.errorMessage}</em>
								</div>
							</div>
						</div>
						<ListSwitcher />
					</div>
				</div>
			)
		}
		return (
			<div className="container-fluid col-md-10">
				<div className="row">
					<ActiveList />
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

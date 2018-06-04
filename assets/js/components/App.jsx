import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { connect } from 'react-redux'

import { fetchActiveList, fetchAllLists } from '../actions//list'
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

const mapDispatchToProps = (dispatch) => {
	return {
		getActiveList: () => {
			dispatch(fetchActiveList())
		},
		getAllLists: () => {
			dispatch(fetchAllLists())
		}
	}
}

App = connect(null, mapDispatchToProps)(App)

export default DragDropContext(HTML5Backend)(App)

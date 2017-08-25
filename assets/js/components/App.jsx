import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'
import { fetchActiveList, fetchAllLists } from '../actions/api/list'
import { ActiveList } from './App/ActiveList.jsx'
import { ListSwitcher } from './App/ListSwitcher.jsx'


export class App extends React.Component {
	componentDidMount() {
		this.props.store.dispatch(fetchActiveList())
		this.props.store.dispatch(fetchAllLists())
	}

	render() {
		const activeList = this.props.store.getState().activeList
		const allLists = this.props.store.getState().allLists
		return (
			<div className="container-fluid col-md-10">
				<div className="row">
					<ActiveList
						{...activeList}
					/>
					<ListSwitcher
						allLists={allLists}
						activeListID={activeList.id}
					/>
				</div>
			</div>
		)
	}
}

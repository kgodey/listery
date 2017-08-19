import React from 'react'
import { Provider } from 'react-redux'
import { ActiveList } from './ActiveList.jsx'
import { store } from '../store'
import { fetchActiveList, fetchAllLists } from '../actions/api'
import { ListSwitcher } from './ListSwitcher.jsx'


export class App extends React.Component {
	componentDidMount() {
		this.props.store.dispatch(fetchActiveList())
		this.props.store.dispatch(fetchAllLists())
	}

	render() {
		const list = this.props.store.getState().activeList;
		const allLists = this.props.store.getState().allLists;
		return (
			<div className="container-fluid col-md-8">
				<div className="row">
					<div className="col-md-8" id="current-list-header-region">
					</div>
				</div>
				<div className="row">
					<div className="col-md-6" id="current-list-actions-region">
					</div>
					<div className="col-md-2" id="current-list-count-region">
					</div>
				</div>
				<div className="row">
					<div className="col-md-8" id="current-list-items-region">
						<ActiveList
							{...list}
						/>
					</div>
					<div id="all-lists-region" className="col-md-4">
						<ListSwitcher
							allLists={allLists}
						/>
					</div>
				</div>
			</div>
		);
	}
}

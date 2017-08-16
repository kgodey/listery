import React from 'react'
import { Provider } from 'react-redux'
import { List } from './List'
import { store } from '../store'
import { fetchList } from '../actions/api'


export class App extends React.Component {
	componentDidMount() {
		this.props.store.dispatch(fetchList())
	}

	render() {
		const list = this.props.store.getState();
		return (
			<div>
				<List
					key={list.id}
					{...list}
				/>
			</div>
		);
	}
}

import React from 'react'
import { ListLink } from './ListSwitcher/ListLink.jsx'
import { AddList } from './ListSwitcher/AddList.jsx'
import { switchActiveList } from '../../actions/ui'


export class ListSwitcher extends React.Component {
	render() {
		const allLists = this.props.allLists ? this.props.allLists : []
		const activeListID = this.props.activeListID
		if (allLists.length > 0) {
			return (
				<div className="col-md-4 list-group">
					<AddList />
					{allLists.map(list =>
						<ListLink key={list.id} {...list} activeList={list.id == activeListID ? true : false} onListClick={ switchActiveList }/>
					)}
				</div>
			)
		}
		return null
	}
}

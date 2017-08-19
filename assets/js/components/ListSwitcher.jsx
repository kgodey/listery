import React from 'react'
import { ListLink } from './ListLink.jsx'
import { switchActiveList } from '../actions/ui'
import { AddList } from './AddList.jsx'


export class ListSwitcher extends React.Component {
	render() {
		const allLists = this.props.allLists ? this.props.allLists : []
		const activeListId = this.props.activeListId
		if (allLists.length > 0) {
			return (
				<div className='list-group'>
					<AddList />
					{allLists.map(list =>
						<ListLink key={list.id} {...list} activeList={list.id == activeListId ? true : false} onListClick={ switchActiveList }/>
					)}
				</div>
			);
		}
		return null;
	}
}

import React from 'react'
import { ListLink } from './ListLink.jsx'


export class ListSwitcher extends React.Component {
	render() {
		const allLists = this.props.allLists ? this.props.allLists : []
		const activeListId = this.props.activeListId
		if (allLists.length > 0) {
			return (
				<div className='list-group'>
					{allLists.map(list =>
						<ListLink key={list.id} {...list} activeList={list.id == activeListId ? true : false}/>
					)}
				</div>
			);
		}
		return null;
	}
}

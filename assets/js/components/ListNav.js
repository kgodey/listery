import React from 'react'
import { ListLink } from './ListLink'


export class ListNav extends React.Component {
	render() {
		const allLists = this.props.allLists ? this.props.allLists : []
		if (allLists.length > 0) {
			console.log(allLists)
			return (
				<div className='list-group'>
					{allLists.map(list =>
						<ListLink key={list.id} {...list}/>
					)}
				</div>
			);
		}
		return null;
	}
}

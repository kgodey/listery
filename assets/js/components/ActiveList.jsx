import React from 'react'
import { ListItem } from './ListItem.jsx'


export class ActiveList extends React.Component {
	render() {
		const items = this.props.items ? this.props.items : []
		if (items) {
			return (
				<div>
					<h1>{this.props.name}</h1>
					<div className='list-group'>
						{items.map(item =>
							<ListItem key={item.id} {...item}/>
						)}
					</div>
				</div>
			);
		}
		return;
	}
}

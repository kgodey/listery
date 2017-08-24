import React from 'react'
import { ListHeader } from './ActiveList/ListHeader.jsx'
import { AddListItem } from './ActiveList/AddListItem.jsx'
import { ListItem } from './ActiveList/ListItem.jsx'


export class ActiveList extends React.Component {

	render() {
		const items = this.props.items ? this.props.items : []
		return (
			<div>
				<ListHeader {...this.props} />
				<div className='list-group'>
					<AddListItem listID={this.props.id} />
					{items.map(item =>
						<ListItem key={item.id} {...item}/>
					)}
				</div>
			</div>
		)
	}
}

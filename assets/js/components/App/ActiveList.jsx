import React from 'react'
import { DragDropContext } from 'react-dnd';
import { connect } from 'react-redux'

import { getSortedListItems } from '../../reducers/index'
import ListHeader from './ActiveList/ListHeader.jsx'
import AddListItem from './ActiveList/AddListItem.jsx'
import ListItem from './ActiveList/ListItem.jsx'


class ActiveList extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="col-md-8">
				<ListHeader />
				<div className='list-group'>
					<AddListItem />
					{this.props.sortedListItems.map(item =>
						<ListItem key={item.id} id={item.id} />
					)}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		sortedListItems: getSortedListItems(state)
	}
}

ActiveList = connect(mapStateToProps, null)(ActiveList)
export default ActiveList

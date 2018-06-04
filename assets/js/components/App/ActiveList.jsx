import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { connect } from 'react-redux'

import { updateListItemOrder } from '../../actions/list-item'
import { getSortedListItems } from '../../reducers/index'
import ListHeader from './ActiveList/ListHeader.jsx'
import AddListItem from './ActiveList/AddListItem.jsx'
import ListItem from './ActiveList/ListItem.jsx'


class ActiveList extends React.Component {
	constructor(props) {
		super(props)
		this.setListItemOrder = this.setListItemOrder.bind(this)
	}

	render() {
		return (
			<div className="col-md-8">
				<ListHeader />
				<div className='list-group'>
					<AddListItem />
					{this.props.sortedListItems.map(item =>
						<ListItem
							key={item.id}
							id={item.id}
							order={item.order}
							listID={item.list_id}
							setListItemOrder={this.setListItemOrder}
						/>
					)}
				</div>
			</div>
		)
	}

	setListItemOrder(id, order, listID) {
		this.props.moveListItem(id, order, listID)
	}
}

const mapStateToProps = (state) => {
	return {
		sortedListItems: getSortedListItems(state)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		moveListItem: (id, order, listID) => {
			dispatch(updateListItemOrder(id, order, listID))
		}
	}
}

ActiveList = connect(mapStateToProps, mapDispatchToProps)(ActiveList)
export default DragDropContext(HTML5Backend)(ActiveList)

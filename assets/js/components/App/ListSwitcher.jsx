import React from 'react'
import { connect } from 'react-redux'

import { reorderList, updateListOrder } from '../../actions/list'
import { moveListItem } from '../../actions/list-item'
import { getSortedLists } from '../../reducers/index'
import ListLink from './ListSwitcher/ListLink.jsx'
import AddList from './ListSwitcher/AddList.jsx'


class ListSwitcher extends React.Component {
	constructor(props) {
		super(props)
		this.setListOrder = this.setListOrder.bind(this)
		this.setListID = this.setListID.bind(this)
		this.showNewOrder = this.showNewOrder.bind(this)
	}

	render() {
		const { sortedLists, activeListID } = this.props
		return (
			<div>
				<AddList />
				{sortedLists.map(item =>
					<ListLink
						key={item.id}
						{...item}
						activeList={item.id == activeListID ? true : false}
						activeListID={activeListID}
						setListOrder={this.setListOrder}
						showNewOrder={this.showNewOrder}
						setListID={this.setListID}
					/>
				)}
				<form id="download-form" method="POST" className="hidden"><span dangerouslySetInnerHTML={{__html: csrfTokenInput}}></span></form>
			</div>
		)
	}

	setListOrder(id, order) {
		const { reorderList } = this.props
		reorderList(id, order)
	}

	setListID(id, listID, oldListID) {
		const { updateListID } = this.props
		updateListID(id, listID, oldListID)
	}

	showNewOrder(dragID, dropOrder) {
		const { updateListOrder } = this.props
		updateListOrder(dragID, dropOrder)
	}

}


const mapStateToProps = (state) => {
	return {
		sortedLists: getSortedLists(state),
		listsByID: state.listsByID,
		activeListID: state.activeListID
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		reorderList: (id, order) => {
			dispatch(reorderList(id, order))
		},
		updateListID: (id, listID, oldListID) => {
			dispatch(moveListItem(id, listID, oldListID))
		},
		updateListOrder: (dragID, dropOrder) => {
			dispatch(updateListOrder(dragID, dropOrder))
		}
	}
}

ListSwitcher = connect(mapStateToProps, mapDispatchToProps)(ListSwitcher)
export default ListSwitcher

import React from 'react'
import { connect } from 'react-redux'

import { updateListOrder, changeUIListSwitcherOrder } from '../../actions/list'
import { moveListItem } from '../../actions/list-item'
import { getSortedLists } from '../../reducers/index'
import ListLink from './ListSwitcher/ListLink.jsx'
import AddList from './ListSwitcher/AddList.jsx'


const groupStyle = {
	cursor: 'pointer'
}


class ListSwitcher extends React.Component {
	constructor(props) {
		super(props)
		this.setListOrder = this.setListOrder.bind(this)
		this.setListID = this.setListID.bind(this)
		this.showNewOrder = this.showNewOrder.bind(this)
	}

	render() {
		return (
			<div className="col-sm-4 list-group mt-3" style={groupStyle}>
				<AddList />
				{this.props.sortedLists.map(item =>
					<ListLink
						key={item.id}
						id={item.id}
						order={item.order}
						activeList={item.id == this.props.activeListID ? true : false}
						activeListID={this.props.activeListID}
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
		this.props.reorderList(id, order)
	}

	setListID(id, listID, oldListID) {
		this.props.updateListID(id, listID, oldListID)
	}

	showNewOrder(dragID, dropOrder) {
		this.props.previewListSwitcherReorder(dragID, dropOrder)
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
			dispatch(updateListOrder(id, order))
		},
		updateListID: (id, listID, oldListID) => {
			dispatch(moveListItem(id, listID, oldListID))
		},
		previewListSwitcherReorder: (dragID, dropOrder) => {
			dispatch(changeUIListSwitcherOrder(dragID, dropOrder))
		}
	}
}

ListSwitcher = connect(mapStateToProps, mapDispatchToProps)(ListSwitcher)
export default ListSwitcher

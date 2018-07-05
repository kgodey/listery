import React from 'react'
import { connect } from 'react-redux'

import { reorderList, previewListOrder } from '../../actions/list'
import { moveListItem } from '../../actions/list-item'
import { getSortedLists } from '../../reducers/index'
import ListLink from './ListSwitcher/ListLink.jsx'
import AddList from './ListSwitcher/AddList.jsx'


class ListSwitcher extends React.Component {
	constructor(props) {
		super(props)
		this.setNewOrder = this.setNewOrder.bind(this)
		this.setListID = this.setListID.bind(this)
		this.previewNewOrder = this.previewNewOrder.bind(this)
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
						setNewOrder={this.setNewOrder}
						previewNewOrder={this.previewNewOrder}
						setListID={this.setListID}
					/>
				)}
				<form id="download-form" method="POST" className="hidden"><span dangerouslySetInnerHTML={{__html: csrfTokenInput}}></span></form>
			</div>
		)
	}

	setNewOrder(id, order) {
		const { reorderList } = this.props
		reorderList(id, order)
	}

	setListID(id, listID, oldListID) {
		const { moveListItem } = this.props
		moveListItem(id, listID, oldListID)
	}

	previewNewOrder(dragID, dropOrder) {
		const { previewListOrder } = this.props
		previewListOrder(dragID, dropOrder)
	}

}


const mapStateToProps = (state) => ({
	sortedLists: getSortedLists(state),
	listsByID: state.listsByID,
	activeListID: state.activeListID
})


const mapDispatchToProps = (dispatch) => ({
	reorderList: (id, order) => {
		dispatch(reorderList(id, order))
	},
	moveListItem: (id, listID, oldListID) => {
		dispatch(moveListItem(id, listID, oldListID))
	},
	previewListOrder: (dragID, dropOrder) => {
		dispatch(previewListOrder(dragID, dropOrder))
	}
})


ListSwitcher = connect(mapStateToProps, mapDispatchToProps)(ListSwitcher)
export default ListSwitcher

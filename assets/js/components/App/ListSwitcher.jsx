import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { reorderList, previewListOrder } from '../../actions/list'
import { moveListItem } from '../../actions/list-item'
import { getSortedLists } from '../../reducers/listsByID'
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

	setListID(id, listID) {
		const { moveListItem } = this.props
		moveListItem(id, listID)
	}

	previewNewOrder(dragID, dropOrder) {
		const { previewListOrder } = this.props
		previewListOrder(dragID, dropOrder)
	}

}


const mapStateToProps = (state) => ({
	sortedLists: getSortedLists(state),
	activeListID: state.activeListID
})


ListSwitcher.propTypes = {
	sortedLists: PropTypes.array.isRequired,
	activeListID: PropTypes.number,
	reorderList: PropTypes.func.isRequired,
	moveListItem: PropTypes.func.isRequired,
	previewListOrder: PropTypes.func.isRequired
}


ListSwitcher = connect(
	mapStateToProps,
	{ reorderList, moveListItem, previewListOrder }
)(ListSwitcher)
export default ListSwitcher

import flow from 'lodash/flow'
import PropTypes from 'prop-types'
import React from 'react'
import DragSource from 'react-dnd/lib/DragSource'
import DropTarget from 'react-dnd/lib/DropTarget'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import SweetAlert from 'react-bootstrap-sweetalert'

import { fetchActiveList, archiveList, downloadPlaintextList } from '../../../actions/list'
import { getNextList } from '../../../reducers/allLists'
import { ItemTypes } from '../../../utils/itemTypes'
import { ArchiveIcon, DownloadIcon } from '../Shared/Icons.jsx'


const listSource = {
	beginDrag({ id, order, initialOrder }) {
		return { id, order, initialOrder }
	},

	endDrag({ order, setNewOrder }, monitor) {
		const didDrop = monitor.didDrop()
		if (!didDrop) {
			const item = monitor.getItem()
			if (monitor.getItemType() == ItemTypes.LIST) {
				setNewOrder(item.id, order, item.initialOrder)
			}
		}
	}
}


const listTarget = {
	hover({ order, previewNewOrder }, monitor, component) {
		const itemType = monitor.getItemType()
		if (itemType == ItemTypes.LIST) {
			const dragID = monitor.getItem().id
			const dropOrder = order
			previewNewOrder(dragID, dropOrder)
		}
	},

	drop({ id, setListID }, monitor, component) {
		const item = monitor.getItem()
		const itemType = monitor.getItemType()
		if (itemType == ItemTypes.LIST_ITEM) {

			const dropID = id
			// Don't make any updates if the item is already in the list
			if (item.list_id == dropID) {
				return
			}
			setListID(item.id, dropID, item.initialOrder)
		}
	},

	canDrop(props, monitor) {
		const item = monitor.getItem()
		const itemType = monitor.getItemType()
		if (itemType == ItemTypes.LIST) {
			return false
		}
		return true
	}
}


const dragCollect = (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
})


const dropCollect = (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver()
})


class ListLink extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentlyHovering: false,
			showAlert: false
		}
		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
		this.handleDownloadClick = this.handleDownloadClick.bind(this)
		this.handleArchiveClick = this.handleArchiveClick.bind(this)
		this.handleArchiveConfirm = this.handleArchiveConfirm.bind(this)
		this.handleArchiveCancel = this.handleArchiveCancel.bind(this)
	}

	handleMouseEnter(event) {
		this.setState({currentlyHovering: true})
	}

	handleMouseLeave(event) {
		this.setState({currentlyHovering: false})
	}

	handleDownloadClick(event) {
		const { id, name, downloadPlaintextList } = this.props
		downloadPlaintextList(id, name)
	}

	handleArchiveClick(event) {
		this.setState({showAlert: true})
	}

	handleArchiveConfirm(event) {
		const { archiveList, nextListID } = this.props
		this.setState({showAlert: false})
		archiveList(nextListID)
	}

	handleArchiveCancel(event) {
		this.setState({showAlert: false})
	}

	render() {
		const {
			connectDragSource,
			isDragging,
			isOver,
			connectDropTarget,
			activeListID,
			id,
			name,
			onClick
		} = this.props
		let isActiveList = activeListID == id
		let className = 'list-group-item row mx-0'
		if (isActiveList) {
			 className = className + ' active'
		} else if (isOver) {
			className = className + ' list-group-item-info'
		}
		const containerStyle = {
			opacity: isDragging ? 0 : 1
		}
		const linkStyle = {
			textDecoration: 'none',
			color: isActiveList ? '#FFFFFF' : '#212529'
		}
		const linkURL = '/new/' + id
		return connectDragSource(connectDropTarget(
			<div className={className} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} style={containerStyle}>
				<div onClick={onClick} className='col-9 px-0 d-inline-block'>
					{name}
				</div>
				<div className='col-3 d-inline-block px-0 text-right'>
					<DownloadIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleDownloadClick} />
					<ArchiveIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleArchiveClick} />
				</div>
				<SweetAlert
					warning
					showCancel
					title='Confirm Archival'
					show={this.state.showAlert}
					confirmBtnText='Yes, archive it!'
					cancelBtnText='Cancel'
					confirmBtnBsStyle='danger'
					cancelBtnBsStyle='default'
					onConfirm={this.handleArchiveConfirm}
					onCancel={this.handleArchiveCancel}
				>
					Are you sure you want to archive <em>{name}</em>? You will not be able to access it in the UI once you archive it.
				</SweetAlert>
			</div>
		))
	}

}


const mapStateToProps = (state, ownProps) => ({
	nextListID: getNextList(state, ownProps.id)
})


const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => {
		dispatch(fetchActiveList({id: ownProps.id}))
	},
	archiveList: (nextListID) => {
		dispatch(archiveList(ownProps.id, nextListID))
	},
	downloadPlaintextList: (id, name) => {
		dispatch(downloadPlaintextList(id, name))
	}
})


ListLink.propTypes = {
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	downloadPlaintextList: PropTypes.func.isRequired,
	archiveList: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
	nextListID: PropTypes.number,
	activeListID: PropTypes.number,
	connectDragSource: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	isOver: PropTypes.bool.isRequired,
	connectDropTarget: PropTypes.func.isRequired
}


ListLink = connect(mapStateToProps, mapDispatchToProps)(ListLink)
export default flow(
	DragSource(ItemTypes.LIST, listSource, dragCollect),
	DropTarget([ItemTypes.LIST, ItemTypes.LIST_ITEM], listTarget, dropCollect)
)(ListLink)

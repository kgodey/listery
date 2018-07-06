import flow from 'lodash/flow'
import PropTypes from 'prop-types'
import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import SweetAlert from 'react-bootstrap-sweetalert'

import { getNextList } from '../../../reducers/index'
import { fetchActiveList, archiveList, downloadPlaintextList } from '../../../actions//list'
import { DeleteIcon, DownloadIcon } from '../Shared/Icons.jsx'
import { ItemTypes } from '../Shared/ItemTypes.jsx'


const listSource = {
	beginDrag({ id, order }) {
		return {
			id,
			order
		}
	},

	endDrag({ order, setNewOrder }, monitor) {
		const didDrop = monitor.didDrop()
		if (!didDrop) {
			const item = monitor.getItem()
			const itemType = monitor.getItemType()
			if (itemType == ItemTypes.LIST) {
				const dragID = item.id
				const dropOrder = order
				setNewOrder(dragID, dropOrder)
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
			const dragID = item.id
			const oldListID = item.listID
			const dropID = id
			// Don't make any updates if the item is already in the list
			if (oldListID == dropID) {
				return
			}
			setListID(dragID, dropID, oldListID)
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
		const { downloadPlaintextList } = this.props
		downloadPlaintextList()
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
		let className = 'list-group-item'
		if (isActiveList) {
			 className = className + ' active'
		} else if (isOver) {
			className = className + ' list-group-item-info'
		}
		const divStyle = {
			opacity: isDragging ? 0 : 1
		}
		const linkStyle = {
			textDecoration: 'none',
			color: isActiveList ? '#FFFFFF' : '#212529'
		}
		const linkURL = '/new/' + id
		return connectDragSource(connectDropTarget(
			<div className={className} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={onClick} style={divStyle}>
				<Link to={linkURL} style={linkStyle}>
					<div>
						<span>{name}</span>
						<span className='float-right'>
							<DownloadIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleDownloadClick} />
							<DeleteIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleArchiveClick} />
						</span>
					</div>
				</Link>
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
	activeListID: state.activeListID,
	nextListID: getNextList(state, ownProps.id),
	downloadFormID: 'download-form'
})


const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => {
		dispatch(fetchActiveList(ownProps.id, ownProps.activeListID))
	},
	archiveList: (nextListID) => {
		dispatch(archiveList(ownProps.id, nextListID))
		if (ownProps.activeListID == ownProps.id) {
			dispatch(fetchActiveList(nextListID, ownProps.id))
		}
	},
	downloadPlaintextList: () => {
		dispatch(downloadPlaintextList(ownProps.id, ownProps.downloadFormID))
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

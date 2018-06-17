import flow from 'lodash/flow'
import PropTypes from 'prop-types'
import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'

import { getNextList } from '../../../reducers/index'
import { fetchActiveList, archiveList, downloadPlaintextList } from '../../../actions//list'
import { DeleteIcon } from '../Shared/Icons.jsx'
import { DownloadIcon } from './ListLink/DownloadIcon.jsx'
import { ItemTypes } from '../Shared/ItemTypes.jsx'


const nameStyle = {
	display: 'inline-block'
}


const listSource = {
	beginDrag(props) {
		return {
			id: props.id,
			order: props.order
		}
	},

	endDrag(props, monitor) {
		const didDrop = monitor.didDrop()
		if (!didDrop) {
			const item = monitor.getItem()
			const itemType = monitor.getItemType()
			if (itemType == ItemTypes.LIST) {
				const dragID = item.id
				const dropOrder = props.order
				props.setListOrder(dragID, dropOrder)
			}
		}
	}
}


const listTarget = {
	hover(props, monitor, component) {
		const itemType = monitor.getItemType()
		if (itemType == ItemTypes.LIST) {
			const dragID = monitor.getItem().id
			const dropOrder = props.order
			props.showNewOrder(dragID, dropOrder)
		}
	},

	drop(props, monitor, component) {
		const item = monitor.getItem()
		const itemType = monitor.getItemType()
		if (itemType == ItemTypes.LIST_ITEM) {
			const dragID = item.id
			const dragListID = item.listID
			const dropID = props.id
			// Don't make any updates if the item is already in the list
			if (dragListID == dropID) {
				return
			}
			props.setListID(dragID, dropID)
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


const dragCollect = (connect, monitor) => {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}
}


const dropCollect = (connect, monitor) => {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver()
	}
}


class ListLink extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentlyHovering: false
		}
		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
		this.handleDownloadClick = this.handleDownloadClick.bind(this)
		this.handleArchiveClick = this.handleArchiveClick.bind(this)
	}

	handleMouseEnter(event) {
		this.setState({currentlyHovering: true})
	}

	handleMouseLeave(event) {
		this.setState({currentlyHovering: false})
	}

	handleDownloadClick(event) {
		this.props.downloadList(this.props.id, this.props.downloadFormID)
	}

	handleArchiveClick(event) {
		this.props.hideList(this.props.id, {}, this.props.nextListID)
	}

	render() {
		const { connectDragSource, isDragging, isOver, connectDropTarget } = this.props
		let className = 'list-group-item'
		if (this.props.activeList) {
			 className = className + ' active'
		} else if (isOver) {
			className = className + ' list-group-item-info'
		}
		const style = {opacity: isDragging ? 0 : 1}
		return connectDragSource(connectDropTarget(
			<div className={className} style={nameStyle} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.props.onClick} style={style}>
				<span >{this.props.name}</span>
				<DownloadIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleDownloadClick} />
				<DeleteIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleArchiveClick} />
			</div>
		))
	}

}

const mapStateToProps = (state, ownProps) => {
	return {
		name: state.listsByID[ownProps.id].name,
		nextListID: getNextList(state, ownProps.id),
		downloadFormID: 'download-form'
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onClick: (id) => {
			dispatch(fetchActiveList(ownProps.id))
		},
		hideList: (id, data, nextListID) => {
			dispatch(archiveList(id, data, nextListID))
			if (ownProps.activeList) {
				dispatch(fetchActiveList(nextListID))
			}
		},
		downloadList: (id, downloadFormID) => {
			dispatch(downloadPlaintextList(id, downloadFormID))
		}
	}
}


ListLink.propTypes = {
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

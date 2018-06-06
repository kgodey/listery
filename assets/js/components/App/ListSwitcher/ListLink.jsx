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
	}
}


const listTarget = {
	drop(props, monitor, component) {
		const item = monitor.getItem()
		const itemType = monitor.getItemType()
		if (itemType == ItemTypes.LIST) {
			const dragID = item.id
			const dropID = props.id
			const dropOrder = props.order
			// Don't replace items with themselves
			if (dragID == dropID) {
				return
			}
			// Update list order
			props.setListOrder(dragID, dropOrder)
		} else if (itemType == ItemTypes.LIST_ITEM) {
			const dragID = item.id
			const dragListID = item.listID
			const dropID = props.id
			// Don't make any updates if the item is already in the list
			if (dragListID == dropID) {
				return
			}
			props.setListID(dragID, {list_id: dropID})
		}
	}
}


const dragCollect = (connect, monitor) => {
	return {
		connectDragSource: connect.dragSource()
	}
}


const dropCollect = (connect) => {
	return {
		connectDropTarget: connect.dropTarget()
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
		let className = 'list-group-item'
		if (this.props.activeList) {
			 className = className + ' active'
		}
		const { connectDragSource, connectDropTarget } = this.props
		return connectDragSource(connectDropTarget(
			<div className={className} style={nameStyle} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
				<span onClick={this.props.onClick}>{this.props.name}</span>
				<DownloadIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleDownloadClick} />
				<DeleteIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleArchiveClick} />
				<form id={this.props.downloadFormID} method="POST" className="hidden"><span dangerouslySetInnerHTML={{__html: csrfTokenInput}}></span></form>
			</div>
		))
	}

}

const mapStateToProps = (state, ownProps) => {
	return {
		name: state.listsByID[ownProps.id].name,
		nextListID: getNextList(state, ownProps.id),
		downloadFormID: 'download-form-' + ownProps.id
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
	connectDropTarget: PropTypes.func.isRequired
}


ListLink = connect(mapStateToProps, mapDispatchToProps)(ListLink)


export default flow(
	DragSource(ItemTypes.LIST, listSource, dragCollect),
	DropTarget([ItemTypes.LIST, ItemTypes.LIST_ITEM], listTarget, dropCollect)
)(ListLink)

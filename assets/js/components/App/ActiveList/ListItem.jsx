import flow from 'lodash/flow'
import PropTypes from 'prop-types'
import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import onClickOutside from 'react-onclickoutside'
import { connect } from 'react-redux'
import SweetAlert from 'react-bootstrap-sweetalert'

import { deleteListItem, patchListItem } from '../../../actions/list-item'
import { getListItemFetchStatus } from '../../../reducers/index'
import { Checkbox } from './ListItem/Checkbox.jsx'
import { Title } from './ListItem/Title.jsx'
import { Description } from './ListItem/Description.jsx'
import { DeleteIcon } from '../Shared/Icons.jsx'
import { ItemTypes } from '../Shared/ItemTypes.jsx'
import { LoadingIndicator } from '../Shared/LoadingIndicator.jsx'


const listItemSource = {
	beginDrag(props) {
		return {
			id: props.id,
			order: props.order,
			listID: props.listID
		}
	},

	endDrag(props, monitor) {
		const didDrop = monitor.didDrop()
		if (!didDrop) {
			const dragID = monitor.getItem().id
			const dropOrder = props.order
			const listID = props.listID

			props.setListItemOrder(dragID, dropOrder, listID)
		}
	}
}


const listItemTarget = {
	hover(props, monitor, component) {
		const dragID = monitor.getItem().id
		const dropOrder = props.order
		props.showNewOrder(dragID, dropOrder)
	},

	canDrop() {
		return false
	}
}


const dragCollect = (connect, monitor) => {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}
}


const dropCollect = (connect) => {
	return {
		connectDropTarget: connect.dropTarget()
	}
}


class ListItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {
				completed: props.completed,
				title: props.title,
				description: props.description
			},
			currentlyEditing: false,
			currentlyHovering: false,
			showAlert: false
		}
		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
		this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
		this.handleDoubleClick = this.handleDoubleClick.bind(this)
		this.handleClickOutside = this.handleClickOutside.bind(this)
		this.handleTitleChange = this.handleTitleChange.bind(this)
		this.handleTitleKeyUp = this.handleTitleKeyUp.bind(this)
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
		this.handleDescriptionKeyUp = this.handleDescriptionKeyUp.bind(this)
		this.handleDeleteClick = this.handleDeleteClick.bind(this)
		this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this)
		this.handleDeleteCancel = this.handleDeleteCancel.bind(this)
		this.saveListItemTitleAndDescription = this.saveListItemTitleAndDescription.bind(this)
	}

	static getDerivedStateFromProps(props, state) {
		let data = {...state.data}
		if (data.completed != props.completed) {
			data.completed = props.completed
			return {data: data}
		}
		return null
	}

	handleMouseEnter(event) {
		this.setState({currentlyHovering: true})
	}

	handleMouseLeave(event) {
		this.setState({currentlyHovering: false})
	}

	handleCheckboxClick(event) {
		this.props.updateListItem(this.props.id, {completed: event.target.checked})
	}

	handleDoubleClick(event) {
		this.setState({currentlyEditing: true})
	}

	handleClickOutside(event) {
		if (this.state.currentlyEditing === true) {
			this.saveListItemTitleAndDescription()
		}
	}

	handleTitleChange(event) {
		let newState = {...this.state}
		newState['data']['title'] = event.target.value
		this.setState(newState)
	}

	handleTitleKeyUp(event) {
		if (event.key == 'Enter'){
			this.saveListItemTitleAndDescription()
		} else if (event.key == 'Escape') {
			// cancel editing
			this.handleClickOutside()
		}
	}

	handleDescriptionChange(event) {
		let newState = {...this.state}
		newState['data']['description'] = event.target.value
		this.setState(newState)
	}

	handleDescriptionKeyUp(event) {
		if (event.key == 'Enter'){
			this.saveListItemTitleAndDescription()
		} else if (event.key == 'Escape') {
			// cancel editing
			this.handleClickOutside()
		}
	}

	handleDeleteClick(event) {
		this.setState({showAlert: true})
	}

	handleDeleteConfirm(event) {
		this.setState({showAlert: false})
		this.props.removeListItem(this.props.id, this.props.listID)
	}

	handleDeleteCancel(event) {
		this.setState({showAlert: false})
	}

	saveListItemTitleAndDescription() {
		this.props.updateListItem(this.props.id, {
			title: this.state.data.title,
			description: this.state.data.description
		})
		this.setState({currentlyEditing: false})
	}

	render() {
		const { connectDragSource, isDragging, connectDropTarget, isFetching } = this.props
		const style = {opacity: isDragging ? 0 : 1}
		return connectDragSource(connectDropTarget(
			<div className='list-group-item' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onDoubleClick={this.handleDoubleClick} style={style}>
				<div className="row">
					<div className="col">
						<Checkbox checked={this.state.data.completed} onClick={this.handleCheckboxClick} />
						<Title
							currentlyEditing={this.state.currentlyEditing}
							title={this.state.data.title}
							onChange={this.handleTitleChange}
							onKeyUp={this.handleTitleKeyUp}
						/>
						<Description
							currentlyEditing={this.state.currentlyEditing}
							description={this.state.data.description}
							onChange={this.handleDescriptionChange}
							onKeyUp={this.handleDescriptionKeyUp}
						/>
					</div>
					<div className="col-1 float-right">
						<DeleteIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleDeleteClick} />
						<LoadingIndicator
							isFetching={this.props.isFetching}
							type='bars'
							height='10px'
							width='20px'
						/>
					</div>
				</div>
				<SweetAlert
					warning
					showCancel
					show={this.state.showAlert}
					confirmBtnText='Yes, delete it!'
					cancelBtnText='Cancel'
					confirmBtnBsStyle='danger'
					cancelBtnBsStyle='default'
					onConfirm={this.handleDeleteConfirm}
					onCancel={this.handleDeleteCancel}
				>
					Are you sure you want to permanently delete <em>{this.state.data.title}</em>?
				</SweetAlert>
			</div>
		))
	}
}

const mapStateToProps = (state, ownProps) => {
	const itemData = state.activeListItems[ownProps.id]
	return {
		completed: itemData.completed,
		title: itemData.title,
		description: itemData.description,
		isFetching: getListItemFetchStatus(state, ownProps.id)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateListItem: (id, data) => {
			dispatch(patchListItem(id, data))
		},
		removeListItem: (id, listID) => {
			dispatch(deleteListItem(id, listID))
		}
	}
}

ListItem.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	connectDropTarget: PropTypes.func.isRequired
}

ListItem = onClickOutside(ListItem)
ListItem = connect(mapStateToProps, mapDispatchToProps)(ListItem)

export default flow(
	DragSource(ItemTypes.LIST_ITEM, listItemSource, dragCollect),
	DropTarget(ItemTypes.LIST_ITEM, listItemTarget, dropCollect)
)(ListItem)

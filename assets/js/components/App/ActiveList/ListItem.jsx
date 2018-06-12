import flow from 'lodash/flow'
import PropTypes from 'prop-types'
import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'

import { deleteListItem, patchListItem } from '../../../actions/list-item'
import { Checkbox } from './ListItem/Checkbox.jsx'
import { Title } from './ListItem/Title.jsx'
import { Description } from './ListItem/Description.jsx'
import { DeleteIcon } from '../Shared/Icons.jsx'
import { ItemTypes } from '../Shared/ItemTypes.jsx'


const listItemSource = {
	beginDrag(props) {
		return {
			id: props.id,
			order: props.order,
			listID: props.listID
		}
	}
}


const listItemTarget = {
	hover(props, monitor, component) {
		const dragID = monitor.getItem().id
		const dropOrder = props.order
		props.showNewOrder(dragID, dropOrder)
	},

	drop(props, monitor, component) {
		const dragID = monitor.getItem().id
		const dropOrder = props.order
		const listID = props.listID

		props.setListItemOrder(dragID, dropOrder, listID)
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
			currentlyHovering: false
		}
		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
		this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
		this.handleDoubleClick = this.handleDoubleClick.bind(this)
		this.handleTitleChange = this.handleTitleChange.bind(this)
		this.handleTitleKeyUp = this.handleTitleKeyUp.bind(this)
		this.handleTitleBlur = this.handleTitleBlur.bind(this)
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
		this.handleDescriptionKeyUp = this.handleDescriptionKeyUp.bind(this)
		this.handleDescriptionBlur = this.handleDescriptionBlur.bind(this)
		this.handleDeleteClick = this.handleDeleteClick.bind(this)
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

	handleTitleChange(event) {
		let newState = {...this.state}
		newState['data']['title'] = event.target.value
		this.setState(newState)
	}

	handleTitleKeyUp(event) {
		if (event.key == 'Enter'){
			this.saveListItemTitleAndDescription()
		}
	}

	handleTitleBlur(event) {
		this.saveListItemTitleAndDescription()
	}

	handleDescriptionChange(event) {
		let newState = {...this.state}
		newState['data']['description'] = event.target.value
		this.setState(newState)
	}

	handleDescriptionKeyUp(event) {
		if (event.key == 'Enter'){
			this.saveListItemTitleAndDescription()
		}
	}

	handleDescriptionBlur(event) {
		this.saveListItemTitleAndDescription()
	}

	handleDeleteClick(event) {
		this.props.removeListItem(this.props.id, this.props.list_id)
	}

	saveListItemTitleAndDescription() {
		this.props.updateListItem(this.props.id, {
			title: this.state.data.title,
			description: this.state.data.description
		})
		this.setState({currentlyEditing: false})
	}

	render() {
		const { connectDragSource, isDragging, connectDropTarget } = this.props
		const style = {opacity: isDragging ? 0 : 1}
		return connectDragSource(connectDropTarget(
			<div className='list-group-item' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} style={style}>
				<Checkbox checked={this.state.data.completed} onClick={this.handleCheckboxClick} />
				<Title
					currentlyEditing={this.state.currentlyEditing}
					title={this.state.data.title}
					onChange={this.handleTitleChange}
					onKeyUp={this.handleTitleKeyUp}
					onBlur={this.handleTitleBlur}
					onDoubleClick={this.handleDoubleClick}
				/>
				<Description
					currentlyEditing={this.state.currentlyEditing}
					description={this.state.data.description}
					onChange={this.handleDescriptionChange}
					onKeyUp={this.handleDescriptionKeyUp}
					onBlur={this.handleDescriptionBlur}
					onDoubleClick={this.handleDoubleClick}
				/>
				<DeleteIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleDeleteClick} />
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

ListItem = connect(mapStateToProps, mapDispatchToProps)(ListItem)

export default flow(
	DragSource(ItemTypes.LIST_ITEM, listItemSource, dragCollect),
	DropTarget(ItemTypes.LIST_ITEM, listItemTarget, dropCollect)
)(ListItem)

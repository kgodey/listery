import flow from 'lodash/flow'
import PropTypes from 'prop-types'
import React from 'react'
import SweetAlert from 'react-bootstrap-sweetalert'
import DragSource from 'react-dnd/lib/DragSource'
import DropTarget from 'react-dnd/lib/DropTarget'
import { findDOMNode } from 'react-dom'
import onClickOutside from 'react-onclickoutside'
import { connect } from 'react-redux'

import { deleteListItem, updateListItem } from '../../../actions/list-item'
import { getActiveListFetchStatus } from '../../../reducers/activeList'
import { getListItem, getListItemFetchStatus } from '../../../reducers/activeListItems'
import { ItemTypes } from '../../../utils/itemTypes'
import { DeleteIcon } from '../Shared/Icons.jsx'
import { LoadingIndicator } from '../Shared/LoadingIndicator.jsx'
import { Checkbox } from './ListItem/Checkbox.jsx'
import { Title } from './ListItem/Title.jsx'
import { Description } from './ListItem/Description.jsx'



const listItemSource = {
	beginDrag(props) {
		let { id, order, list_id, initialOrder } = props
		return { id, order, list_id, initialOrder }
	},

	endDrag({ order, list_id, setNewOrder } , monitor) {
		const didDrop = monitor.didDrop()
		if (!didDrop) {
			const dragItem = monitor.getItem()
			setNewOrder(dragItem.id, order, list_id, dragItem.initialOrder)
		}
	}
}


const listItemTarget = {
	hover({ order, previewNewOrder }, monitor, component) {
		const dragID = monitor.getItem().id
		const dropOrder = order
		previewNewOrder(dragID, dropOrder)
	},

	canDrop() {
		return false
	}
}


const dragCollect = (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
})


const dropCollect = (connect) => ({
	connectDropTarget: connect.dropTarget()
})


class ListItem extends React.Component {
	constructor(props) {
		super(props)
		const { completed, title, description } = props
		this.state = {
			data: {
				completed: completed,
				title: title,
				description: description
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

	static getDerivedStateFromProps({ completed }, state) {
		let data = {...state.data}
		if (data.completed != completed) {
			data.completed = completed
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
		const { updateListItem, id, originalData } = this.props
		updateListItem(id, {completed: event.target.checked}, originalData)
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
		const { deleteListItem, id, list_id } = this.props
		this.setState({showAlert: false})
		deleteListItem(id, list_id)
	}

	handleDeleteCancel(event) {
		this.setState({showAlert: false})
	}

	saveListItemTitleAndDescription() {
		const { updateListItem, id, originalData } = this.props
		updateListItem(id, {
			title: this.state.data.title,
			description: this.state.data.description
		}, originalData)
		this.setState({currentlyEditing: false})
	}

	render() {
		const { isFetchingList } = this.props
		if (!isFetchingList) {
			const { connectDragSource, isDragging, connectDropTarget, isFetching } = this.props
			const style = {opacity: isDragging ? 0 : 1}
			return connectDragSource(connectDropTarget(
				<div className='list-group-item' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onDoubleClick={this.handleDoubleClick} style={style}>
					<div className="row">
						<div className="col-10 d-inline-block">
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
						<div className="col-2 d-inline-block text-right">
							<LoadingIndicator
								isFetching={isFetching}
								type='bars'
								height='20px'
								width='20px'
								className='d-inline-block mr-1 align-middle'
							/>
							<DeleteIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleDeleteClick} />
						</div>
					</div>
					<SweetAlert
						warning
						showCancel
						title='Confirm Deletion'
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
		return (null)
	}
}


const mapStateToProps = (state, ownProps) => ({
	originalData: getListItem(state, ownProps.id),
	isFetchingList: getActiveListFetchStatus(state),
	isFetching: getListItemFetchStatus(state, ownProps.id)
})


ListItem.propTypes = {
	id: PropTypes.number.isRequired,
	completed: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	originalData: PropTypes.object.isRequired,
	isFetchingList: PropTypes.bool,
	isFetching: PropTypes.bool,
	updateListItem: PropTypes.func.isRequired,
	deleteListItem: PropTypes.func.isRequired,
	connectDragSource: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	connectDropTarget: PropTypes.func.isRequired
}


ListItem = onClickOutside(ListItem)
ListItem = connect(
	mapStateToProps,
	{ updateListItem, deleteListItem }
)(ListItem)
export default flow(
	DragSource(ItemTypes.LIST_ITEM, listItemSource, dragCollect),
	DropTarget(ItemTypes.LIST_ITEM, listItemTarget, dropCollect)
)(ListItem)

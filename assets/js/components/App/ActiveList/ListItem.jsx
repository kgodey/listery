import flow from 'lodash/flow'
import PropTypes from 'prop-types'
import React from 'react'
import SweetAlert from 'react-bootstrap-sweetalert'
import DragSource from 'react-dnd/lib/DragSource'
import DropTarget from 'react-dnd/lib/DropTarget'
import { findDOMNode } from 'react-dom'
import onClickOutside from 'react-onclickoutside'
import { connect } from 'react-redux'
import ReactTags from 'react-tag-autocomplete'

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

	endDrag({ order, setNewOrder } , monitor) {
		const didDrop = monitor.didDrop()
		if (!didDrop) {
			const dragItem = monitor.getItem()
			setNewOrder(dragItem.id, order, dragItem.initialOrder)
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
		const { completed, title, description, id, tags, showTags } = props
		this.state = {
			data: {
				completed: completed,
				title: title,
				description: description,
				tags: tags.map(function(name, index) {
					return {
						id: index+1,
						name: name
					}
				})
			},
			showTags: showTags,
			currentlyEditing: false,
			currentlyHovering: false,
			currentlyOverInput: false,
			disabled: id < 0 ? true : false,
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
		this.saveTags = this.saveTags.bind(this)
		this.handleInputMouseEnter = this.handleInputMouseEnter.bind(this)
		this.handleInputMouseLeave = this.handleInputMouseLeave.bind(this)
		this.handleTagAddition = this.handleTagAddition.bind(this)
		this.handleTagDeletion = this.handleTagDeletion.bind(this)
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
		if (this.state.disabled) return
		const { updateListItem, id } = this.props
		updateListItem(
			id,
			{completed: event.target.checked},
			{completed: !event.target.checked}
		)
	}

	handleDoubleClick(event) {
		if (this.state.disabled) return
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
		if (this.state.disabled) return
		this.setState({showAlert: true})
	}

	handleDeleteConfirm(event) {
		const { deleteListItem, id } = this.props
		this.setState({showAlert: false})
		deleteListItem(id)
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

	saveTags(tags) {
		const { updateListItem, id, originalData } = this.props
		const tagNames = Array.from(tags, tag => tag.name)
		updateListItem(id, {
			tags: tagNames
		}, originalData)
	}

	handleInputMouseEnter() {
		this.setState({currentlyOverInput: true})
	}

	handleInputMouseLeave() {
		this.setState({currentlyOverInput: false})
	}

	handleTagAddition(tag) {
		let newState = {...this.state}
		let currentTags = this.state.data.tags
		tag['id'] = currentTags.length + 1
		const newTags = [...currentTags, tag]
		newState['data']['tags'] = newTags
		this.setState(newState)
		this.saveTags(newTags)
	}

	handleTagDeletion(index) {
		let newState = {...this.state}
		const tags = this.state.data.tags.slice(0)
		tags.splice(index, 1)
		newState['data']['tags'] = tags
		this.setState(newState)
		this.saveTags(tags)
	}

	render() {
		const { isFetchingList } = this.props
		if (!isFetchingList) {
			let tagsElement
			const { connectDragSource, isDragging, connectDropTarget, isFetching, showTags } = this.props
			const style = {opacity: isDragging ? 0 : 1}
			const className = this.state.disabled ? 'list-group-item disabled' : 'list-group-item'
			if (showTags) {
				tagsElement = <div className="row">
						<ReactTags
							tags={this.state.data.tags}
							placeholder={'Add a new tag'}
							autoresize={false}
							allowNew={true}
							handleAddition={this.handleTagAddition}
							handleDelete={this.handleTagDeletion}
						/>
					</div>
			}
			let element = (
				<div className={className} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onDoubleClick={this.handleDoubleClick} style={style}>
					<div className="row">
						<div className="col-10 d-inline-block">
							<Checkbox checked={this.state.data.completed} onClick={this.handleCheckboxClick} />
							<Title
								currentlyEditing={this.state.currentlyEditing}
								title={this.state.data.title}
								onChange={this.handleTitleChange}
								onKeyUp={this.handleTitleKeyUp}
								onInputMouseEnter={this.handleInputMouseEnter}
								onInputMouseLeave={this.handleInputMouseLeave}
							/>
							<Description
								currentlyEditing={this.state.currentlyEditing}
								description={this.state.data.description}
								onChange={this.handleDescriptionChange}
								onKeyUp={this.handleDescriptionKeyUp}
								onInputMouseEnter={this.handleInputMouseEnter}
								onInputMouseLeave={this.handleInputMouseLeave}
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
					{tagsElement}
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
			)
			const { currentlyOverInput } = this.state
			if (currentlyOverInput) {
				return element
			} else {
				return connectDragSource(connectDropTarget(element))
			}
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
	showTags: PropTypes.bool,
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

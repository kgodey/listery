import React from 'react'
import { connect } from 'react-redux'

import { deleteListItem, patchListItem } from '../../../actions/list-item'
import { Checkbox } from './ListItem/Checkbox.jsx'
import { Title } from './ListItem/Title.jsx'
import { Description } from './ListItem/Description.jsx'
import { DeleteIcon } from './ListItem/Icons.jsx'


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
		this.props.removeListItem(this.props.id)
	}

	saveListItemTitleAndDescription() {
		this.props.updateListItem(this.props.id, {
			title: this.state.data.title,
			description: this.state.data.description
		})
		this.setState({currentlyEditing: false})
	}

	render() {
		return (
			<div className='list-group-item' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
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
		)
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
		removeListItem: (id) => {
			dispatch(deleteListItem(id))
		}
	}
}

ListItem = connect(mapStateToProps, mapDispatchToProps)(ListItem)

export default ListItem

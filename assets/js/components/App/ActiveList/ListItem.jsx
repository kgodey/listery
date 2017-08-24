import React from 'react'

import { toggleListItemCompletion, saveListItemTitle, removeListItem } from '../../../actions/ui.js'
import { Checkbox } from './ListItem/Checkbox.jsx'
import { Title } from './ListItem/Title.jsx'
import { Description } from './ListItem/Description.jsx'
import { DeleteIcon } from './ListItem/Icons.jsx'


export class ListItem extends React.Component {
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
		this.handleDeleteClick = this.handleDeleteClick.bind(this)
		this.saveListItemTitle = this.saveListItemTitle.bind(this)
	}

	handleMouseEnter(event) {
		this.setState({currentlyHovering: true})
	}

	handleMouseLeave(event) {
		this.setState({currentlyHovering: false})
	}

	handleCheckboxClick(event) {
		toggleListItemCompletion(this.props.id, event.target.checked)
	}

	handleDoubleClick(event) {
		this.setState({currentlyEditing: true})
	}

	handleTitleChange(event) {
		this.setState({
			data: {
				title: event.target.value
			}
		})
	}

	handleTitleKeyUp(event) {
		if (event.key == 'Enter'){
			this.saveListItemTitle()
		}
	}

	handleTitleBlur(event) {
		this.saveListItemTitle()
	}

	handleDeleteClick(event) {
		removeListItem(this.props.id)
	}

	saveListItemTitle() {
		saveListItemTitle(this.props.id, this.state.data.title)
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
				<Description description={this.state.data.description} />
				<DeleteIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleDeleteClick} />
			</div>
		)
	}
}

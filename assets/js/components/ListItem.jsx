import React from 'react'
import { toggleCompleted, saveTitle } from '../actions/ui.js'


const titleStyle = {
	width: '90%',
	display: 'inline-block'
}

const titleEditStyle = {
	width: '80%'
}

const descriptionStyle = {
	marginTop: 0,
	paddingTop: 0
}

const checkboxStyle = {
	display: 'inline-block',
	textAlign: 'center',
	width: '35px'
}


export class ListItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {
				completed: props.completed,
				title: props.title,
				description: props.description
			},
			currentlyEditing: false
		}
		this.handleClick = this.handleClick.bind(this)
		this.handleDoubleClick = this.handleDoubleClick.bind(this)
		this.handleTitleChange = this.handleTitleChange.bind(this)
		this.handleTitleKeyUp = this.handleTitleKeyUp.bind(this)
	}

	handleClick(event) {
		toggleCompleted(this.props.id, event.target.checked)
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
			saveTitle(this.props.id, this.state.data.title)
			this.setState({currentlyEditing: false})
		}
	}

	handleDoubleClick(event) {
		this.setState({currentlyEditing: true})
	}

	render() {
		if (this.state.currentlyEditing) {
			return (
				<div className='list-group-item'>
					<span style={checkboxStyle} className='pull-left'>
						<input type='checkbox' defaultChecked={this.state.data.completed} onClick={this.handleClick} />
					</span>
					<input
						type='text'
						maxLength='255'
						placeholder='Title'
						style={titleEditStyle}
						value={this.state.data.title}
						onChange={this.handleTitleChange}
						onKeyUp={this.handleTitleKeyUp}
					/>
				</div>
			)
		} else {
			return (
				<div className='list-group-item'>
					<span style={checkboxStyle} className='pull-left'>
						<input type='checkbox' defaultChecked={this.state.data.completed} onClick={this.handleClick} />
					</span>
					<div style={titleStyle} onDoubleClick={this.handleDoubleClick}>{this.props.title}</div>
					<small><i><span style={descriptionStyle}>{this.props.description}</span></i></small>
				</div>
			)
		}
	}
}

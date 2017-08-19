import React from 'react'
import { toggleCompleted } from '../actions/ui.js'


const titleStyle = {
	width: '90%',
	display: 'inline-block'
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
			completed: props.completed
		}
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(event) {
		toggleCompleted(this.props.id, !this.state.completed)
	}

	render() {
		return (
			<div className='list-group-item'>
				<span style={checkboxStyle} className='pull-left'>
					<input type='checkbox' defaultChecked={this.state.completed} onClick={this.handleClick} />
				</span>
				<div style={titleStyle}>{this.props.title}</div>
				<small><i><span style={descriptionStyle}>{this.props.description}</span></i></small>
			</div>
		)
	}
}

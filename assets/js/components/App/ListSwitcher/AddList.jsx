import React from 'react'
import { addNewList } from '../../../actions/ui.js'


const inputStyle = {
	width: '100%'
}


export class AddList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {value: ''}
		this.handleChange = this.handleChange.bind(this)
		this.handleKeyUp = this.handleKeyUp.bind(this)
	}

	handleChange(event) {
		this.setState({value: event.target.value})
	}

	handleKeyUp(event) {
		if (event.key == 'Enter'){
			addNewList(this.state.value)
			this.setState({value: ''})
		}
	}

	render() {
		return (
			<div className='list-group-item'>
				<input
					type='text'
					placeholder='Add new list'
					maxLength='255'
					value={this.state.value}
					style={inputStyle}
					onChange={this.handleChange}
					onKeyUp={this.handleKeyUp}
				/>
			</div>
		)
	}
}

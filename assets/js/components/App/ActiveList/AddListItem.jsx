import React from 'react'
import { addNewListItem } from '../../../actions/ui.js'


const inputStyle = {
	width: '100%'
}


export class AddListItem extends React.Component {
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
			addNewListItem(this.state.value, this.props.listID)
			this.setState({value: ''})
		}
	}

	render() {
		return (
			<div className='list-group-item'>
				<input
					type='text'
					value={this.state.value}
					style={inputStyle}
					placeholder='Add new item'
					maxLength='255'
					onChange={this.handleChange}
					onKeyUp={this.handleKeyUp}
				/>
			</div>
		)
	}
}

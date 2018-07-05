import React from 'react'
import { connect } from 'react-redux'

import { createNewList } from '../../../actions/list.js'


const inputStyle = {
	width: '100%'
}


class AddList extends React.Component {
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
		const { createNewList } = this.props
		if (event.key == 'Enter'){
			createNewList(this.state.value)
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

const mapDispatchToProps = (dispatch) => {
	return {
		createNewList: (value) => {
			dispatch(createNewList(value))
		}
	}
}

AddList = connect(null, mapDispatchToProps)(AddList)
export default AddList

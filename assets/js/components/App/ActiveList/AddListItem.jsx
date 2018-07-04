import React from 'react'
import { connect } from 'react-redux'

import { createListItem } from '../../../actions/list-item.js'


const inputStyle = {
	width: '100%'
}


class AddListItem extends React.Component {
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
		const { addListItem, activeListID } = this.props
		if (event.key == 'Enter'){
			addListItem(this.state.value, activeListID)
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


const mapStateToProps = (state) => {
	return {
		activeListID: state.activeListID,
	}
}


const mapDispatchToProps = (dispatch) => {
	return {
		addListItem: (value, listID) => {
			dispatch(createListItem(value, listID))
		}
	}
}

AddListItem = connect(mapStateToProps, mapDispatchToProps)(AddListItem)
export default AddListItem

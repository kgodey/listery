import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { createList } from '../../../actions/list.js'


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
		const { createList } = this.props
		if (event.key == 'Enter'){
			createList(this.state.value)
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

const mapDispatchToProps = (dispatch) => ({
	createList: (value) => {
		dispatch(createList(value))
	}
})


AddList.propTypes = {
	createList: PropTypes.func.isRequired
}


AddList = connect(null, mapDispatchToProps)(AddList)
export default AddList

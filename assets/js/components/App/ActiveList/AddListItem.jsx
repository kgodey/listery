import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { createListItem } from '../../../actions/list-item.js'
import { getActiveListFetchStatus } from '../../../reducers/index'


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
		const { createListItem, activeListID } = this.props
		if (event.key == 'Enter'){
			createListItem(this.state.value, activeListID)
			this.setState({value: ''})
		}
	}

	render() {
		const { isFetching} = this.props
		if (!isFetching) {
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
		return (null)
	}
}


const mapStateToProps = (state) => ({
	activeListID: state.activeListID,
	isFetching: getActiveListFetchStatus(state)
})


const mapDispatchToProps = (dispatch) => ({
	createListItem: (value, listID) => {
		dispatch(createListItem(value, listID))
	}
})


AddListItem.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	createListItem: PropTypes.func.isRequired,
	activeListID: PropTypes.number.isRequired
}


AddListItem = connect(mapStateToProps, mapDispatchToProps)(AddListItem)
export default AddListItem

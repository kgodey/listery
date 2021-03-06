import PropTypes from 'prop-types'
import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { connect } from 'react-redux'

import { createListItem } from '../../../actions/list-item'
import { getActiveListID, getActiveListFetchStatus } from '../../../reducers/activeList'


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
				<ListGroup.Item>
					<input
						type='text'
						value={this.state.value}
						style={inputStyle}
						placeholder='Add new item'
						maxLength='255'
						onChange={this.handleChange}
						onKeyUp={this.handleKeyUp}
					/>
				</ListGroup.Item>
			)
		}
		return (null)
	}
}


const mapStateToProps = (state) => ({
	activeListID: getActiveListID(state),
	isFetching: getActiveListFetchStatus(state)
})


AddListItem.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	createListItem: PropTypes.func.isRequired,
	activeListID: PropTypes.number
}


AddListItem = connect(
	mapStateToProps,
	{ createListItem }
)(AddListItem)
export default AddListItem

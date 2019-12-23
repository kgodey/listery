import { ListItem, SwipeoutActions, SwipeoutButton } from 'framework7-react'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { deleteListItem } from '../../../actions/list-item'


class ActiveListItem extends React.Component {
	constructor(props) {
		super(props)
		this.handleDelete = this.handleDelete.bind(this)
	}

	handleDelete(event) {
		const { deleteListItem, id } = this.props
		deleteListItem(id)
	}

	render() {
		const { title, description } = this.props
		return (
			<ListItem
				swipeout
				title={title}
				text={description}
			>
				<SwipeoutActions right>
					<SwipeoutButton
						color="red"
						onClick={this.handleDelete}
						confirmText="Are you sure you want to delete '{title}'?"
						confirmTitle="Confirm Deletion"
				>
						Delete
					</SwipeoutButton>
				</SwipeoutActions>
			</ListItem>
		)
	}
}


const mapStateToProps = (state, ownProps) => ({})


ActiveListItem.propTypes = {
	id: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	deleteListItem: PropTypes.func.isRequired
}

ActiveListItem = connect(mapStateToProps, { deleteListItem })(ActiveListItem)
export default ActiveListItem

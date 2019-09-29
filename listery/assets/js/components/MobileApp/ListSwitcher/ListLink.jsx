import { ListItem, SwipeoutActions, SwipeoutButton } from 'framework7-react'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { fetchActiveList, archiveList } from '../../../actions/list'
import { getNextList } from '../../../reducers/allLists'
import { getActiveListID } from '../../../reducers/activeList'


class ListLink extends React.Component {
	constructor(props) {
		super(props)
		this.handleArchived = this.handleArchived.bind(this)
	}

	handleArchived(event) {
		const { archiveList, nextListID } = this.props
		archiveList(nextListID)
	}

	render() {
		const { id, name, onClick, activeListID } = this.props
		return (
			<ListItem
				swipeout
				onSwipeoutDeleted={this.handleArchived}
				title={name}
				bgColor={activeListID == id ? 'primary' : 'black'}
				onClick={onClick}
			>
				<SwipeoutActions right>
					<SwipeoutButton
						delete
						confirmText="Are you sure you want to archive this list?"
						confirmTitle="Confirm Archival"
				>
						Archive
					</SwipeoutButton>
				</SwipeoutActions>
			</ListItem>
		)
	}
}


const mapStateToProps = (state, ownProps) => ({
	activeListID: getActiveListID(state),
	nextListID: getNextList(state, ownProps.id)
})


const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => {
		dispatch(fetchActiveList({id: ownProps.id}))
	},
	archiveList: (nextListID) => {
		dispatch(archiveList(ownProps.id, nextListID))
	}
})


ListLink.propTypes = {
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	activeListID: PropTypes.number,
	nextListID: PropTypes.number,
	onClick: PropTypes.func.isRequired,
	archiveList: PropTypes.func.isRequired
}

ListLink = connect(mapStateToProps, mapDispatchToProps)(ListLink)
export default ListLink

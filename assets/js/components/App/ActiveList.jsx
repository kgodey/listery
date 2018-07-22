import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { fetchActiveList } from '../../actions/list'
import { reorderListItem, previewListItemOrder } from '../../actions/list-item'
import { getSortedListItems } from '../../reducers/activeListItems'
import { getActiveListErrorStatus, getActiveListFetchStatus } from '../../reducers/activeList'
import ListHeader from './ActiveList/ListHeader.jsx'
import AddListItem from './ActiveList/AddListItem.jsx'
import ListItem from './ActiveList/ListItem.jsx'
import { ErrorPanel } from './Shared/ErrorPanel.jsx'
import { LoadingIndicator } from './Shared/LoadingIndicator.jsx'


class ActiveList extends React.Component {
	constructor(props) {
		super(props)
		this.setNewOrder = this.setNewOrder.bind(this)
		this.previewNewOrder = this.previewNewOrder.bind(this)
	}

	componentDidMount() {
		// Load initial data from backend once components mounts.
		const { fetchActiveList, match } = this.props
		let activeListID
		if (match.params.id !== undefined) {
			activeListID = match.params.id
		}
		fetchActiveList(activeListID)
	}

	render() {
		const { activeListError, isFetching, sortedListItems } = this.props
		if (activeListError.isError) {
			return (
				<ErrorPanel show={activeListError.isError}>
					This list could not be retrieved. Error message: <em>{activeListError.errorMessage}</em>
				</ErrorPanel>
			)
		} else if (isFetching) {
			return (
				<LoadingIndicator
					isFetching={true}
					type='bars'
					height='10%'
					width='10%'
					className='mx-auto d-block pt-5'
				/>
			)
		} else {
			return (
				<div>
					<ListHeader />
					<div className='list-group list-group-flush'>
						<AddListItem />
						{sortedListItems.map(item =>
							<ListItem
								key={item.id}
								{...item}
								setNewOrder={this.setNewOrder}
								previewNewOrder={this.previewNewOrder}
							/>
						)}
					</div>
				</div>
			)
		}
	}

	setNewOrder(id, order, listID) {
		const { reorderListItem } = this.props
		reorderListItem(id, order, listID)
	}

	previewNewOrder(dragID, dropOrder) {
		const { previewListItemOrder } = this.props
		previewListItemOrder(dragID, dropOrder)
	}
}


const mapStateToProps = (state) => ({
	sortedListItems: getSortedListItems(state),
	isFetching: getActiveListFetchStatus(state),
	activeListError: getActiveListErrorStatus(state)
})


ActiveList.propTypes = {
	sortedListItems: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	fetchActiveList: PropTypes.func.isRequired,
	activeListError: PropTypes.object.isRequired,
	reorderListItem: PropTypes.func.isRequired,
	previewListItemOrder: PropTypes.func.isRequired
}


ActiveList = withRouter(connect(
	mapStateToProps,
	{ fetchActiveList, reorderListItem, previewListItemOrder }
)(ActiveList))
export default ActiveList

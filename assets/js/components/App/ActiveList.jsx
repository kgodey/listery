import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { fetchActiveList } from '../../actions/list'
import { reorderListItem, previewListItemOrder } from '../../actions/list-item'
import { getSortedListItems } from '../../reducers/activeListItems'
import { getActiveListID, getActiveListErrorStatus, getActiveListFetchStatus } from '../../reducers/activeList'
import ListHeader from './ActiveList/ListHeader.jsx'
import AddListItem from './ActiveList/AddListItem.jsx'
import ListItem from './ActiveList/ListItem.jsx'
import { NoListPanel } from './ActiveList/NoListPanel.jsx'
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
		let urlListID
		if (match.params.id !== undefined) {
			urlListID = match.params.id
		}
		fetchActiveList(urlListID)
	}

	render() {
		const { activeListID, activeListError, isFetching, sortedListItems } = this.props
		if (activeListID === null) {
			if (activeListError.isError) {
				return (
					<ErrorPanel show={activeListError.isError}>
						This list could not be retrieved. Error message: <em>{activeListError.errorMessage}</em>
					</ErrorPanel>
				)
			}
			return (
				<NoListPanel />
			)
		}
		if (isFetching) {
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
	activeListID: getActiveListID(state),
	sortedListItems: getSortedListItems(state),
	isFetching: getActiveListFetchStatus(state),
	activeListError: getActiveListErrorStatus(state)
})


ActiveList.propTypes = {
	activeListID: PropTypes.number,
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

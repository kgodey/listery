import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { reorderListItem, previewListItemOrder } from '../../actions/list-item'
import { getSortedListItems } from '../../reducers/activeListItems'
import { getActiveListFetchStatus } from '../../reducers/fetchingActiveList'
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

	render() {
		const { error, isFetching, sortedListItems } = this.props
		if (error.isError) {
			return (
				<ErrorPanel show={error.isError}>
					This list could not be retrieved. Error message: <em>{error.errorMessage}</em>
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
	isFetching: getActiveListFetchStatus(state)
})


ActiveList.propTypes = {
	error: PropTypes.object.isRequired,
	sortedListItems: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	reorderListItem: PropTypes.func.isRequired,
	previewListItemOrder: PropTypes.func.isRequired
}


ActiveList = connect(
	mapStateToProps,
	{ reorderListItem, previewListItemOrder }
)(ActiveList)
export default ActiveList

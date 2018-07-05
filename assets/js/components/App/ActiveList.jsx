import React from 'react'
import { connect } from 'react-redux'

import { reorderListItem, previewListItemOrder } from '../../actions/list-item'
import { getSortedListItems, getActiveListFetchStatus } from '../../reducers/index'
import ListHeader from './ActiveList/ListHeader.jsx'
import AddListItem from './ActiveList/AddListItem.jsx'
import ListItem from './ActiveList/ListItem.jsx'
import { ErrorPanel } from './Shared/ErrorPanel.jsx'
import { LoadingIndicator } from './Shared/LoadingIndicator.jsx'


const loadingStyle = {
	paddingTop: '10%'
}


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
				<ErrorPanel>
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
					className='mx-auto d-block'
					style={loadingStyle}
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

const mapStateToProps = (state) => {
	return {
		sortedListItems: getSortedListItems(state),
		isFetching: getActiveListFetchStatus(state)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		reorderListItem: (id, order, listID) => {
			dispatch(reorderListItem(id, order, listID))
		},
		previewListItemOrder: (dragID, dropOrder) => {
			dispatch(previewListItemOrder(dragID, dropOrder))
		}
	}
}

ActiveList = connect(mapStateToProps, mapDispatchToProps)(ActiveList)
export default ActiveList

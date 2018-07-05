import React from 'react'
import { connect } from 'react-redux'

import { updateListItemOrder, changeUIListOrder } from '../../actions/list-item'
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
		this.setListItemOrder = this.setListItemOrder.bind(this)
		this.showNewOrder = this.showNewOrder.bind(this)
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
								setListItemOrder={this.setListItemOrder}
								showNewOrder={this.showNewOrder}
							/>
						)}
					</div>
				</div>
			)
		}
	}

	setListItemOrder(id, order, listID) {
		const { reorderListItem } = this.props
		reorderListItem(id, order, listID)
	}

	showNewOrder(dragID, dropOrder) {
		const { previewListReorder } = this.props
		previewListReorder(dragID, dropOrder)
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
			dispatch(updateListItemOrder(id, order, listID))
		},
		previewListReorder: (dragID, dropOrder) => {
			dispatch(changeUIListOrder(dragID, dropOrder))
		}
	}
}

ActiveList = connect(mapStateToProps, mapDispatchToProps)(ActiveList)
export default ActiveList

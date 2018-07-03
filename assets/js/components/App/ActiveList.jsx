import React from 'react'
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle'
import { connect } from 'react-redux'

import { updateListItemOrder, changeUIListOrder } from '../../actions/list-item'
import { getSortedListItems, getActiveListFetchStatus } from '../../reducers/index'
import { LoadingIndicator } from './Shared/LoadingIndicator.jsx'
import ListHeader from './ActiveList/ListHeader.jsx'
import AddListItem from './ActiveList/AddListItem.jsx'
import ListItem from './ActiveList/ListItem.jsx'


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
		let divContents
		const { error, isFetching, sortedListItems } = this.props
		if (error.isError) {
			divContents = (
				<div className="card border-danger">
					<div className="card-header bg-danger text-white">
						<FaExclamationTriangle style={{marginRight: '0.5em'}} className="align-middle" />
						<span className="align-middle">Error!</span>
					</div>
					<div className="card-body">
						This list could not be retrieved. Error message: <em>{error.errorMessage}</em>
					</div>
				</div>
			)
		} else if (isFetching) {
			divContents = (
				<LoadingIndicator
					isFetching={isFetching}
					type='bars'
					height='10%'
					width='10%'
					className='mx-auto d-block'
					style={loadingStyle}
				/>
			)
		} else {
			divContents = (
				<div>
					<ListHeader />
					<div className='list-group list-group-flush'>
						<AddListItem />
						{sortedListItems.map(item =>
							<ListItem
								key={item.id}
								id={item.id}
								order={item.order}
								listID={item.list_id}
								setListItemOrder={this.setListItemOrder}
								showNewOrder={this.showNewOrder}
							/>
						)}
					</div>
				</div>
			)
		}
		return (
			<div className="col-sm-8 mt-3">
				{divContents}
			</div>
		)
	}

	setListItemOrder(id, order, listID) {
		this.props.reorderListItem(id, order, listID)
	}

	showNewOrder(dragID, dropOrder) {
		this.props.previewListReorder(dragID, dropOrder)
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

import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { fetchAllLists, reorderList, previewListOrder } from '../../actions/list'
import { moveListItem } from '../../actions/list-item'
import { getActiveListID } from '../../reducers/activeList'
import { getSortedLists, getAllListsFetchStatus, getallListsErrorStatus } from '../../reducers/allLists'
import ListLink from './ListSwitcher/ListLink.jsx'
import AddList from './ListSwitcher/AddList.jsx'
import { ErrorPanel } from './Shared/ErrorPanel.jsx'
import { LoadingIndicator } from './Shared/LoadingIndicator.jsx'


class ListSwitcher extends React.Component {
	constructor(props) {
		super(props)
		this.setNewOrder = this.setNewOrder.bind(this)
		this.setListID = this.setListID.bind(this)
		this.previewNewOrder = this.previewNewOrder.bind(this)
	}

	componentDidMount() {
		// Load initial data from backend once components mounts.
		const { fetchAllLists } = this.props
		fetchAllLists()
	}

	render() {
		const { isFetching, sortedLists, activeListID, allListsError } = this.props
		if (allListsError.isError) {
			return (
				<ErrorPanel show={allListsError.isError}>
					The list of lists could not be retrieved. Error message: <em>{allListsError.errorMessage}</em>
				</ErrorPanel>
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
					<AddList />
					{sortedLists.map(item =>
						<ListLink
							key={item.id}
							{...item}
							activeList={item.id == activeListID ? true : false}
							activeListID={activeListID}
							setNewOrder={this.setNewOrder}
							previewNewOrder={this.previewNewOrder}
							setListID={this.setListID}
						/>
					)}
					<form id="download-form" method="POST" className="hidden"><span dangerouslySetInnerHTML={{__html: csrfTokenInput}}></span></form>
				</div>
			)
		}
	}

	setNewOrder(id, order) {
		const { reorderList } = this.props
		reorderList(id, order)
	}

	setListID(id, listID) {
		const { moveListItem } = this.props
		moveListItem(id, listID)
	}

	previewNewOrder(dragID, dropOrder) {
		const { previewListOrder } = this.props
		previewListOrder(dragID, dropOrder)
	}

}


const mapStateToProps = (state) => ({
	isFetching: getAllListsFetchStatus(state),
	sortedLists: getSortedLists(state),
	allListsError: getallListsErrorStatus(state),
	activeListID: getActiveListID(state)
})


ListSwitcher.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	sortedLists: PropTypes.array.isRequired,
	activeListID: PropTypes.number,
	fetchAllLists: PropTypes.func.isRequired,
	allListsError: PropTypes.object.isRequired,
	reorderList: PropTypes.func.isRequired,
	moveListItem: PropTypes.func.isRequired,
	previewListOrder: PropTypes.func.isRequired
}


ListSwitcher = connect(
	mapStateToProps,
	{ fetchAllLists, reorderList, moveListItem, previewListOrder }
)(ListSwitcher)
export default ListSwitcher

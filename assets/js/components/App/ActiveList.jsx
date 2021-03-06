import PropTypes from 'prop-types'
import queryString from 'query-string'
import React from 'react'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { fetchActiveList } from '../../actions/list'
import { reorderListItem, previewListItemOrder } from '../../actions/list-item'
import { getSortedListItems, getListItemInitialOrders } from '../../reducers/activeListItems'
import { getActiveList, getActiveListID, getActiveListErrorStatus, getActiveListFetchStatus } from '../../reducers/activeList'
import ListHeader from './ActiveList/ListHeader.jsx'
import AddListItem from './ActiveList/AddListItem.jsx'
import FilterList from './ActiveList/FilterList.jsx'
import ListItem from './ActiveList/ListItem.jsx'
import { NoListPanel } from './ActiveList/NoListPanel.jsx'
import { ErrorPanel } from './Shared/ErrorPanel.jsx'
import { LoadingIndicator } from './Shared/LoadingIndicator.jsx'


const iconStyle = {
	marginRight: '5px'
}

const inputStyle = {
	width: '100%'
}


class ActiveList extends React.Component {
	constructor(props) {
		super(props)
		this.setNewOrder = this.setNewOrder.bind(this)
		this.previewNewOrder = this.previewNewOrder.bind(this)
	}

	componentDidMount() {
		// Load initial data from backend once components mounts.
		const { fetchActiveList, match, location } = this.props
		const queryFilters = queryString.parse(this.props.location.search, {arrayFormat: 'comma'})
		const tags = queryFilters.tags ? (
			Array.isArray(queryFilters.tags) ?
				queryFilters.tags.map(tag => { return {id: tag, text: tag} }) :
					[{id: queryFilters.tags, text: queryFilters.tags}]
		) : []
		let urlListID
		if (match.params.id !== undefined) {
			urlListID = parseInt(match.params.id)
		} else if (location.hash !== '') {
			const oldURLPatternMatches = location.hash.match(/#list\/(\d+)/)
			if (oldURLPatternMatches !== null) {
				urlListID = parseInt(oldURLPatternMatches[1])
			}
		}
		fetchActiveList({id: urlListID, filterTags: tags, filterText: queryFilters.text})
	}

	render() {
		const { activeListError, isFetching, sortedListItems, initialOrders, activeListID } = this.props
		if (activeListID === null) {
			if (activeListError.isError) {
				return (
					<ErrorPanel show={activeListError.isError}>
						This list could not be retrieved. Error message: <em>{activeListError.errorMessage}</em>
					</ErrorPanel>
				)
			} else {
				return (
					<NoListPanel />
				)
			}
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
					<ListGroup variant="flush">
						<FilterList />
						<AddListItem />
						{sortedListItems.map(item =>
							<ListItem
								key={item.id}
								{...item}
								initialOrder={initialOrders[item.id]}
								setNewOrder={this.setNewOrder}
								previewNewOrder={this.previewNewOrder}
							/>
						)}
					</ListGroup>
				</div>
			)
		}
	}

	setNewOrder(id, order, initialOrder) {
		const { reorderListItem } = this.props
		reorderListItem(id, order, initialOrder)
	}

	previewNewOrder(dragID, dropOrder) {
		const { previewListItemOrder } = this.props
		previewListItemOrder(dragID, dropOrder)
	}
}


const mapStateToProps = (state) => ({
	initialOrders: getListItemInitialOrders(state),
	activeListID: getActiveListID(state),
	sortedListItems: getSortedListItems(state),
	isFetching: getActiveListFetchStatus(state),
	activeListError: getActiveListErrorStatus(state)
})


ActiveList.propTypes = {
	initialOrders: PropTypes.object.isRequired,
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

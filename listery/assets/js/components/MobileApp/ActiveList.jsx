import { Block, Preloader, BlockTitle, List, ListItem } from 'framework7-react'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { fetchActiveList } from '../../actions/list'
import { getSortedListItems } from '../../reducers/activeListItems'
import { getActiveList, getActiveListID, getActiveListErrorStatus, getActiveListFetchStatus } from '../../reducers/activeList'


class ActiveList extends React.Component {
	componentDidMount() {
		const { fetchActiveList, activeListID } = this.props
		fetchActiveList({id: activeListID})
	}

	render() {
		const { activeList, activeListID, sortedListItems, isFetching, activeListError } = this.props
		if (activeListID === null) {
			if (activeListError.isError) {
				return (
					<Block>
						<p>The list of lists could not be retrieved. Error message: <em>{activeListError.errorMessage}</em></p>
					</Block>
				)
			}
			return (
				<Block>
					<p>There are no lists yet! Create one.</p>
				</Block>
			)
		} else if (isFetching) {
			return (
				<Preloader></Preloader>
			)
		} else {
			return (
				<div>
				<BlockTitle medium>{activeList.name}</BlockTitle>
					<List mediaList>
						{sortedListItems.map(item =>
							<ListItem
								key={item.id}
								title={item.title}
								text={item.description}
							/>
						)}
					</List>
				</div>
			)
		}
	}
}

const mapStateToProps = (state) => ({
	activeList: getActiveList(state),
	activeListID: getActiveListID(state),
	sortedListItems: getSortedListItems(state),
	isFetching: getActiveListFetchStatus(state),
	activeListError: getActiveListErrorStatus(state)
})


ActiveList.propTypes = {
	activeList: PropTypes.object.isRequired,
	activeListID: PropTypes.number,
	sortedListItems: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	activeListError: PropTypes.object.isRequired,
	fetchActiveList: PropTypes.func.isRequired,
}


ActiveList = connect(
	mapStateToProps,
	{ fetchActiveList }
)(ActiveList)
export default ActiveList

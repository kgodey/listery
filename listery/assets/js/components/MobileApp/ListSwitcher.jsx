import { Block, Preloader, List, ListItem } from 'framework7-react'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'


import { fetchAllLists } from '../../actions/list'
import { getActiveListID } from '../../reducers/activeList'
import { getSortedLists, getAllListsFetchStatus, getallListsErrorStatus } from '../../reducers/allLists'


class ListSwitcher extends React.Component {
	componentDidMount() {
		// Load initial data from backend once components mounts.
		const { fetchAllLists } = this.props
		fetchAllLists()
	}

	render() {
		const { isFetching, sortedLists, activeListID, allListsError } = this.props
		if (allListsError.isError) {
			return (
				<Block>
					<p>The list of lists could not be retrieved. Error message: <em>{allListsError.errorMessage}</em></p>
				</Block>
			)
		}
		if (isFetching) {
			return (
				 <Preloader color="white"></Preloader>
			)
		} else {
			return (
				<List>
					{sortedLists.map(item =>
						<ListItem
							key={item.id}
							title={item.name}
							bgColor={item.id == activeListID ? 'primary' : 'black'}
						/>
					)}
				</List>
			)
		}
	}
}

const mapStateToProps = (state) => ({
	isFetching: getAllListsFetchStatus(state),
	sortedLists: getSortedLists(state),
	activeListID: getActiveListID(state),
	allListsError: getallListsErrorStatus(state)
})


ListSwitcher.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	sortedLists: PropTypes.array.isRequired,
	activeListID: PropTypes.number,
	allListsError: PropTypes.object.isRequired,
	fetchAllLists: PropTypes.func.isRequired
}


ListSwitcher = connect(
	mapStateToProps,
	{ fetchAllLists }
)(ListSwitcher)
export default ListSwitcher

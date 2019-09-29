import { Block, Preloader, List } from 'framework7-react'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'


import { fetchAllLists } from '../../actions/list'
import { getSortedLists, getAllListsFetchStatus, getallListsErrorStatus } from '../../reducers/allLists'
import ListLink from './ListSwitcher/ListLink.jsx'


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
						<ListLink
							key={item.id}
							{...item}
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
	allListsError: getallListsErrorStatus(state)
})


ListSwitcher.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	sortedLists: PropTypes.array.isRequired,
	allListsError: PropTypes.object.isRequired,
	fetchAllLists: PropTypes.func.isRequired
}


ListSwitcher = connect(
	mapStateToProps,
	{ fetchAllLists }
)(ListSwitcher)
export default ListSwitcher

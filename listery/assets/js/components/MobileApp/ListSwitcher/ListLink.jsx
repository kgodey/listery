import { ListItem } from 'framework7-react'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { fetchActiveList } from '../../../actions/list'
import { getActiveListID } from '../../../reducers/activeList'


class ListLink extends React.Component {
	render() {
		const { id, name, onClick, activeListID } = this.props
		return (
			<ListItem
				title={name}
				bgColor={activeListID == id ? 'primary' : 'black'}
				onClick={onClick}
			/>
		)
	}
}


const mapStateToProps = (state, ownProps) => ({
	activeListID: getActiveListID(state)
})


const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => {
		dispatch(fetchActiveList({id: ownProps.id}))
	}
})


ListLink.propTypes = {
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	activeListID: PropTypes.number
}

ListLink = connect(mapStateToProps, mapDispatchToProps)(ListLink)
export default ListLink

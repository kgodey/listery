import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import ListLinkItem from './ListLink/ListLinkItem.jsx'
import { getNextList } from '../../../reducers/index'
import { fetchActiveList, archiveList, downloadPlaintextList } from '../../../actions//list'


class ListLink extends React.Component {
	constructor(props) {
		super(props)
	}


	render() {
		const { id, order, activeList, activeListID, setListOrder, showNewOrder, setListID } = this.props
		let className = 'list-group-item'
		let activeClassName = 'active'
		const linkURL = '/new/' + id
		return (
			<NavLink to={linkURL} className={className} activeClassName={activeClassName}>
				<ListLinkItem
					key={id}
					id={id}
					order={order}
					activeList={id == activeListID ? true : false}
					setListOrder={setListOrder}
					showNewOrder={showNewOrder}
					setListID={setListID}
				/>
			</NavLink>
		)
	}

}

const mapStateToProps = (state, ownProps) => {
	return {
		activeListID: state.activeListID
	}
}


ListLink = connect(mapStateToProps, null)(ListLink)
export default ListLink

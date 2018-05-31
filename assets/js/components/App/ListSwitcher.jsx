import React from 'react'
import { connect } from 'react-redux'

import { getSortedLists } from '../../reducers/index'
import ListLink from './ListSwitcher/ListLink.jsx'
import AddList from './ListSwitcher/AddList.jsx'


let ListSwitcher = (props) => {
	return (
		<div className="col-md-4 list-group">
			<AddList />
			{props.sortedLists.map(item =>
				<ListLink
					key={item.id}
					id={item.id}
					activeList={item.id == props.activeListID ? true : false}
				/>
			)}
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		sortedLists: getSortedLists(state),
		listsByID: state.listsByID,
		activeListID: state.activeListID
	}
}

ListSwitcher = connect(mapStateToProps, null)(ListSwitcher)
export default ListSwitcher

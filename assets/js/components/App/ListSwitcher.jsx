import React from 'react'
import { connect } from 'react-redux'

import { getSortedLists } from '../../reducers/index'
import ListLink from './ListSwitcher/ListLink.jsx'
import AddList from './ListSwitcher/AddList.jsx'


let ListSwitcher = (props) => {
	return (
		<div className="col-md-4 list-group">
			<AddList />
			{Object.keys(props.allLists).map(item =>
				<ListLink
					key={item}
					id={item}
					activeList={item == props.activeListID ? true : false}
				/>
			)}
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		allLists: getSortedLists(state),
		activeListID: state.activeListID
	}
}

ListSwitcher = connect(mapStateToProps, null)(ListSwitcher)
export default ListSwitcher

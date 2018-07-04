import React from 'react'
import { connect } from 'react-redux'

import FaCheck from 'react-icons/lib/fa/check'


let ListItemCount = ({ numCompletedItems, numItems }) => {
	return (
		<div className="col-2">
			<p className="text-right">
				<FaCheck/>
				&nbsp;  {numCompletedItems} / {numItems}
			</p>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		numItems: state.listsByID[state.activeListID].item_count,
		numCompletedItems: state.listsByID[state.activeListID].completed_item_count
	}
}

ListItemCount = connect(mapStateToProps, null)(ListItemCount)
export default ListItemCount

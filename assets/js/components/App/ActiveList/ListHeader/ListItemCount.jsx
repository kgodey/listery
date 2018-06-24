import React from 'react'
import { connect } from 'react-redux'

import FaCheckSquare from 'react-icons/lib/fa/check-square'


let ListItemCount = (props) => {
	return (
		<div className="col-2">
			<p className="text-right">
				<FaCheckSquare/>
				&nbsp;  {props.numCompletedItems} / {props.numItems}
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

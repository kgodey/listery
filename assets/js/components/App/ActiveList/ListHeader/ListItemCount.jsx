import React from 'react'
import { connect } from 'react-redux'

import FaCheck from 'react-icons/lib/fa/check'


let ListItemCount = (props) => {
	return (
		<div className="col-2">
			<p className="text-right">
				<FaCheck/>
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

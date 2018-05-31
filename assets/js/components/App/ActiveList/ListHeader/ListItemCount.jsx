import React from 'react'
import { connect } from 'react-redux'

import FaCheckSquare from 'react-icons/lib/fa/check-square'


const itemCountStyle = {
	lineHeight: '30px',
	marginBottom: '0px'
}

let ListItemCount = (props) => {
	return (
		<p className="text-right" style={itemCountStyle}>
			<FaCheckSquare/>
			&nbsp;  {props.numCompletedItems} / {props.numItems}
		</p>
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

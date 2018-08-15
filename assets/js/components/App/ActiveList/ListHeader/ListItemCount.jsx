import PropTypes from 'prop-types'
import React from 'react'
import FaCheck from 'react-icons/lib/fa/check'
import { connect } from 'react-redux'

import { getActiveList } from '../../../../reducers/activeList'


let ListItemCount = ({ numCompletedItems, numItems }) => {
	return (
		<div className="col-2">
			<p className="text-right">
				<FaCheck className="mr-2"/>
				{numCompletedItems} / {numItems}
			</p>
		</div>
	)
}


const mapStateToProps = (state) => ({
	numItems: getActiveList(state).item_count,
	numCompletedItems: getActiveList(state).completed_item_count
})


ListItemCount.propTypes = {
	numItems: PropTypes.number,
	numCompletedItems: PropTypes.number
}


ListItemCount = connect(mapStateToProps, null)(ListItemCount)
export default ListItemCount

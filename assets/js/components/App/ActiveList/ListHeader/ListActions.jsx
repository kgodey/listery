import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { SharingButton, QuickSortButton, CheckAllButton, UncheckAllButton } from './ListActions/Buttons.jsx'


const divStyle = {
	marginBottom: '10px'
}


let ListActions = ({ isPrivate, onQuickSortClick, onCheckAllClick, onUncheckAllClick, onShareClick }) => {
	return (
		<div style={divStyle} className="col">
			<QuickSortButton
				onClick={onQuickSortClick}
			/>
			<CheckAllButton
				onClick={onCheckAllClick}
			/>
			<UncheckAllButton
				onClick={onUncheckAllClick}
			/>
			<SharingButton
				isPrivate={isPrivate}
				onClick={onShareClick}
			/>
		</div>
	)
}


const mapStateToProps = (state) => ({
	isPrivate: state.listsByID[state.activeListID].private
})


ListActions.propTypes = {
	isPrivate: PropTypes.bool.isRequired,
	onQuickSortClick: PropTypes.func.isRequired,
	onCheckAllClick: PropTypes.func.isRequired,
	onUncheckAllClick: PropTypes.func.isRequired,
	onShareClick: PropTypes.func.isRequired
}


ListActions = connect(mapStateToProps, null)(ListActions)
export default ListActions

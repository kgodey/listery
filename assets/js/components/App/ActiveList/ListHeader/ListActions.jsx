import React from 'react'
import { connect } from 'react-redux'

import { SharingButton, QuickSortButton, CheckAllButton, UncheckAllButton } from './ListActions/Buttons.jsx'


const divStyle = {
	marginBottom: '10px'
}


let ListActions = ({ onQuickSortClick, onCheckAllClick, onUncheckAllClick, onPrivacyClick, isPrivate }) => {
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
				onClick={onPrivacyClick}
			/>
		</div>
	)
}


const mapStateToProps = (state) => {
	return {
		isPrivate: state.listsByID[state.activeListID].private
	}
}

ListActions = connect(mapStateToProps, null)(ListActions)

export default ListActions

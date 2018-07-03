import React from 'react'
import { connect } from 'react-redux'

import { SharingButton, QuickSortButton, CheckAllButton, UncheckAllButton } from './ListActions/Buttons.jsx'


const divStyle = {
	marginBottom: '10px'
}


let ListActions = (props) => {
	return (
		<div style={divStyle} className="col">
			<QuickSortButton
				onClick={props.onQuickSortClick}
			/>
			<CheckAllButton
				onClick={props.onCheckAllClick}
			/>
			<UncheckAllButton
				onClick={props.onUncheckAllClick}
			/>
			<SharingButton
				isPrivate={props.private}
				onClick={props.onPrivacyClick}
			/>
		</div>
	)
}


const mapStateToProps = (state) => {
	return {
		private: state.listsByID[state.activeListID].private,
	}
}

ListActions = connect(mapStateToProps, null)(ListActions)

export default ListActions

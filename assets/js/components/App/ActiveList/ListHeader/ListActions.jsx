import React from 'react'
import { SharingButton, QuickSortButton, CheckAllButton, UncheckAllButton } from './ListActions/Buttons.jsx'


const divStyle = {
	marginBottom: '10px'
}


export const ListActions = (props) => {
	return (
		<div style={divStyle}>
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
				private={props.private}
				onClick={props.onPrivacyClick}
			/>
		</div>
	)
}

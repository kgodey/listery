import PropTypes from 'prop-types'
import React from 'react'

import SharingButton from './ListActions/SharingButton.jsx'
import { QuickSortButton } from './ListActions/QuickSortButton.jsx'
import { CheckAllButton } from './ListActions/CheckAllButton.jsx'
import { UncheckAllButton } from './ListActions/UncheckAllButton.jsx'
import ToggleTagsButton from './ListActions/ToggleTagsButton.jsx'


const divStyle = {
	marginBottom: '10px'
}


export const ListActions = ({ onQuickSortClick, onCheckAllClick, onUncheckAllClick, onShareClick, onTagsEnabledClick }) => {
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
				onClick={onShareClick}
			/>
			<ToggleTagsButton
				onClick={onTagsEnabledClick}
			/>
		</div>
	)
}


ListActions.propTypes = {
	onQuickSortClick: PropTypes.func.isRequired,
	onCheckAllClick: PropTypes.func.isRequired,
	onUncheckAllClick: PropTypes.func.isRequired,
	onShareClick: PropTypes.func.isRequired,
	onTagsEnabledClick: PropTypes.func.isRequired,
}


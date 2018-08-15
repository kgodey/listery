import PropTypes from 'prop-types'
import React from 'react'
import FaSortAlphaAsc from 'react-icons/lib/fa/sort-alpha-asc'

import { Button } from './Button.jsx'


export const QuickSortButton = ({ onClick }) => {
	let icon = <FaSortAlphaAsc className="align-middle" />
	return (
		<Button
			icon={icon}
			text={'Quick Sort'}
			onClick={onClick}
		/>
	)
}


QuickSortButton.propTypes = {
	onClick: PropTypes.func.isRequired
}

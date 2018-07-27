import PropTypes from 'prop-types'
import React from 'react'
import FaCheckSqaureO from 'react-icons/lib/fa/check-square-o'

import { Button } from './Button.jsx'


export const CheckAllButton = ({ onClick }) => {
	let icon = <FaCheckSqaureO className="align-middle" />
	return (
		<Button
			icon={icon}
			text={'Check All'}
			onClick={onClick}
		/>
	)
}


CheckAllButton.propTypes = {
	onClick: PropTypes.func.isRequired
}

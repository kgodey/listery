import PropTypes from 'prop-types'
import React from 'react'
import FaSqaureO from 'react-icons/lib/fa/square-o'

import { Button } from './Button.jsx'


export const UncheckAllButton = ({ onClick }) => {
	let icon = <FaSqaureO className="align-middle" />
	return (
		<Button
			icon={icon}
			text={'Uncheck All'}
			onClick={onClick}
		/>
	)
}


UncheckAllButton.propTypes = {
	onClick: PropTypes.func.isRequired
}

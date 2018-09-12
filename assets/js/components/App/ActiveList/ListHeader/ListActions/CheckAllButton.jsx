import PropTypes from 'prop-types'
import React from 'react'
import { IconContext } from 'react-icons'
import { FaCheckSquare } from 'react-icons/fa'

import { Button } from './Button.jsx'


export const CheckAllButton = ({ onClick }) => {
	return (
		<IconContext.Provider value={{ className:'align-middle' }}>
			<Button
				icon={<FaCheckSquare />}
				text={'Check All'}
				onClick={onClick}
			/>
		</IconContext.Provider>
	)
}


CheckAllButton.propTypes = {
	onClick: PropTypes.func.isRequired
}

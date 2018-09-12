import PropTypes from 'prop-types'
import React from 'react'
import { IconContext } from 'react-icons'
import { FaSquare } from 'react-icons/fa'

import { Button } from './Button.jsx'


export const UncheckAllButton = ({ onClick }) => {
	return (
		<IconContext.Provider value={{ className:'align-middle' }}>
			<Button
				icon={<FaSquare />}
				text={'Uncheck All'}
				onClick={onClick}
			/>
		</IconContext.Provider>
	)
}


UncheckAllButton.propTypes = {
	onClick: PropTypes.func.isRequired
}

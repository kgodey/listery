import PropTypes from 'prop-types'
import React from 'react'
import { IconContext } from 'react-icons'
import { FaSortAlphaDown } from 'react-icons/fa'

import { Button } from './Button.jsx'


export const QuickSortButton = ({ onClick }) => {
	return (
		<IconContext.Provider value={{ className: 'align-middle' }}>
			<Button
				icon={<FaSortAlphaDown />}
				text={'Quick Sort'}
				onClick={onClick}
			/>
		</IconContext.Provider>
	)
}


QuickSortButton.propTypes = {
	onClick: PropTypes.func.isRequired
}

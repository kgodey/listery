import PropTypes from 'prop-types'
import React from 'react'


const checkboxStyle = {
	display: 'inline-block',
	textAlign: 'center',
	width: '35px'
}


export const Checkbox = ({ checked, onClick }) => {
	return (
		<span style={checkboxStyle} className='pull-left'>
			<input type='checkbox' checked={checked} onClick={onClick} />
		</span>
	)
}

Checkbox.propTypes = {
	checked: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired
}

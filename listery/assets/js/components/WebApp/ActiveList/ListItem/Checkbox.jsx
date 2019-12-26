import PropTypes from 'prop-types'
import React from 'react'


const checkboxContainerStyle = {
	display: 'inline',
	width: '35px'
}

const checkboxStyle = {
	marginTop: '5px'
}

export const Checkbox = ({ checked, onClick }) => {
	return (
		<span style={checkboxContainerStyle} className='pull-left align-top'>
			<input type='checkbox' checked={checked} onChange={onClick} style={checkboxStyle} />
		</span>
	)
}

Checkbox.propTypes = {
	checked: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired
}

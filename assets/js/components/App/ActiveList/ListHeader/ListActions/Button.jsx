import PropTypes from 'prop-types'
import React from 'react'


const buttonStyle = {
	marginRight: '10px',
	marginTop: '5px'
}


export const Button = ({ onClick, icon, text }) => {
	return (
		<button type="button" className="btn btn-outline-dark btn-sm" onClick={onClick} style={buttonStyle}>
			{icon}
			<span className="align-middle">&nbsp;{text}</span>
		</button>
	)
}


Button.propTypes = {
	icon: PropTypes.element.isRequired,
	text: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
}

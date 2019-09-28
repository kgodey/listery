import PropTypes from 'prop-types'
import React from 'react'
import { IconContext } from 'react-icons'
import { FaExclamationTriangle } from 'react-icons/fa'


const iconStyle = {
	marginRight: '0.5em'
}


export const ErrorPanel = ({ children }) => {
	return (
		<div className="card border-danger">
			<div className="card-header bg-danger text-white">
				<IconContext.Provider value={{ style: iconStyle, className: 'align-middle' }}>
					<FaExclamationTriangle />
				</IconContext.Provider>
				<FaExclamationTriangle style={iconStyle} className="align-middle" />
				<span className="align-middle">Error!</span>
			</div>
			<div className="card-body">
				{children}
			</div>
		</div>
	)
}


ErrorPanel.propTypes = {
	children: PropTypes.array.isRequired
}

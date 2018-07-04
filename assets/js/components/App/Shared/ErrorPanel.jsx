import React from 'react'
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle'


const iconStyle = {
	marginRight: '0.5em'
}


export const ErrorPanel = ({ children }) => {
	return (
		<div className="card border-danger">
			<div className="card-header bg-danger text-white">
				<FaExclamationTriangle style={iconStyle} className="align-middle" />
				<span className="align-middle">Error!</span>
			</div>
			<div className="card-body">
				{children}
			</div>
		</div>
	)
}

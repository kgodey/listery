import PropTypes from 'prop-types'
import React from 'react'
import ReactLoading from 'react-loading'


export const LoadingIndicator = ({ isFetching, type, height, width, className }) => {
	if (isFetching) {
		return (
			<ReactLoading
				type={type}
				color='#ccc'
				height={height}
				width={width}
				className={className}
			/>
		)
	}
	return (null)
}


LoadingIndicator.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	type: PropTypes.string.isRequired,
	height: PropTypes.string,
	width: PropTypes.string,
	className: PropTypes.string,
}

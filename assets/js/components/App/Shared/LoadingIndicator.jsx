import PropTypes from 'prop-types'
import React from 'react'
import ReactLoading from 'react-loading'


let LoadingIndicator = ({ isFetching, type, style, height, width, className }) => {
	if (isFetching) {
		return (
			<div style={style}>
				<ReactLoading
					type={type}
					color='#ccc'
					height={height}
					width={width}
					className={className}
				/>
			</div>
		)
	}
	return (null)
}


LoadingIndicator.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	type: PropTypes.string.isRequired,
	style: PropTypes.object,
	height: PropTypes.string,
	width: PropTypes.string,
	className: PropTypes.string,
}


export default LoadingIndicator

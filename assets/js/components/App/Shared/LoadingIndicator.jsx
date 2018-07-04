import React from 'react'
import ReactLoading from 'react-loading'


export const LoadingIndicator = ({ isFetching, style, type, height, width, className }) => {
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

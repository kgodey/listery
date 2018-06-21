import React from 'react'
import ReactLoading from 'react-loading'


export const LoadingIndicator = (props) => {
	if (props.isFetching) {
		return (
			<div style={props.style}>
				<ReactLoading
					type={props.type}
					color='#ccc'
					height={props.height}
					width={props.width}
					className={props.className}
				/>
			</div>
		)
	}
	return (null)
}

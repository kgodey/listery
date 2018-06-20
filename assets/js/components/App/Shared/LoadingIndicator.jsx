import React from 'react'
import ReactLoading from 'react-loading'


export const LoadingIndicator = (props) => {
	if (props.isFetching) {
		return (
			<ReactLoading
				type={props.type}
				color='#ccc'
				height={props.height}
				width={props.width}
				className={props.className}
			/>
		)
	}
	return (null)
}

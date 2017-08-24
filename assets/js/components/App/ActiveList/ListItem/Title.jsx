import React from 'react'


const titleDisplayStyle = {
	width: '90%',
	display: 'inline-block'
}


const titleEditStyle = {
	width: '80%'
}


export const Title = (props) => {
	if (props.currentlyEditing) {
		return (
			<input
				type='text'
				maxLength='255'
				placeholder='Title'
				style={titleEditStyle}
				value={props.title}
				onChange={props.onChange}
				onKeyUp={props.onKeyUp}
				onBlur={props.onBlur}
			/>
		)
	} else {
		return (
			<div style={titleDisplayStyle} onDoubleClick={props.onDoubleClick}>{props.title}</div>
		)
	}
}

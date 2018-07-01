import React from 'react'
import Linkify from 'react-linkify'


const titleDisplayStyle = {
	width: '90%',
	display: 'inline'
}


const titleEditStyle = {
	width: '90%'
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
			/>
		)
	} else {
		return (
			<Linkify>
				<div style={titleDisplayStyle} onDoubleClick={props.onDoubleClick}>{props.title}</div>
			</Linkify>
		)
	}
}

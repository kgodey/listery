import React from 'react'
import Linkify from 'react-linkify'


const titleDisplayStyle = {
	width: '90%',
	display: 'inline'
}


const titleEditStyle = {
	width: '90%'
}


export const Title = ({ currentlyEditing, title, onChange, onKeyUp, onDoubleClick }) => {
	if (currentlyEditing) {
		return (
			<input
				type='text'
				maxLength='255'
				placeholder='Title'
				style={titleEditStyle}
				value={title}
				onChange={onChange}
				onKeyUp={onKeyUp}
			/>
		)
	} else {
		return (
			<Linkify>
				<div style={titleDisplayStyle} onDoubleClick={onDoubleClick}>{title}</div>
			</Linkify>
		)
	}
}

import React from 'react'
import Linkify from 'react-linkify'


const descriptionStyle = {
	marginTop: 0,
	paddingTop: 0,
	display: 'block',
	marginLeft: '35px',
	width: '90%'
}

const descriptionEditStyle = {
	width: '90%',
	marginTop: '0.5em',
	fontSize: '0.8em',
	marginLeft: '35px',
}


export const Description = ({ currentlyEditing, description, onChange, onKeyUp }) => {
	if (currentlyEditing) {
		return (
			<input
				type='text'
				maxLength='255'
				placeholder='Description'
				style={descriptionEditStyle}
				value={description}
				onChange={onChange}
				onKeyUp={onKeyUp}
			/>
		)
	} else {
		return (
			<Linkify>
				<small><i><span style={descriptionStyle}>{description}</span></i></small>
			</Linkify>
		)
	}
}

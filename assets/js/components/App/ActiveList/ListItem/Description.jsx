import React from 'react'


const descriptionStyle = {
	marginTop: 0,
	paddingTop: 0
}

const descriptionEditStyle = {
	width: '84%',
	marginTop: '0.5em',
	fontSize: '0.8em'
}


export const Description = (props) => {
	if (props.currentlyEditing) {
		return (
			<input
				type='text'
				maxLength='255'
				placeholder='Description'
				style={descriptionEditStyle}
				value={props.description}
				onChange={props.onChange}
				onKeyUp={props.onKeyUp}
				onBlur={props.onBlur}
			/>
		)
	} else {
		return (
			<small><i><span style={descriptionStyle}>{props.description}</span></i></small>
		)
	}
}

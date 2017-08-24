import React from 'react'


const descriptionStyle = {
	marginTop: 0,
	paddingTop: 0
}


export const Description = (props) => {
	return (
		<small><i><span style={descriptionStyle}>{props.description}</span></i></small>
	)
}

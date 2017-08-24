import React from 'react'
import GoX from 'react-icons/lib/go/x'


export const DeleteIcon = (props) => {
	if (props.currentlyHovering) {
		return (
			<GoX onClick={props.onClick} />
		)
	}
	return (null)
}

import React from 'react'
import FaTrashO from 'react-icons/lib/fa/trash-o'


const iconStyle = {
	cursor: 'pointer'
}


export const DeleteIcon = (props) => {
	if (props.currentlyHovering) {
		return (
			<FaTrashO onClick={props.onClick} style={iconStyle} />
		)
	}
	return (null)
}

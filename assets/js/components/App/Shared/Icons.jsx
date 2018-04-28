import React from 'react'
import FaTrashO from 'react-icons/lib/fa/trash-o'


export const DeleteIcon = (props) => {
	if (props.currentlyHovering) {
		return (
			<FaTrashO onClick={props.onClick} />
		)
	}
	return (null)
}

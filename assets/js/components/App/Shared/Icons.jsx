import React from 'react'
import FaCloudDownload from 'react-icons/lib/fa/cloud-download'
import FaTrashO from 'react-icons/lib/fa/trash-o'


const iconStyle = {
	cursor: 'pointer',
	marginLeft: '0.25em',
	marginRight: '0.25em'
}


export const DownloadIcon = ({ currentlyHovering, onClick }) => {
	if (currentlyHovering) {
		return (
			<FaCloudDownload onClick={onClick} style={iconStyle} size='20' />
		)
	}
	return (null)
}



export const DeleteIcon = ({ currentlyHovering, onClick }) => {
	if (currentlyHovering) {
		return (
			<FaTrashO onClick={onClick} style={iconStyle} size='20' />
		)
	}
	return (null)
}

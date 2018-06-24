import React from 'react'
import FaCloudDownload from 'react-icons/lib/fa/cloud-download'
import FaTrashO from 'react-icons/lib/fa/trash-o'


const iconStyle = {
	cursor: 'pointer',
	marginLeft: '0.25em',
	marginRight: '0.25em'
}


export const DownloadIcon = (props) => {
	if (props.currentlyHovering) {
		return (
			<FaCloudDownload onClick={props.onClick} style={iconStyle} size='20' />
		)
	}
	return (null)
}



export const DeleteIcon = (props) => {
	if (props.currentlyHovering) {
		return (
			<FaTrashO onClick={props.onClick} style={iconStyle} size='20' />
		)
	}
	return (null)
}

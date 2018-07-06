import PropTypes from 'prop-types'
import React from 'react'
import FaCloudDownload from 'react-icons/lib/fa/cloud-download'
import FaTrashO from 'react-icons/lib/fa/trash-o'


const iconStyle = {
	cursor: 'pointer',
	marginLeft: '0.25em',
	marginRight: '0.25em'
}


let DownloadIcon = ({ currentlyHovering, onClick }) => {
	if (currentlyHovering) {
		return (
			<FaCloudDownload onClick={onClick} style={iconStyle} size='20' />
		)
	}
	return (null)
}


DownloadIcon.propTypes = {
	currentlyHovering: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired
}


let DeleteIcon = ({ currentlyHovering, onClick }) => {
	if (currentlyHovering) {
		return (
			<FaTrashO onClick={onClick} style={iconStyle} size='20' />
		)
	}
	return (null)
}


DeleteIcon.propTypes = {
	currentlyHovering: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired
}


export { DownloadIcon, DeleteIcon }

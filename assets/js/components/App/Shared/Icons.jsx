import PropTypes from 'prop-types'
import React from 'react'
import FaArchive from 'react-icons/lib/fa/archive'
import FaCloudDownload from 'react-icons/lib/fa/cloud-download'
import FaTrash from 'react-icons/lib/fa/trash'


const iconStyle = {
	cursor: 'pointer',
	marginLeft: '0.25em',
	marginRight: '0.25em',
	display: 'inline-block'
}


export const DownloadIcon = ({ currentlyHovering, onClick }) => {
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


export const DeleteIcon = ({ currentlyHovering, onClick }) => {
	if (currentlyHovering) {
		return (
			<FaTrash onClick={onClick} style={iconStyle} size='20' />
		)
	}
	return (null)
}


DeleteIcon.propTypes = {
	currentlyHovering: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired
}


export const ArchiveIcon = ({ currentlyHovering, onClick }) => {
	if (currentlyHovering) {
		return (
			<FaArchive onClick={onClick} style={iconStyle} size='20' />
		)
	}
	return (null)
}


ArchiveIcon.propTypes = {
	currentlyHovering: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired
}

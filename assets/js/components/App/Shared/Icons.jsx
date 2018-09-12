import PropTypes from 'prop-types'
import React from 'react'
import { IconContext } from 'react-icons'
import { FaArchive, FaCloudDownloadAlt, FaTrash } from 'react-icons/fa'


const iconStyle = {
	cursor: 'pointer',
	marginLeft: '0.25em',
	marginRight: '0.25em',
	display: 'inline-block'
}


export const DownloadIcon = ({ currentlyHovering, onClick }) => {
	if (currentlyHovering) {
		return (
			<IconContext.Provider value={{ style: iconStyle, size: '20' }}>
				<FaCloudDownloadAlt onClick={onClick} />
			</IconContext.Provider>
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
			<IconContext.Provider value={{ style: iconStyle, size: '20' }}>
				<FaTrash onClick={onClick} />
			</IconContext.Provider>
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
			<IconContext.Provider value={{ style: iconStyle, size: '20' }}>
				<FaArchive onClick={onClick} />
			</IconContext.Provider>
		)
	}
	return (null)
}


ArchiveIcon.propTypes = {
	currentlyHovering: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired
}

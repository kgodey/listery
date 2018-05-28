import React from 'react'
import FaCloudDownload from 'react-icons/lib/fa/cloud-download'


export const DownloadIcon = (props) => {
	if (props.currentlyHovering) {
		return (
			<FaCloudDownload onClick={props.onClick} />
		)
	}
	return (null)
}

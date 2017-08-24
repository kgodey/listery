import React from 'react'
import FaShareAlt from 'react-icons/lib/fa/share-alt'
import FaLock from 'react-icons/lib/fa/lock'


export const SharingButton = (props) => {
	let icon, text
	if (props.private) {
		icon = <FaShareAlt className="align-middle" />
		text = <span className="align-middle">&nbsp;Share</span>
	} else {
		icon = <FaLock className="align-middle" />
		text = <span className="align-middle">&nbsp;Make Private</span>
	}
	return (
		<button type="button" className="btn btn-outline-secondary btn-sm" onClick={props.onClick}>
			{icon}
			{text}
		</button>
	)
}

import PropTypes from 'prop-types'
import React from 'react'
import FaShareAlt from 'react-icons/lib/fa/share-alt'
import FaLock from 'react-icons/lib/fa/lock'
import { connect } from 'react-redux'

import { Button } from './Button.jsx'
import { getActiveList } from '../../../../../reducers/activeList'


let SharingButton = ({ listOwnerID, isPrivate, onClick }) => {
	let icon, text
	if (isPrivate) {
		icon = <FaShareAlt className="align-middle" />
		text = 'Share'
	} else {
		icon = <FaLock className="align-middle" />
		text = 'Make Private'
	}
	if (listOwnerID === userID) {
		return (
			<Button
				icon={icon}
				text={text}
				onClick={onClick}
			/>
		)
	}
	return (null)
}


const mapStateToProps = (state) => ({
	listOwnerID: getActiveList(state).owner_id,
	isPrivate: getActiveList(state).private
})


SharingButton.propTypes = {
	listOwnerID: PropTypes.number,
	isPrivate: PropTypes.bool,
	onClick: PropTypes.func.isRequired
}


SharingButton = connect(mapStateToProps, null)(SharingButton)
export default SharingButton

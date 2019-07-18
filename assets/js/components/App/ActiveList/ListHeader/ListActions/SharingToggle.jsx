import PropTypes from 'prop-types'
import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaShareAlt, FaLock } from 'react-icons/fa'
import { connect } from 'react-redux'

import { getActiveList } from '../../../../../reducers/activeList'


let SharingToggle = ({ listOwnerID, isPrivate, onClick }) => {
	let icon, text
	if (isPrivate) {
		icon = (
			<FaShareAlt />
		)
		text = 'Share'
	} else {
		icon = (
			<FaLock />
		)
		text = 'Make Private'
	}
	if (listOwnerID === currentUserID) {
		return (
			<Dropdown.Item as="button" onClick={onClick}>{icon}&nbsp;{text}</Dropdown.Item>
		)
	}
	return (null)
}


const mapStateToProps = (state) => ({
	listOwnerID: getActiveList(state).owner_id,
	isPrivate: getActiveList(state).private
})


SharingToggle.propTypes = {
	listOwnerID: PropTypes.number,
	isPrivate: PropTypes.bool,
	onClick: PropTypes.func.isRequired
}


SharingToggle = connect(mapStateToProps, null)(SharingToggle)
export default SharingToggle

import PropTypes from 'prop-types'
import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaGlobeAmericas, FaLock } from 'react-icons/fa'
import { connect } from 'react-redux'

import { getActiveList } from '../../../../../reducers/activeList'


const iconStyle = {
	marginRight: '5px'
}


let SharingToggle = ({ listOwnerID, isPrivate, onClick }) => {
	let icon, text
	if (isPrivate) {
		icon = (
			<FaGlobeAmericas style={iconStyle} />
		)
		text = 'Make Shared'
	} else {
		icon = (
			<FaLock style={iconStyle} />
		)
		text = 'Make Private'
	}
	if (listOwnerID === currentUserID) {
		return (
			<Dropdown.Item as="button" onClick={onClick}>{icon}{text}</Dropdown.Item>
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

import PropTypes from 'prop-types'
import React from 'react'
import { IconContext } from 'react-icons'
import { FaShareAlt, FaLock } from 'react-icons/fa'
import { connect } from 'react-redux'

import { Button } from './Button.jsx'
import { getActiveList } from '../../../../../reducers/activeList'


let SharingButton = ({ listOwnerID, isPrivate, onClick }) => {
	let icon, text
	if (isPrivate) {
		icon = (
			<IconContext.Provider value={{ className: 'align-middle' }}>
				<FaShareAlt />
			</IconContext.Provider>
		)
		text = 'Share'
	} else {
		icon = (
			<IconContext.Provider value={{ className: 'align-middle' }}>
				<FaLock />
			</IconContext.Provider>
		)
		text = 'Make Private'
	}
	if (listOwnerID === currentUserID) {
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

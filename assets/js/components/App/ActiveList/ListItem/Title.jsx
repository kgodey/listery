import PropTypes from 'prop-types'
import React from 'react'
import Linkify from 'react-linkify'


const titleDisplayStyle = {
	width: '90%',
	display: 'inline'
}


const titleEditStyle = {
	width: '90%'
}


export const Title = ({ currentlyEditing, title, onChange, onKeyUp }) => {
	if (currentlyEditing) {
		return (
			<input
				type='text'
				maxLength='255'
				placeholder='Title'
				style={titleEditStyle}
				value={title}
				onChange={onChange}
				onKeyUp={onKeyUp}
			/>
		)
	} else {
		return (
			<Linkify>
				<div style={titleDisplayStyle}>{title}</div>
			</Linkify>
		)
	}
}


Title.propTypes = {
	currentlyEditing: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onKeyUp: PropTypes.func.isRequired,
}

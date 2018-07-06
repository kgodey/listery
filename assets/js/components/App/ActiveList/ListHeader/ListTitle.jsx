import PropTypes from 'prop-types'
import React from 'react'


export const ListTitle = ({ name, currentlyEditing, onChange, onKeyUp, onDoubleClick }) => {
	if (currentlyEditing) {
		return (
			<input
				type='text'
				maxLength='255'
				className='h1'
				value={name}
				onChange={onChange}
				onKeyUp={onKeyUp}
			/>
		)
	} else {
		return (
			<h1 onDoubleClick={onDoubleClick}>{name}</h1>
		)
	}
}


ListTitle.propTypes = {
	name: PropTypes.string.isRequired,
	currentlyEditing: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	onKeyUp: PropTypes.func.isRequired,
	onDoubleClick: PropTypes.func.isRequired
}

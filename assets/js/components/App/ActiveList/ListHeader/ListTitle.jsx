import React from 'react'


export const ListTitle = ({ currentlyEditing, onChange, onKeyUp, onDoubleClick, name }) => {
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

import React from 'react'


export const ListTitle = (props) => {
	if (props.currentlyEditing) {
		return (
			<input
				type='text'
				maxLength='255'
				className='h1'
				value={props.name}
				onChange={props.onChange}
				onKeyUp={props.onKeyUp}
				onBlur={props.onBlur}
			/>
		)
	} else {
		return (
			<h1 onDoubleClick={props.onDoubleClick}>{props.name}</h1>
		)
	}
}

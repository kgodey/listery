import React from 'react'


const checkboxStyle = {
	display: 'inline-block',
	textAlign: 'center',
	width: '35px'
}


export const Checkbox = (props) => {
	return (
		<span style={checkboxStyle} className='pull-left'>
			<input type='checkbox' checked={props.checked} onClick={props.onClick} />
		</span>
	)
}

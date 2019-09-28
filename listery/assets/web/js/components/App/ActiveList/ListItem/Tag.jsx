import PropTypes from 'prop-types'
import React from 'react'
import Linkify from 'react-linkify'


const titleDisplayStyle = {
	width: '90%',
	display: 'inline-block',
	marginLeft: '10px'
}


const titleEditStyle = {
	width: '90%',
	marginLeft: '10px'
}


export const Title = ({ currentlyEditing, title, onChange, onKeyUp, onInputMouseEnter, onInputMouseLeave  }) => {
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
				onMouseEnter={onInputMouseEnter}
				onMouseLeave={onInputMouseLeave}
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

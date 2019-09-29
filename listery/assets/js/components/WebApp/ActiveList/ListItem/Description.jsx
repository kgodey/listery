import PropTypes from 'prop-types'
import React from 'react'
import Linkify from 'react-linkify'


const descriptionStyle = {
	marginTop: 0,
	paddingTop: 0,
	display: 'block',
	marginLeft: '23px',
	width: '90%'
}

const descriptionEditStyle = {
	width: '90%',
	marginTop: '0.5em',
	fontSize: '0.8em',
	marginLeft: '23px',
}


export const Description = ({ currentlyEditing, description, onChange, onKeyUp, onInputMouseEnter, onInputMouseLeave }) => {
	if (currentlyEditing) {
		return (
			<input
				type='text'
				maxLength='255'
				placeholder='Description'
				style={descriptionEditStyle}
				value={description !== null ? description : ''}
				onChange={onChange}
				onKeyUp={onKeyUp}
				onMouseEnter={onInputMouseEnter}
				onMouseLeave={onInputMouseLeave}
			/>
		)
	} else {
		return (
			<Linkify>
				<small><i><span style={descriptionStyle}>{description}</span></i></small>
			</Linkify>
		)
	}
}


Description.propTypes = {
	currentlyEditing: PropTypes.bool.isRequired,
	description: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	onKeyUp: PropTypes.func.isRequired
}

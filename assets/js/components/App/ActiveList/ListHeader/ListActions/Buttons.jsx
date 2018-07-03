import React from 'react'
import FaShareAlt from 'react-icons/lib/fa/share-alt'
import FaLock from 'react-icons/lib/fa/lock'
import FaSortAlphaAsc from 'react-icons/lib/fa/sort-alpha-asc'
import FaSqaureO from 'react-icons/lib/fa/square-o'
import FaCheckSqaureO from 'react-icons/lib/fa/check-square-o'


const buttonStyle = {
	marginRight: '10px',
	marginTop: '5px'
}


const Button = ({ onClick, icon, text }) => {
	return (
		<button type="button" className="btn btn-outline-dark btn-sm" onClick={onClick} style={buttonStyle}>
			{icon}
			<span className="align-middle">&nbsp;{text}</span>
		</button>
	)
}


export const SharingButton = ({ isPrivate, onClick }) => {
	let icon, text
	if (isPrivate) {
		icon = <FaShareAlt className="align-middle" />
		text = 'Share'
	} else {
		icon = <FaLock className="align-middle" />
		text = 'Make Private'
	}
	return (
		<Button
			icon={icon}
			text={text}
			onClick={onClick}
		/>
	)
}


export const QuickSortButton = ({ onClick }) => {
	let icon = <FaSortAlphaAsc className="align-middle" />
	return (
		<Button
			icon={icon}
			text={'Quick Sort'}
			onClick={onClick}
		/>
	)
}


export const CheckAllButton = ({ onClick }) => {
	let icon = <FaCheckSqaureO className="align-middle" />
	return (
		<Button
			icon={icon}
			text={'Check All'}
			onClick={onClick}
		/>
	)
}


export const UncheckAllButton = ({ onClick }) => {
	let icon = <FaSqaureO className="align-middle" />
	return (
		<Button
			icon={icon}
			text={'Uncheck All'}
			onClick={onClick}
		/>
	)
}

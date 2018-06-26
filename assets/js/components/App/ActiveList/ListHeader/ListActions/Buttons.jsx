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


const Button = (props) => {
	return (
		<button type="button" className="btn btn-outline-dark btn-sm" onClick={props.onClick} style={buttonStyle}>
			{props.icon}
			<span className="align-middle">&nbsp;{props.text}</span>
		</button>
	)
}


export const SharingButton = (props) => {
	let icon, text
	if (props.private) {
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
			onClick={props.onClick}
		/>
	)
}


export const QuickSortButton = (props) => {
	let icon = <FaSortAlphaAsc className="align-middle" />
	return (
		<Button
			icon={icon}
			text={'Quick Sort'}
			onClick={props.onClick}
		/>
	)
}


export const CheckAllButton = (props) => {
	let icon = <FaCheckSqaureO className="align-middle" />
	return (
		<Button
			icon={icon}
			text={'Check All'}
			onClick={props.onClick}
		/>
	)
}


export const UncheckAllButton = (props) => {
	let icon = <FaSqaureO className="align-middle" />
	return (
		<Button
			icon={icon}
			text={'Uncheck All'}
			onClick={props.onClick}
		/>
	)
}

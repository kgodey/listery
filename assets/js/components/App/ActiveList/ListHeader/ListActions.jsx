import PropTypes from 'prop-types'
import React from 'react'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Dropdown from 'react-bootstrap/Dropdown'
import { IconContext } from 'react-icons'
import { FaRegCheckSquare, FaMagic, FaSortAlphaDown, FaRegSquare, FaCog } from 'react-icons/fa'

import SharingToggle from './ListActions/SharingToggle.jsx'
import TagsToggle from './ListActions/TagsToggle.jsx'


const divStyle = {
	marginBottom: '10px'
}

const dropDownStyle = {
	marginRight: '10px'
}


export const ListActions = ({ onQuickSortClick, onCheckAllClick, onUncheckAllClick, onShareClick, onTagsToggleClick }) => {
	return (
		<div style={divStyle} className="col">
			<IconContext.Provider value={{ className:'align-middle' }}>
				<ButtonToolbar>
					<Dropdown style={dropDownStyle}>
						<Dropdown.Toggle size="sm" variant="outline-dark" id="listActionsDropdown">
							<FaMagic />&nbsp;Actions
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item as="button" onClick={onQuickSortClick}><FaSortAlphaDown />&nbsp;Quick sort</Dropdown.Item>
							<Dropdown.Item as="button" onClick={onCheckAllClick}><FaRegCheckSquare />&nbsp;Check all</Dropdown.Item>
							<Dropdown.Item as="button" onClick={onUncheckAllClick}><FaRegSquare />&nbsp;Uncheck all</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					<Dropdown>
						<Dropdown.Toggle size="sm" variant="outline-dark" id="listSettingsDropdown">
							<FaCog />&nbsp;List Settings
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<SharingToggle
								onClick={onShareClick}
							/>
							<TagsToggle
								onClick={onTagsToggleClick}
							/>
						</Dropdown.Menu>
					</Dropdown>
				</ButtonToolbar>
			</IconContext.Provider>
		</div>
	)
}


ListActions.propTypes = {
	onQuickSortClick: PropTypes.func.isRequired,
	onCheckAllClick: PropTypes.func.isRequired,
	onUncheckAllClick: PropTypes.func.isRequired,
	onShareClick: PropTypes.func.isRequired,
	onTagsToggleClick: PropTypes.func.isRequired,
}


import PropTypes from 'prop-types'
import React from 'react'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Dropdown from 'react-bootstrap/Dropdown'
import { IconContext } from 'react-icons'
import { FaRegCheckSquare, FaMagic, FaSortAlphaDown, FaRegSquare, FaCog } from 'react-icons/fa'

import SharingToggle from './ListActions/SharingToggle.jsx'
import TagsToggle from './ListActions/TagsToggle.jsx'


const divStyle = {
	marginBottom: '10px'
}

const buttonStyle = {
	marginRight: '10px'
}


export const ListActions = ({ onQuickSortClick, onCheckAllClick, onUncheckAllClick, onShareClick, onTagsToggleClick }) => {
	return (
		<div style={divStyle} className="col">
			<IconContext.Provider value={{ className:'align-middle' }}>
				<ButtonToolbar>
					<Button
						style={buttonStyle}
						variant="outline-dark"
						size="sm"
						onClick={onQuickSortClick}
					>
						<FaSortAlphaDown />&nbsp;Quick sort
					</Button>
					<Button
						style={buttonStyle}
						variant="outline-dark"
						size="sm"
						onClick={onCheckAllClick}
					>
						<FaRegCheckSquare />&nbsp;Check all
					</Button>
					<Button
						style={buttonStyle}
						variant="outline-dark"
						size="sm"
						onClick={onUncheckAllClick}
					>
						<FaRegSquare />&nbsp;Uncheck all
					</Button>
					<Dropdown>
						<Dropdown.Toggle size="sm" variant="outline-dark" id="listSettingsDropdown">
							<FaCog />&nbsp;Settings
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


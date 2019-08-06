import PropTypes from 'prop-types'
import React from 'react'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Dropdown from 'react-bootstrap/Dropdown'
import { IconContext } from 'react-icons'
import { FaCog, FaRegCheckSquare, FaRegSquare, FaSearch, FaSortAlphaDown } from 'react-icons/fa'

import SharingToggle from './ListActions/SharingToggle.jsx'
import TagsToggle from './ListActions/TagsToggle.jsx'


const divStyle = {
	marginBottom: '10px'
}


const buttonStyle = {
	marginRight: '10px',
	marginTop: '5px'
}


const iconStyle = {
	marginRight: '5px'
}


export const ListActions = ({ currentFilters, onFilterClick, onQuickSortClick, onCheckAllClick, onUncheckAllClick, onShareClick, onTagsToggleClick }) => {
	const filtersActive = currentFilters.tags.length > 0 || currentFilters.text
	const filterButtonVariant = currentFilters.showInterface ? 'dark' : (filtersActive ? 'info' : 'outline-dark')
	return (
		<div style={divStyle} className="col">
			<IconContext.Provider value={{ className:'align-middle' }}>
				<ButtonToolbar>
					<Button
						style={buttonStyle}
						variant={filterButtonVariant}
						size="sm"
						onClick={onFilterClick}
					>
						<FaSearch style={iconStyle} />Filters
					</Button>
					<Button
						style={buttonStyle}
						variant="outline-dark"
						size="sm"
						onClick={onQuickSortClick}
					>
						<FaSortAlphaDown style={iconStyle} />Quick sort
					</Button>
					<Button
						style={buttonStyle}
						variant="outline-dark"
						size="sm"
						onClick={onCheckAllClick}
					>
						<FaRegCheckSquare style={iconStyle} />Check all
					</Button>
					<Button
						style={buttonStyle}
						variant="outline-dark"
						size="sm"
						onClick={onUncheckAllClick}
					>
						<FaRegSquare style={iconStyle} />Uncheck all
					</Button>
					<Dropdown>
						<Dropdown.Toggle size="sm" variant="outline-dark" style={buttonStyle} id="listSettingsDropdown">
							<FaCog style={iconStyle} />Settings
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
	currentFilters: PropTypes.object.isRequired,
	onFilterClick: PropTypes.func.isRequired,
	onQuickSortClick: PropTypes.func.isRequired,
	onCheckAllClick: PropTypes.func.isRequired,
	onUncheckAllClick: PropTypes.func.isRequired,
	onShareClick: PropTypes.func.isRequired,
	onTagsToggleClick: PropTypes.func.isRequired,
}


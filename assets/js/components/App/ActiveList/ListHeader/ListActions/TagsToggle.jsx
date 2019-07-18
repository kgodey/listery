import PropTypes from 'prop-types'
import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaTags } from 'react-icons/fa'
import { connect } from 'react-redux'

import { getActiveList } from '../../../../../reducers/activeList'


let TagsToggle = ({ onClick, showTags }) => {
	let text = 'Show Tags'
	if (showTags) {
		text = 'Hide Tags'
	}
	return (
		<Dropdown.Item as="button" onClick={onClick}>{<FaTags />}&nbsp;{text}</Dropdown.Item>
	)
}


const mapStateToProps = (state) => ({
	showTags: getActiveList(state).show_tags
})


TagsToggle.propTypes = {
	onClick: PropTypes.func.isRequired,
	showTags: PropTypes.bool,
}


TagsToggle = connect(mapStateToProps, null)(TagsToggle)
export default TagsToggle

import PropTypes from 'prop-types'
import React from 'react'
import { IconContext } from 'react-icons'
import { FaTags } from 'react-icons/fa'
import { connect } from 'react-redux'

import { Button } from './Button.jsx'
import { getActiveList } from '../../../../../reducers/activeList'


let ToggleTagsButton = ({ onClick, showTags }) => {
	let text = 'Show Tags'
	if (showTags) {
		text = 'Hide Tags'
	}
	return (
		<IconContext.Provider value={{ className:'align-middle' }}>
			<Button
				icon={<FaTags />}
				text={text}
				onClick={onClick}
			/>
		</IconContext.Provider>
	)
}


const mapStateToProps = (state) => ({
	showTags: getActiveList(state).show_tags_by_default
})


ToggleTagsButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	showTags: PropTypes.bool,
}


ToggleTagsButton = connect(mapStateToProps, null)(ToggleTagsButton)
export default ToggleTagsButton

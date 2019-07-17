import PropTypes from 'prop-types'
import React from 'react'
import { IconContext } from 'react-icons'
import { FaTags } from 'react-icons/fa'
import { connect } from 'react-redux'

import { Button } from './Button.jsx'
import { getActiveList } from '../../../../../reducers/activeList'


let ToggleTagsButton = ({ onClick, tagsEnabled }) => {
	let text = 'Enable Tags'
	if (tagsEnabled) {
		text = 'Disable Tags'
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
	tagsEnabled: getActiveList(state).tags_enabled
})


ToggleTagsButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	tagsEnabled: PropTypes.bool,
}


ToggleTagsButton = connect(mapStateToProps, null)(ToggleTagsButton)
export default ToggleTagsButton

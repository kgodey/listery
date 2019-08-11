import PropTypes from 'prop-types'
import React from 'react'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { IconContext } from 'react-icons'
import { FaDownload, FaFilter } from 'react-icons/fa'
import { connect } from 'react-redux'
import { WithOutContext as ReactTags } from 'react-tag-input'

import { setFilters, downloadPlaintextList } from '../../../actions/list'
import { getActiveList, getCurrentFilters } from '../../../reducers/activeList'
import { getVisibleListIDs } from '../../../reducers/activeListItems'


const iconStyle = {
	marginRight: '5px',
	fontSize: '125%'
}


const buttonStyle = {
	marginRight: '10px',
	marginTop: '5px'
}


const buttonIconStyle = {
	marginRight: '5px'
}


class FilterList extends React.Component {
	constructor(props) {
		super(props)
		const { activeList, currentFilters } = props
		this.validateTagAddition = this.validateTagAddition.bind(this)
		this.handleTagAddition = this.handleTagAddition.bind(this)
		this.handleTagDeletion = this.handleTagDeletion.bind(this)
		this.handleTagInputChange = this.handleTagInputChange.bind(this)
		this.handleTagFilterSuggestions = this.handleTagFilterSuggestions.bind(this)
		this.sendFilterRequest = this.sendFilterRequest.bind(this)
		this.handleDownloadClick = this.handleDownloadClick.bind(this)
		this.state = {
			tags: currentFilters.tags && activeList.show_tags ? currentFilters.tags.map(tag => {
				const listTag = activeList.tags.find(activeListTag => activeListTag.id == tag.id)
				return listTag ? listTag : tag
			}) : [],
			text: currentFilters.text ? currentFilters.text : ''
		}
	}

	validateTagAddition(tag) {
		const { activeList } = this.props
		if (activeList.tags.find(t => t.id == tag.id)) {
			return true
		}
		return false
	}

	handleTagAddition(tag) {
		const newState = {
			tags: [...this.state.tags, tag],
			text: ''
		}
		this.setState(newState)
		this.sendFilterRequest(newState)
	}

	handleTagDeletion(index) {
		let newState = {...this.state}
		const tags = this.state.tags.slice(0)
		tags.splice(index, 1)
		newState['tags'] = tags
		this.setState(newState)
		this.sendFilterRequest(newState)
	}

	handleTagInputChange(value) {
		let newState = {...this.state}
		newState['text'] = value
		this.setState(newState)
		this.sendFilterRequest(newState)
	}

	handleTagFilterSuggestions(textInputValue, possibleSuggestionsArray) {
		const lowerCaseQuery = textInputValue.toLowerCase()

		return possibleSuggestionsArray.filter((suggestion) => {
			const matchLowerCase = suggestion.text.toLowerCase().includes(lowerCaseQuery)
			const currentTags = this.state.tags.map((tagObject) => {
				return tagObject.text
			})
			const notDuplicate = currentTags.indexOf(suggestion.text) > -1 ? false : true
			return matchLowerCase && notDuplicate
		})
	}

	sendFilterRequest(state) {
		const { setFilters, activeList } = this.props
		setFilters(activeList.id, state.tags, state.text)
	}

	handleDownloadClick(event) {
		const {activeList, downloadPlaintextList, visibleListIDs, currentFilters } = this.props
		downloadPlaintextList(activeList.id, activeList.name, visibleListIDs, currentFilters)
	}

	render() {
		const { activeList, currentFilters } = this.props
		const suggestions = activeList.show_tags ? activeList.tags : []
		if (currentFilters.showInterface) {
			return (
				<ListGroup.Item variant="light">
					<IconContext.Provider value={{ className:'align-middle' }}>
						<FaFilter style={iconStyle} />
						<ReactTags
							classNames={{
								tags: 'filterTags',
								tagInput: 'filterTagInput',
								tagInputField: 'filterTagInputField',
								selected: 'filterSelected',
								tag: 'filterTag',
								remove: 'filterRemove',
								suggestions: 'filterSuggestions',
								activeSuggestion: 'filterActiveSuggestion'
							}}
							tags={this.state.tags}
							suggestions={suggestions}
							placeholder="Type to filter..."
							autocomplete={true}
							allowDragDrop={false}
							minQueryLength={1}
							handleAddition={this.handleTagAddition}
							validateAddition={this.validateTagAddition}
							handleDelete={this.handleTagDeletion}
							handleInputChange={this.handleTagInputChange}
							inputValue={this.state.text}
							handleFilterSuggestions={this.handleTagFilterSuggestions}
							delimiters={[9, 13, 188]} // tab, enter, comma
						/>
						<Button
							style={buttonStyle}
							variant='secondary'
							size="sm"
							className="float-right"
							onClick={this.handleDownloadClick}
						>
							<FaDownload style={buttonIconStyle} />Download Current View
						</Button>
					</IconContext.Provider>
				</ListGroup.Item>
			)
		}
		return (null)
	}
}


const mapStateToProps = (state) => ({
	activeList: getActiveList(state),
	currentFilters: getCurrentFilters(state),
	visibleListIDs: getVisibleListIDs(state),
})


FilterList.propTypes = {
	activeList: PropTypes.object.isRequired,
	currentFilters: PropTypes.object.isRequired,
	visibleListIDs: PropTypes.array.isRequired,
	setFilters: PropTypes.func.isRequired,
	downloadPlaintextList: PropTypes.func.isRequired
}


FilterList = connect(
	mapStateToProps,
	{ setFilters, downloadPlaintextList }
)(FilterList)
export default FilterList

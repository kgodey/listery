import PropTypes from 'prop-types'
import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { FaSearch } from 'react-icons/fa'
import { connect } from 'react-redux'
import { WithOutContext as ReactTags } from 'react-tag-input'

import { filterActiveList } from '../../../actions/list'
import { getActiveList, getShowFilterInterface } from '../../../reducers/activeList'


const iconStyle = {
	marginRight: '5px',
	fontSize: '125%'
}


class FilterList extends React.Component {
	constructor(props) {
		super(props)
		const { activeList, filters } = props
		this.validateTagAddition = this.validateTagAddition.bind(this)
		this.handleTagAddition = this.handleTagAddition.bind(this)
		this.handleTagDeletion = this.handleTagDeletion.bind(this)
		this.handleTagInputChange = this.handleTagInputChange.bind(this)
		this.handleTagFilterSuggestions = this.handleTagFilterSuggestions.bind(this)
		this.sendFilterRequest = this.sendFilterRequest.bind(this)
		this.state = {
			tags: filters.tags ? filters.tags.map(tag => {
				const listTag = activeList.tags.find(activeListTag => activeListTag.id == tag.id)
				return listTag ? listTag : tag
			}) : [],
			text: filters.text ? filters.text : ''
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
		var lowerCaseQuery = textInputValue.toLowerCase()

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
		const { filterActiveList, activeList } = this.props
		filterActiveList(activeList.id, state.tags, state.text)
	}

	render() {
		const { activeList, showFilterInterface } = this.props
		if (showFilterInterface) {
			return (
				<ListGroup.Item variant="light">
					<FaSearch style={iconStyle} />
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
						suggestions={activeList.tags}
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
				</ListGroup.Item>
			)
		}
		return (null)
	}
}


const mapStateToProps = (state) => ({
	activeList: getActiveList(state),
	showFilterInterface: getShowFilterInterface(state)
})


FilterList.propTypes = {
	filters: PropTypes.object,
	activeList: PropTypes.object.isRequired,
	showFilterInterface: PropTypes.bool.isRequired,
	filterActiveList: PropTypes.func.isRequired
}


FilterList = connect(
	mapStateToProps,
	{ filterActiveList }
)(FilterList)
export default FilterList
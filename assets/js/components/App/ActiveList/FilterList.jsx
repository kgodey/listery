import PropTypes from 'prop-types'
import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { FaSearch } from 'react-icons/fa'
import { connect } from 'react-redux'
import { WithOutContext as ReactTags } from 'react-tag-input'

import { getActiveList, getShowFilterInterface } from '../../../reducers/activeList'


const iconStyle = {
	marginRight: '5px',
	fontSize: '125%'
}


class FilterList extends React.Component {
	constructor(props) {
		super(props)
		this.handleTagAddition = this.handleTagAddition.bind(this)
		this.handleTagDeletion = this.handleTagDeletion.bind(this)
		this.handleTagInputChange = this.handleTagInputChange.bind(this)
		this.handleTagFilterSuggestions = this.handleTagFilterSuggestions.bind(this)
		this.state = {
			tags: [],
			text: ''
		}
	}

	handleTagAddition(tag) {
		const { activeList } = this.props
		if (activeList.tags.find(t => t.id == tag.id)) {
			this.setState({
				tags: [...this.state.tags, tag],
				text: ''
			})
		}
	}

	handleTagDeletion(index) {
		let newState = {...this.state}
		const tags = this.state.tags.slice(0)
		tags.splice(index, 1)
		newState['tags'] = tags
		this.setState(newState)
	}

	handleTagInputChange(value) {
		let newState = {...this.state}
		newState['text'] = value
		this.setState(newState)
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
						placeholder="Type to filer..."
						autocomplete={true}
						allowDragDrop={false}
						minQueryLength={1}
						handleAddition={this.handleTagAddition}
						handleDelete={this.handleTagDeletion}
						handleInputChange={this.handleTagInputChange}
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
	activeList: PropTypes.object.isRequired,
	showFilterInterface: PropTypes.bool.isRequired
}


FilterList = connect(
	mapStateToProps,
	null
)(FilterList)
export default FilterList

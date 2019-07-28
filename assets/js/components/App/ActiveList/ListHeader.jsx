import PropTypes from 'prop-types'
import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import onClickOutside from 'react-onclickoutside'
import { connect } from 'react-redux'

import { getActiveList, getShowFilterInterface } from '../../../reducers/activeList'
import { ListTitle } from './ListHeader/ListTitle.jsx'
import { ListActions } from './ListHeader/ListActions.jsx'
import ListItemCount from './ListHeader/ListItemCount.jsx'
import { updateActiveList, performActionOnList, toggleFilterInterface } from '../../../actions/list'
import { QUICK_SORT_URL_SUFFIX, CHECK_ALL_URL_SUFFIX, UNCHECK_ALL_URL_SUFFIX } from '../../../utils/urls'


class ListHeader extends React.Component {
	constructor(props) {
		super(props)
		const { name } = props.activeList
		this.state = {
			data: {
				name: name
			},
			currentlyEditing: false
		}
		this.handleNameDoubleClick = this.handleNameDoubleClick.bind(this)
		this.handleFilterClick = this.handleFilterClick.bind(this)
		this.handleQuickSortClick = this.handleQuickSortClick.bind(this)
		this.handleCheckAllClick = this.handleCheckAllClick.bind(this)
		this.handleUncheckAllClick = this.handleUncheckAllClick.bind(this)
		this.handlePrivacyClick = this.handlePrivacyClick.bind(this)
		this.handleTagsEnabledClick = this.handleTagsEnabledClick.bind(this)
		this.handleClickOutside = this.handleClickOutside.bind(this)
		this.handleNameChange = this.handleNameChange.bind(this)
		this.handleNameKeyUp = this.handleNameKeyUp.bind(this)
		this.saveListName = this.saveListName.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		const { name } = nextProps.activeList
		this.setState({
			data: {
				name: name
			}
		})
	}

	handleNameChange(event) {
		this.setState({
			data: {
				name: event.target.value
			}
		})
	}

	handlePrivacyClick(event) {
		const { updateActiveList, activeList } = this.props
		updateActiveList(activeList.id, { private: !activeList.private }, activeList)
	}

	updateListUsingAction(actionURL) {
		const { performActionOnList, activeList } = this.props
		performActionOnList(activeList.id, actionURL, activeList)
	}

	handleFilterClick(event) {
		const { toggleFilterInterface } = this.props
		toggleFilterInterface()
	}

	handleQuickSortClick(event) {
		this.updateListUsingAction(QUICK_SORT_URL_SUFFIX)
	}

	handleCheckAllClick(event) {
		this.updateListUsingAction(CHECK_ALL_URL_SUFFIX)
	}

	handleUncheckAllClick(event) {
		this.updateListUsingAction(UNCHECK_ALL_URL_SUFFIX)
	}

	handleTagsEnabledClick() {
		const { updateActiveList, activeList } = this.props
		updateActiveList(activeList.id, { show_tags: !activeList.show_tags }, activeList)
	}

	handleNameDoubleClick(event) {
		this.setState({currentlyEditing: true})
	}

	handleClickOutside(event) {
		if (this.state.currentlyEditing === true) {
			this.saveListName()
		}
	}

	handleNameKeyUp(event) {
		if (event.key == 'Enter') {
			this.saveListName()
		} else if (event.key == 'Escape') {
			// cancel editing
			this.handleClickOutside()
		}
	}

	saveListName() {
		const { updateActiveList, activeList } = this.props
		updateActiveList(activeList.id, { name: this.state.data.name }, activeList)
		this.setState({ currentlyEditing: false })
	}

	render() {
		const { activeList, showFilterInterface } = this.props
		return (
			<div>
				<Row>
					<ListTitle
						name={this.state.data.name}
						currentlyEditing={this.state.currentlyEditing}
						onChange={this.handleNameChange}
						onKeyUp={this.handleNameKeyUp}
						onDoubleClick={this.handleNameDoubleClick}
					/>
				</Row>
				<Row>
					<ListActions
						showFilterInterface={showFilterInterface}
						onFilterClick={this.handleFilterClick}
						onQuickSortClick={this.handleQuickSortClick}
						onCheckAllClick={this.handleCheckAllClick}
						onUncheckAllClick={this.handleUncheckAllClick}
						onShareClick={this.handlePrivacyClick}
						onTagsToggleClick={this.handleTagsEnabledClick}
					/>
					<ListItemCount />
				</Row>
			</div>
		)
	}
}


const mapStateToProps = (state) => ({
	activeList: getActiveList(state),
	showFilterInterface: getShowFilterInterface(state)
})


ListHeader.propTypes = {
	activeList: PropTypes.object.isRequired,
	updateActiveList: PropTypes.func.isRequired,
	performActionOnList: PropTypes.func.isRequired,
	showFilterInterface: PropTypes.bool.isRequired,
	toggleFilterInterface: PropTypes.func.isRequired,
}


ListHeader = onClickOutside(ListHeader)
ListHeader = connect(
	mapStateToProps,
	{ updateActiveList, performActionOnList, toggleFilterInterface }
)(ListHeader)
export default ListHeader

import React from 'react'
import onClickOutside from 'react-onclickoutside'
import { connect } from 'react-redux'

import { ListTitle } from './ListHeader/ListTitle.jsx'
import ListActions from './ListHeader/ListActions.jsx'
import ListItemCount from './ListHeader/ListItemCount.jsx'
import { patchList, performActionOnList, QUICK_SORT, CHECK_ALL, UNCHECK_ALL } from '../../../actions//list.js'


class ListHeader extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {
				name: props.name
			},
			currentlyEditing: false
		}
		this.handleNameChange = this.handleNameChange.bind(this)
		this.handlePrivacyClick = this.handlePrivacyClick.bind(this)
		this.handleQuickSortClick = this.handleQuickSortClick.bind(this)
		this.handleCheckAllClick = this.handleCheckAllClick.bind(this)
		this.handleUncheckAllClick = this.handleUncheckAllClick.bind(this)
		this.handleNameDoubleClick = this.handleNameDoubleClick.bind(this)
		this.handleClickOutside = this.handleClickOutside.bind(this)
		this.handleNameChange = this.handleNameChange.bind(this)
		this.handleNameKeyUp = this.handleNameKeyUp.bind(this)
		this.saveListName = this.saveListName.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: {
				name: nextProps.name
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
		this.props.updateList(id, { private: !this.props.private })
	}

	updateListUsingAction(actionURL) {
		this.props.updateListViaAction(this.props.id, actionURL)
	}

	handleQuickSortClick(event) {
		this.updateListUsingAction(QUICK_SORT)
	}

	handleCheckAllClick(event) {
		this.updateListUsingAction(CHECK_ALL)
	}

	handleUncheckAllClick(event) {
		this.updateListUsingAction(UNCHECK_ALL)
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
		this.props.updateList(this.props.id, { name: this.state.data.name })
		this.setState({currentlyEditing: false})
	}

	render() {
		return (
			<div>
				<ListTitle
					name={this.state.data.name}
					currentlyEditing={this.state.currentlyEditing}
					onChange={this.handleNameChange}
					onKeyUp={this.handleNameKeyUp}
					onDoubleClick={this.handleNameDoubleClick}
				/>
				<ListActions
					onPrivacyClick={this.handlePrivacyClick}
					onQuickSortClick={this.handleQuickSortClick}
					onCheckAllClick={this.handleCheckAllClick}
					onUncheckAllClick={this.handleUncheckAllClick}
				/>
				<ListItemCount />
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		id: state.activeListID,
		name: state.listsByID[state.activeListID].name,
		private: state.listsByID[state.activeListID].private
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateList: (id, data) => {
			dispatch(patchList(id, data))
		},
		updateListViaAction: (id, actionURL) => {
			dispatch(performActionOnList(id, actionURL))
		}
	}
}

ListHeader = onClickOutside(ListHeader)
ListHeader = connect(mapStateToProps, mapDispatchToProps)(ListHeader)

export default ListHeader

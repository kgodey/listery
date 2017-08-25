import React from 'react'

import { ListTitle } from './ListHeader/ListTitle.jsx'
import { ListActions } from './ListHeader/ListActions.jsx'
import { QUICK_SORT, CHECK_ALL, UNCHECK_ALL } from '../../../actions/api/list.js'
import { saveListName, saveListPrivacy, performActionOnList } from '../../../actions/ui.js'

export class ListHeader extends React.Component {
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
		this.handleNameChange = this.handleNameChange.bind(this)
		this.handleNameKeyUp = this.handleNameKeyUp.bind(this)
		this.handleNameBlur = this.handleNameBlur.bind(this)
		this.saveListName = this.saveListName.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: {
				name: nextProps.name
			}
		});
	}

	handleNameChange(event) {
		this.setState({
			data: {
				name: event.target.value
			}
		})
	}

	handlePrivacyClick(event) {
		saveListPrivacy(this.props.id, !this.props.private)
	}

	handleQuickSortClick(event) {
		performActionOnList(this.props.id, QUICK_SORT)
	}

	handleCheckAllClick(event) {
		performActionOnList(this.props.id, CHECK_ALL)
	}

	handleUncheckAllClick(event) {
		performActionOnList(this.props.id, UNCHECK_ALL)
	}

	handleNameDoubleClick(event) {
		this.setState({currentlyEditing: true})
	}

	handleNameKeyUp(event) {
		if (event.key == 'Enter'){
			this.saveListName()
		}
	}

	handleNameBlur(event) {
		this.saveListName()
	}

	saveListName() {
		saveListName(this.props.id, this.state.data.name)
		this.setState({currentlyEditing: false})
	}

	render() {
		return (
			<div>
				<ListTitle
					id={this.props.id}
					name={this.state.data.name}
					currentlyEditing={this.state.currentlyEditing}
					onChange={this.handleNameChange}
					onKeyUp={this.handleNameKeyUp}
					onBlur={this.handleNameBlur}
					onDoubleClick={this.handleNameDoubleClick}
				/>
				<ListActions
					private={this.props.private}
					onPrivacyClick={this.handlePrivacyClick}
					onQuickSortClick={this.handleQuickSortClick}
					onCheckAllClick={this.handleCheckAllClick}
					onUncheckAllClick={this.handleUncheckAllClick}
				/>
			</div>
		)
	}
}

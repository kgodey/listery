import PropTypes from 'prop-types'
import React from 'react'
import onClickOutside from 'react-onclickoutside'
import { connect } from 'react-redux'

import { getActiveList, getActiveListFetchStatus } from '../../../reducers/activeList'
import { ListTitle } from './ListHeader/ListTitle.jsx'
import { ListActions } from './ListHeader/ListActions.jsx'
import ListItemCount from './ListHeader/ListItemCount.jsx'
import { updateActiveList, performActionOnList } from '../../../actions/list'
import { QUICK_SORT_URL_SUFFIX, CHECK_ALL_URL_SUFFIX, UNCHECK_ALL_URL_SUFFIX } from '../../../utils/urls'


class ListHeader extends React.Component {
	constructor(props) {
		super(props)
		const { name } = props.list
		this.state = {
			data: {
				name: name
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
		const { name } = nextProps.list
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
		const { updateActiveList, list } = this.props
		updateActiveList(list.id, { private: !list.private }, list)
	}

	updateListUsingAction(actionURL) {
		const { performActionOnList, list } = this.props
		performActionOnList(list.id, actionURL, list)
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
		const { updateActiveList, list } = this.props
		updateActiveList(list.id, { name: this.state.data.name }, list)
		this.setState({ currentlyEditing: false })
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<ListTitle
							name={this.state.data.name}
							currentlyEditing={this.state.currentlyEditing}
							onChange={this.handleNameChange}
							onKeyUp={this.handleNameKeyUp}
							onDoubleClick={this.handleNameDoubleClick}
						/>
					</div>
				</div>
				<div className="row align-items-end">
					<ListActions
						onShareClick={this.handlePrivacyClick}
						onQuickSortClick={this.handleQuickSortClick}
						onCheckAllClick={this.handleCheckAllClick}
						onUncheckAllClick={this.handleUncheckAllClick}
					/>
					<ListItemCount />
				</div>
			</div>
		)
	}
}


const mapStateToProps = (state) => ({
	list: getActiveList(state)
})


ListHeader.propTypes = {
	list: PropTypes.object.isRequired,
	updateActiveList: PropTypes.func.isRequired,
	performActionOnList: PropTypes.func.isRequired
}


ListHeader = onClickOutside(ListHeader)
ListHeader = connect(
	mapStateToProps,
	{ updateActiveList, performActionOnList }
)(ListHeader)
export default ListHeader

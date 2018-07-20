import PropTypes from 'prop-types'
import React from 'react'
import onClickOutside from 'react-onclickoutside'
import { connect } from 'react-redux'

import { getActiveListFetchStatus } from '../../../reducers/fetchingActiveList'
import { ListTitle } from './ListHeader/ListTitle.jsx'
import ListActions from './ListHeader/ListActions.jsx'
import ListItemCount from './ListHeader/ListItemCount.jsx'
import { updateList, performActionOnList, QUICK_SORT, CHECK_ALL, UNCHECK_ALL } from '../../../actions/list'


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
		const { updateList, list } = this.props
		updateList(list.id, { private: !list.private })
	}

	updateListUsingAction(actionURL) {
		const { performActionOnList, list } = this.props
		performActionOnList(list.id, actionURL)
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
		const { updateList, list } = this.props
		updateList(list.id, { name: this.state.data.name })
		this.setState({ currentlyEditing: false })
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-md-8">
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
	list: state.listsByID[state.activeListID]
})


ListHeader.propTypes = {
	list: PropTypes.object.isRequired,
	updateList: PropTypes.func.isRequired,
	performActionOnList: PropTypes.func.isRequired
}


ListHeader = onClickOutside(ListHeader)
ListHeader = connect(
	mapStateToProps,
	{ updateList, performActionOnList }
)(ListHeader)
export default ListHeader

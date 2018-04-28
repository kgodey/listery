import React from 'react'
import { connect } from 'react-redux'

import { getNextList } from '../../../reducers/index'
import { fetchActiveList, archiveList } from '../../../actions//list'
import { DeleteIcon } from '../Shared/Icons.jsx'


const nameStyle = {
	display: 'inline-block'
}

class ListLink extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentlyHovering: false
		}
		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
		this.handleArchiveClick = this.handleArchiveClick.bind(this)
	}

	handleMouseEnter(event) {
		this.setState({currentlyHovering: true})
	}

	handleMouseLeave(event) {
		this.setState({currentlyHovering: false})
	}

	handleArchiveClick(event) {
		this.props.hideList(this.props.id, {}, this.props.nextListID)
	}

	render() {
		let className = 'list-group-item'
		if (this.props.activeList) {
			 className = className + ' active'
		}
		return (
			<div className={className} style={nameStyle} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
				<span onClick={this.props.onClick}>{this.props.name}</span>
				<DeleteIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleArchiveClick} />
			</div>
		)
	}

}

const mapStateToProps = (state, ownProps) => {
	return {
		name: state.allLists[ownProps.id].name,
		nextListID: getNextList(state, ownProps.id)
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onClick: (id) => {
			dispatch(fetchActiveList(ownProps.id))
		},
		hideList: (id, data, nextListID) => {
			dispatch(archiveList(id, data, nextListID))
			if (ownProps.activeList) {
				dispatch(fetchActiveList(nextListID))
			}
		}
	}
}

ListLink = connect(mapStateToProps, mapDispatchToProps)(ListLink)

export default ListLink

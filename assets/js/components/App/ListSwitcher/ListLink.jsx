import React from 'react'
import { connect } from 'react-redux'

import { getNextList } from '../../../reducers/index'
import { fetchActiveList, archiveList, downloadPlaintextList } from '../../../actions//list'
import { DeleteIcon } from '../Shared/Icons.jsx'
import { DownloadIcon } from './ListLink/DownloadIcon.jsx'


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
		this.handleDownloadClick = this.handleDownloadClick.bind(this)
		this.handleArchiveClick = this.handleArchiveClick.bind(this)
	}

	handleMouseEnter(event) {
		this.setState({currentlyHovering: true})
	}

	handleMouseLeave(event) {
		this.setState({currentlyHovering: false})
	}

	handleDownloadClick(event) {
		this.props.downloadList(this.props.id, this.props.downloadFormID)
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
				<DownloadIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleDownloadClick} />
				<DeleteIcon currentlyHovering={this.state.currentlyHovering} onClick={this.handleArchiveClick} />
				<form id={this.props.downloadFormID} method="POST" className="hidden"><span dangerouslySetInnerHTML={{__html: csrfTokenInput}}></span></form>
			</div>
		)
	}

}

const mapStateToProps = (state, ownProps) => {
	return {
		name: state.listsByID[ownProps.id].name,
		nextListID: getNextList(state, ownProps.id),
		downloadFormID: 'download-form-' + ownProps.id
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
		},
		downloadList: (id, downloadFormID) => {
			dispatch(downloadPlaintextList(id, downloadFormID))
		}
	}
}

ListLink = connect(mapStateToProps, mapDispatchToProps)(ListLink)

export default ListLink

import React from 'react'
import { connect } from 'react-redux'

import { fetchActiveList } from '../../../actions//list'


const nameStyle = {
	display: 'inline-block'
}

let ListLink = (props) => {
	let className = 'list-group-item'
	if (props.activeList) {
		 className = className + ' active'
	}
	return (
		<div className={className} style={nameStyle} onClick={props.onClick}>
			{props.name}
		</div>
	)
}

const mapStateToProps = (state, ownProps) => {
	return {
		name: state.allLists[ownProps.id].name,
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onClick: (id) => {
			dispatch(fetchActiveList(ownProps.id))
		}
	}
}

ListLink = connect(mapStateToProps, mapDispatchToProps)(ListLink)

export default ListLink

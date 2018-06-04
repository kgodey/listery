import React from 'react'
import { connect } from 'react-redux'

import { updateListOrder } from '../../actions/list'
import { getSortedLists } from '../../reducers/index'
import ListLink from './ListSwitcher/ListLink.jsx'
import AddList from './ListSwitcher/AddList.jsx'


class ListSwitcher extends React.Component {
	constructor(props) {
		super(props)
		this.setListOrder = this.setListOrder.bind(this)
	}

	render() {
		return (
			<div className="col-md-4 list-group">
				<AddList />
				{this.props.sortedLists.map(item =>
					<ListLink
						key={item.id}
						id={item.id}
						order={item.order}
						activeList={item.id == this.props.activeListID ? true : false}
						setListOrder={this.setListOrder}
					/>
				)}
			</div>
		)
	}

	setListOrder(id, order) {
		this.props.reorderList(id, order)
	}
}


const mapStateToProps = (state) => {
	return {
		sortedLists: getSortedLists(state),
		listsByID: state.listsByID,
		activeListID: state.activeListID
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		reorderList: (id, order) => {
			dispatch(updateListOrder(id, order))
		}
	}
}

ListSwitcher = connect(mapStateToProps, mapDispatchToProps)(ListSwitcher)
export default ListSwitcher

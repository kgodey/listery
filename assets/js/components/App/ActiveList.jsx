import React from 'react'
import { connect } from 'react-redux'

import { getSortedListItems } from '../../reducers/index'
import ListHeader from './ActiveList/ListHeader.jsx'
import AddListItem from './ActiveList/AddListItem.jsx'
import ListItem from './ActiveList/ListItem.jsx'


let ActiveList = (props) => {
	return (
		<div className="col-md-8">
			<ListHeader />
			<div className='list-group'>
				<AddListItem />
				{props.sortedListItems.map(item =>
					<ListItem key={item.id} id={item.id} />
				)}
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		sortedListItems: getSortedListItems(state)
	}
}

ActiveList = connect(mapStateToProps, null)(ActiveList)
export default ActiveList

import React from 'react'
import { ListHeader } from './ActiveList/ListHeader.jsx'
import { AddListItem } from './ActiveList/AddListItem.jsx'
import { ListItem } from './ActiveList/ListItem.jsx'
import { saveListName } from '../../actions/ui.js'


export class ActiveList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {
				name: props.name
			},
			currentlyEditing: false
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleDoubleClick = this.handleDoubleClick.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleKeyUp = this.handleKeyUp.bind(this)
		this.handleBlur = this.handleBlur.bind(this)
		this.saveListName = this.saveListName.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.name !== this.state.data.name) {
			this.setState({
				data: {
					name: nextProps.name
				}
			});
		}
	}

	handleChange(event) {
		this.setState({
			data: {
				name: event.target.value
			}
		})
	}

	handleDoubleClick(event) {
		this.setState({currentlyEditing: true})
	}

	handleKeyUp(event) {
		if (event.key == 'Enter'){
			this.saveListName()
		}
	}

	handleBlur(event) {
		this.saveListName()
	}

	saveListName() {
		saveListName(this.props.id, this.state.data.name)
		this.setState({currentlyEditing: false})
	}

	render() {
		const items = this.props.items ? this.props.items : []
		return (
			<div>
				<ListHeader
					id={this.props.id}
					name={this.state.data.name}
					currentlyEditing={this.state.currentlyEditing}
					onChange={this.handleChange}
					onKeyUp={this.handleKeyUp}
					onBlur={this.handleBlur}
					onDoubleClick={this.handleDoubleClick}
				/>
				<div className='list-group'>
					<AddListItem listID={this.props.id} />
					{items.map(item =>
						<ListItem key={item.id} {...item}/>
					)}
				</div>
			</div>
		)
	}
}

import React from 'react'

import { ListTitle } from './ListHeader/ListTitle.jsx'
import { SharingButton } from './ListHeader/Buttons.jsx'
import { saveListName, saveListPrivacy } from '../../../actions/ui.js'


const rowStyle = {
	marginBottom: '10px'
}


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
		this.handleNameDoubleClick = this.handleNameDoubleClick.bind(this)
		this.handleNameChange = this.handleNameChange.bind(this)
		this.handleNameKeyUp = this.handleNameKeyUp.bind(this)
		this.handleNameBlur = this.handleNameBlur.bind(this)
		this.handlePrivacyButtonClick = this.handlePrivacyButtonClick.bind(this)
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

	handlePrivacyButtonClick(event) {
		saveListPrivacy(this.props.id, !this.props.private)
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
				<div className="row" style={rowStyle}>
					<div className="col-md-6">
						<SharingButton
							private={this.props.private}
							onClick={this.handlePrivacyButtonClick}
						/>
					</div>
				</div>
			</div>
		)
	}
}

import React from 'react'


export class ListItem extends React.Component {
	render() {
		return (
			<div className="list-group-item">
				<strong>{this.props.title}</strong><br/>
				{this.props.description}
			</div>
		);
	}
}

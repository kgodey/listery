import React from 'react'


const titleStyle = {
	width: '90%',
	display: 'inline-block'
}

const descriptionStyle = {
	marginTop: 0,
	paddingTop: 0
}


export class ListItem extends React.Component {
	render() {
		return (
			<div className="list-group-item">
				<div style={titleStyle}>{this.props.title}</div>
				<small><i><span style={descriptionStyle}>{this.props.description}</span></i></small>
			</div>
		);
	}
}

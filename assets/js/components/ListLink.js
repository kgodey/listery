import React from 'react'


const nameStyle = {
	display: 'inline-block'
}


export class ListLink extends React.Component {
	render() {
		return (
			<div className="list-group-item">
				<div style={nameStyle}>{this.props.name}</div>
			</div>
		);
	}
}


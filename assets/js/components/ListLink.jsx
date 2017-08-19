import React from 'react'


const nameStyle = {
	display: 'inline-block'
}


export class ListLink extends React.Component {
	render() {
		let className = 'list-group-item'
		if (this.props.activeList === true) {
			 className = className + ' active'
		}
		return (
			<div className={className}>
				<div style={nameStyle}>{this.props.name}</div>
			</div>
		);
	}
}


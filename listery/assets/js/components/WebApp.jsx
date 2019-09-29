import PropTypes from 'prop-types'
import React from 'react'
import SweetAlert from 'react-bootstrap-sweetalert'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { connect } from 'react-redux'

import { apiErrorDismissed } from '../actions/common'
import { getCurrentAPIError } from '../reducers/apiErrors.js'
import ActiveList from './WebApp/ActiveList.jsx'
import ListSwitcher from './WebApp/ListSwitcher.jsx'


const switcherStyle = {
	cursor: 'pointer'
}


class WebApp extends React.Component {
	constructor(props) {
		super(props)
		this.hideAlert = this.hideAlert.bind(this)
	}

	hideAlert(event) {
		const { apiErrorDismissed } = this.props
		apiErrorDismissed()
	}

	render() {
		const { currentError } = this.props
		return (
			<div className="container-fluid col-sm-10">
				<div className="row">
					<div className="col-sm-8 mt-3">
						<ActiveList />
					</div>
					<div className="col-sm-4 list-group mt-3" style={switcherStyle}>
						<ListSwitcher />
					</div>
				</div>
				<SweetAlert
					error
					title='Error!'
					show={currentError.isError}
					confirmBtnText='OK'
					confirmBtnBsStyle='primary'
					onConfirm={this.hideAlert}
				>
				{currentError.errorMessage}
				</SweetAlert>
			</div>
		)
	}
}

const mapStateToProps = (state, ownProps) => ({
	currentError: getCurrentAPIError(state)
})


WebApp.propTypes = {
	currentError: PropTypes.object.isRequired,
	apiErrorDismissed: PropTypes.func.isRequired
}


WebApp = connect(mapStateToProps, { apiErrorDismissed })(WebApp)
export default DragDropContext(HTML5Backend)(WebApp)

import { App, Statusbar, Panel, View, Page } from 'framework7-react'
import PropTypes from 'prop-types'
import React from 'react'
import { Provider } from 'react-redux'


class MobileApp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			f7params: {
				name: 'Listery', // App name
				theme: 'auto', // Automatic theme detection
				// Enable panel left visibility breakpoint
				panel: {
					leftBreakpoint: 960,
				},
			}
		}
	}
	
	render() {
		const { store } = this.props
		return (
			<Provider store={store}>
				<App params={ this.state.f7params }>
					<Statusbar></Statusbar>
					<Panel left cover themeDark>
						<View>
							<Page>
								{/* ALL LISTS */}
							</Page>
						</View>
					</Panel>
					<View main className="safe-areas">
						<Page>
							{/* ACTIVE LIST */}
						</Page>
					</View>
				</App>
			</Provider>
		)
	}
}


MobileApp.propTypes = {
	store: PropTypes.object.isRequired,
}


export default MobileApp

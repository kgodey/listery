import { App, Statusbar, Panel, View, Page, Navbar, NavRight, Link, BlockTitle } from 'framework7-react'
import PropTypes from 'prop-types'
import React from 'react'
import { Provider } from 'react-redux'

import ListSwitcher from './MobileApp/ListSwitcher.jsx'
import ActiveList from './MobileApp/ActiveList.jsx'


class MobileApp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			f7params: {
				name: 'Listery', // App name
				theme: 'auto', // Automatic theme detection
				// Enable panel left visibility breakpoint
				panel: {
					rightBreakpoint: 960,
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
					<View main className="safe-areas">
						<Page>
							<Navbar title={listeryTitle}>
								<NavRight>
									<Link iconF7="bars" panelOpen="right" title="Menu"></Link>
								</NavRight>
							</Navbar>
							<ActiveList />
						</Page>
					</View>
					<Panel right cover themeDark>
						<View>
							<Page>
								<BlockTitle>ALL LISTS</BlockTitle>
								<ListSwitcher />
							</Page>
						</View>
					</Panel>
				</App>
			</Provider>
		)
	}
}


MobileApp.propTypes = {
	store: PropTypes.object.isRequired,
}


export default MobileApp

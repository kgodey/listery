import { App, Statusbar, View, Page, Panel, BlockTitle } from 'framework7-react'
import PropTypes from 'prop-types'
import React from 'react'
import { Provider } from 'react-redux'

import ActiveList from './MobileApp/ActiveList.jsx'
import ListSwitcher from './MobileApp/ListSwitcher.jsx'


class MobileApp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			f7params: {
				name: 'Listery', // App name
				theme: 'auto', // Automatic theme detection
				// Enable panel right visibility breakpoint
				panel: {
					rightBreakpoint: 960,
				},
				routes: [
						{
							path: '/mobile/lists/:urlListID',
							component: ActiveList,
						},
						{
							path: '/mobile/',
							component: ActiveList,
						}
					],
			}
		}
	}
	
	render() {
		const { store } = this.props
		return (
			<Provider store={store}>
				<App params={ this.state.f7params }>
					<Statusbar></Statusbar>
					<View main className="safe-areas" stackPages={false} />
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

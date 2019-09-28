import React from 'react'
import { Checkbox } from '../components/App/ActiveList/ListItem/Checkbox.jsx'
import renderer from 'react-test-renderer'


test('Checkbox renders correctly', () => {
	const handleCheckboxClick = jest.fn()
	const component = renderer.create(
		<Checkbox checked={true} onClick={handleCheckboxClick} />
	)

	let tree = component.toJSON()
	expect(tree).toMatchSnapshot()
})

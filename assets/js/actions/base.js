import fetch from 'isomorphic-fetch'
import Cookie from 'js-cookie'


const checkStatus = (response) => {
	if (response.ok) {
		return response
	} else {
		var error = new Error(response.statusText)
		error.response = response
		throw error
	}
}


function parseJSON(response) {
	return response.json().catch(error => ({}))
}


export const sync = (url, params = {}) => {
	// Wraps fetch to add the parameters that DRF expects
	params.credentials = 'same-origin'
	params
	params.headers = {
		...params.headers,
		'X-CSRFToken': Cookie.get('csrftoken'),
		'Content-Type': 'application/json'
	}
	// Add timestamp to URL for browser cache-busting
	url = url + '?timestamp=' + Date.now()
	return fetch(url, params)
		.then(checkStatus)
		.then(parseJSON)
}

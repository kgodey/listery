import fetch from 'isomorphic-fetch'
import Cookie from 'js-cookie'


const checkStatus = (response) => {
	if (response.ok) {
		return response
	} else {
		let error = new Error(response.statusText)
		error.response = response
		throw error
	}
}


function parseJSON(response) {
	return response.json().catch(error => ({}))
}


function getNewParams(params) {
	// Adds the parameters that DRF expects
	params.credentials = 'same-origin'
	params.headers = {
		...params.headers,
		'X-CSRFToken': Cookie.get('csrftoken'),
		'Content-Type': 'application/json'
	}
	return params
}


function getNewURL(url) {
	// Add timestamp to URL for browser cache-busting
	return url + '?timestamp=' + Date.now()
}


export const sync = (url, params = {}) => {
	return fetch(getNewURL(url), getNewParams(params))
		.then(checkStatus)
		.then(parseJSON)
}


export const syncWithoutJSON = (url, params = {}) => {
	return fetch(getNewURL(url), getNewParams(params))
		.then(checkStatus)
}

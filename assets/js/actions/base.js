import fetch from 'isomorphic-fetch'
import Cookie from 'js-cookie'


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
	url = url + '?' + $.param({timestamp: Date.now()})
	return fetch(url, params)
}

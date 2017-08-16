import fetch from 'isomorphic-fetch'

export const REQUEST_LIST = 'REQUEST_LIST'
export const RECEIVE_LIST = 'RECEIVE_LIST'


const getCookie = (name) => {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}


const requestList = (id) => {
	return {
		type: REQUEST_LIST,
		id
	}
}

const receiveList = (id, json) => {
	return {
		type: RECEIVE_LIST,
		id,
		json
	}
}

// TODO: remove hardcoded ID
export const fetchList = (id = 6) => {
	return function (dispatch) {
		dispatch(requestList('id'));
		return fetch(
			'/api/v1/lists/' + id + '/', {
				credentials: 'same-origin',
				headers: {
					'X-CSRFToken': getCookie('csrftoken')
				}
			}
		).then(
			response => response.json()
		).then(
			json => dispatch(receiveList(id, json))
		)
	}
}

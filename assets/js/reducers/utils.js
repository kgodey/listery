export const compareByOrder = (listA, listB) => {
	if (listA.order < listB.order)
		return -1
	if (listA.order > listB.order)
		return 1
	return 0
}


export const getReorderedItems = (state, action) => {
	let newState = {...state}
	let oldOrder = newState[action.id].order
	newState[action.id].order = action.order
	if (action.order > oldOrder) {
		for (var key in newState) {
			if (newState[key].order <= action.order && newState[key].order > oldOrder && newState[key].id != action.id) {
				newState[key].order = newState[key].order - 1
			}
		}
	} else if (action.order < oldOrder) {
		for (var key in newState) {
			if (newState[key].order >= action.order && newState[key].order < oldOrder && newState[key].id != action.id) {
				newState[key].order = newState[key].order + 1
			}
		}
	}
	return newState
}


export const addItemToTop = (newState, itemID) => {
	newState[itemID].order == 1
	for (var key in newState) {
		if (key != itemID) {
			newState[key].order++
		}
	}
	return newState
}

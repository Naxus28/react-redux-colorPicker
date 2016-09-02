//action types
const SLIDER   = 'SLIDER';
const SLIDER_ONE   = 'SLIDER_TWO';
const SLIDER_TWO = 'SLIDER_THREE';

//action
const slide = (sliderNumber, value) => {
	return {
		type: sliderNumber,
		value,
		id
	}
}

//reducer
let id;
const sliderApp = (state={}, action) => {

	switch(action.type){
		
		case SLIDER:
			return {id: 0,
				...state,
				action.value
			}

		case SLIDER_ONE:
		return {1,
				...state,
				action.value
			}
		case SLIDER_TWO:
			return {2,
				...state,
				action.value
			}

		default:
			return state;
	}
}

//store
const { createStore } = Redux;

const store = createStore(sliderApp);

//react component function--returns obj
const { Component } = React;

//provider method--exposes the store to children and grandchildren
const { Provider } = ReactRedux;

//provides the 3 redux methods to the component passed as 2nd argument to the function
const { connect } = ReactRedux;

store.dispatch(slide(SLIDER, 10))

store.dispatch(slide(SLIDER_ONE, 10))

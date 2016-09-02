/*-------------------
   Action Types
--------------------*/

//set box color
const SET_BOX_COLOR = 'SET_BOX_COLOR';

//set background color
const SET_BACKGROUND = 'SET_BACKGROUND';


/*-------------------
   Other Constants
--------------------*/
//color channels array
const COLOR_CHANNEL = ['red', 'green', 'blue'];


/*-------------------
   Action Creators
--------------------*/
//inputs action
const setBoxColor = (value, index) => {
	return {
		type: SET_BOX_COLOR,
		value,
		index
	}
}
//buttons action
const setBackground = (backGroundColor) => {
	return {
		type: SET_BACKGROUND,
		backGroundColor
	}
}


/*-------------------
   Reducers
--------------------*/
//box color reducer
const boxColor = (state=[0,0,0], action) => {

	switch(action.type){
		
		case SET_BOX_COLOR:
			return [
				...state.slice(0, action.index),
				action.value,
				...state.slice(action.index+1, state.length)
			];

		default:
			return state;
	}
}

//background color reducer
const backGroundColor = (state='rgb(255, 255, 255)', action) => {

	switch(action.type){
		
		case SET_BACKGROUND:
			return action.backGroundColor;

		default:
			return state;
	}
}


/*-------------------
 Redux/React Methods
--------------------*/
//store
const { createStore } = Redux;

//combine reducers
const { combineReducers } = Redux;

const colorApp = combineReducers({
	boxColor,
	backGroundColor
});

//provider method--wrap it around controller container to expose the store to children and grandchildren
const { Provider } = ReactRedux;

//function--provides the 3 redux methods to the component passed as 2nd argument to this function
const { connect } = ReactRedux;

/*-----------------------------REACT COMPONENTS START-----------------------------*/

/*---------------------------------
 Header Presentational Component
----------------------------------*/
const Header = () => (
	<div className='header'>
		<h1>Color Picker App</h1>
		<p>This app allows you to: </p>
		<ol>
			<li>Enter an RGB code and see the resulting color in the box</li>
			<li>Use the sliders to change the color in the box</li>
			<li>Set/unset background color</li>
		</ol>
	</div>
);


/*-------------------------------------
 Inputs Validator--Helper Function
--------------------------------------*/
const validateInput = (input) => {
	if ( isNaN(parseInt(input))) {
		alert('Please enter a number');
		return input=0;
	}
	
  if (input>255){
		alert('Enter a number smaller than 255');
		return input=0;
	} else {
		return input;
	}
};


/*-------------------------------------
 Input Presentational Component
--------------------------------------*/
const Input = ({
	colorChannel,
	value,
	onChange
}) => {
	let input=0;
	return(
		<div>
			<label>{colorChannel}</label>
			<input 
				value={value}
				type="text"
				ref={node => {
					input=node;
				}} 
				onChange={()=> 
					onChange(input.value)}/>
		</div>
	)
};


/*-------------------------------------
 Input List Container-resentational Component
--------------------------------------*/
let ColorInputList = ({
	state,
	onInput
}) => (
	<div className='inputFields'>
		{state.boxColor.map((input, index) => 
			<Input 
				onChange={inputVal => {
					inputVal=validateInput(inputVal)
					onInput(inputVal, index)
				}}
				key={index}
				value={input}
				colorChannel={COLOR_CHANNEL[index]}/>
		)}
	</div>
);

/*-------------------------------------
Inputs Container Component
--------------------------------------*/
const mapColorStateToProps = (state) => {
	return{
		state
	}
}
const mapColorDispatchToProps = (dispatch) => {
	return{
		onInput:(input, index) => {
			dispatch(
				setBoxColor(input, index)
			);
		}
	}
}
ColorInputList = connect(
	mapColorStateToProps,
	mapColorDispatchToProps
)(ColorInputList);


/*--------------------------------------------
 Slider (input range) Presentational Component
---------------------------------------------*/
const Slider = ({
	state, 
	onChange,
	colorChannel
}) => {
	let input=0;
	return(
		<div className='sliders'>
			<label>{colorChannel}</label>
			<input 
				type="range" 
				min='0'
				max='255'
				value={state}
				ref={node => {
					input=node;
				}} 
				onChange={()=> 
					onChange(input.value)}/>
			<span>{state}</span>
		</div>
	);
}

/*------------------------------------------
 Sliders  Container-Presentational Component
--------------------------------------------*/
//passing unique 'indexes' so I can use "connect's" map methods below and get the right slider
let Sliders = ({
	state, 
	onSlider
}) => (
	<div>
		<div>
			<ul style={{paddingLeft: '0'}}>
				{state.boxColor.map((slider, index) => 
					<Slider 
						key={index}
						state={state.boxColor[index]}
						colorChannel={COLOR_CHANNEL[index]}
						onChange={input=> 
							onSlider(input, index)
						}/>
				)}
			</ul>	
		</div>
	</div>
);

const mapStateToProps = (state) => {
	return{
		state
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onSlider: (input, index) => {
			dispatch(
				setBoxColor(input, index)
			);
		}
	}
}
Sliders = connect(
	mapStateToProps,
	mapDispatchToProps
)(Sliders);


/*-------------------------------------------
 Color Box Container-Presentational Component
--------------------------------------------*/
let ColorBox = ({
	color
}) => (
	<div className="colorBox">
		<div style={{width: '140', height: '100', 
					marginTop: '10px', border: '1px solid black', 
					background: color}}>
		</div>
		<p>RGB color code: {color}</p>
	</div>
	
);
const mapStateToColorProps = (state) => {
	return{
		color: 'rgb('+ state.boxColor[0] +', '
					 + state.boxColor[1] +', '
					 + state.boxColor[2] +')'
	}
}
ColorBox = connect(
	mapStateToColorProps
)(ColorBox);


/*------------------------------------------
 Buttons Container-Presentational Component
-------------------------------------------*/
let Buttons = ({
	state, 
	dispatch
}) => (
	<div>
		<button 
			onClick={()	=> {
				dispatch(
					setBackground(
					'rgb('+state.boxColor[0]+','
						  +state.boxColor[1]+','
						  +state.boxColor[2]+')'
					)
				);
			}}
			className='backgrounColordButtons'
		>
			Set Background
		</button>
		<button 
			onClick={()	=> {
				dispatch(
					setBackground('rgb(255,255,255)')
				);
			}}
			className='backgrounColordButtons'
		>
			Unset Background
		</button>
		
	</div>
);
const mapStateToButtonProps = (state) => {
	return{
		state
	}
}
Buttons = connect(
	mapStateToButtonProps
)(Buttons);


/*--------------------------------------------
 AppWrapper Container-Presentational Component
----------------------------------------------*/
let AppWrapper = ({
	state
}) => (
	<div 
		className="appWrapper"
		style={{ background: state.backGroundColor }}>
		<Header />
		<ColorInputList />
		<Sliders />
		<ColorBox />
		<Buttons />
	</div>
);
const mapBackgroundStateToProps = (state) => {
	return{
		state
	}
}
AppWrapper = connect(
	mapBackgroundStateToProps
)(AppWrapper);

/*-----------------------------------
 Controller Component
------------------------------------*/
const SliderApp = () => {
	return(
		<AppWrapper />	
	);
}


/*-----------------------------------
 React Render Method
------------------------------------*/
ReactDOM.render(
	<Provider store={createStore(colorApp)}>
		<SliderApp />
	</Provider>,
	document.getElementById('root')
);


/*-----------------------------EOF-----------------------------*/

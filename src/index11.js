import React from 'react';
import ReactDOM from 'react-dom';

class Clock extends React.Component{
	constructor(props){
		super(props);
		this.state = {date: new Date()};
	}

	componentDidMount(){
		this.timerID = setInterval(
			() => this.tick(),
			1000
			);
	}

	componentWillUnmount(){
		clearInterval(this.timerID);
	}

	tick(){
		this.setState({
			date: new Date()
		});
	}

	render(){
		return(
			<div>
			<h1>Hello</h1>
			<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
		</div>
		);
	}
}

class Toggle extends React.Component{
	constructor(props){
		super(props);
		this.state = {isToggleOn: true};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(){
		this.setState(prevState => ({
			isToggleOn: !prevState.isToggleOn
		}));
	}

	render(){
		return(
		<button onClick={this.handleClick}>
			{this.state.isToggleOn ? 'ON' : 'OFF'}
		</button>
		)
	}
}

	function Mailbox(props){
		const unreadMessages = props.unreadMessages;
		return(
		<div>
			<h1>Hello</h1>
			{unreadMessages.length > 0 &&
				<h2>
					You have {unreadMessages.length} unread messages.
				</h2>
			}
		</div>
		)
	}

	const messages = ['Msg 1', 'Msg 2', 'Msg 1', 'Msg 2'];


	function NumberList(props){
		const numbers = props.numbers;
		const listItems = numbers.map((number) => 
								<li key={number.toString()}>
									{number}
								</li>
								);



		return (
			<ul>{listItems}</ul>
		);
	}

	const numbers = [1,2,3,4,5];

	class NameForm extends React.Component{
		constructor(props){
			super(props);
			this.state = {value: 'monu'};
			this.handleChange = this.handleChange.bind(this);
			this.handleChange = this.handleSubmit.bind(this);
		}

		handleChange(event){
			this.setState({value: event.target.value.toUpperCase()});
		}

		handleSubmit(event){
			alert('A name was submitted: '+ this.state.value);
			event.preventDefault();
		}

		render(){
			return(
				<form onSubmit={this.handleSubmit}>
					<label>
						Name:
						<input type="text" value={this.state.value} onChange={this.handleChange} />
					</label>
					<input type="submit" value="Submit" />
				</form>
			);
		}

	}

	class FlavorForm extends React.Component{
		constructor(props){
			super(props);
			this.state ={value: ''};
			this.handleChange = this.handleChange.bind(this);
			this.handleChange = this.handleSubmit.bind(this);
		}

		handleChange(event){
			this.setState({value: event.target.value.toUpperCase()});
		}

		handleSubmit(event){
			alert('Your favorite flavor is: '+ this.state.value);
			event.preventDefault();
		}

		render(){
			return(
				<form onSubmit={this.handleSubmit}>
					<label>
						Pick your favorite flavor:
						<select value={this.state.value} onChange={this.handleChange}>
							<option value="grapefruit">Graperfruit</option>
							<option value="lime">Lime</option>
							<option value="coconut">Coconut</option>
							<option value="mango">Mango</option>
						</select>
					</label>
					<input type="submit" value="Submit" />
				</form>
			);
		}
	}


	ReactDOM.render(
	<FlavorForm   />,
	  document.getElementById('root')
	);

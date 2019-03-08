import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import App from './components/App';
import ResourcesList from './components/ResourcesList';
import User from './components/User';



const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const Index = () => (
  <div>
    <h1>Welcome to the Tornadoes Website!</h1>
  </div>
);

class Frameworks extends React.Component{
	render(){
		return(
				<div >
					<h2>Competency Frameworks</h2>

					<ResourcesList />
				</div>
			);
	}
}


class FrameworksList extends React.Component{

	constructor(props){
		super(props);
		this.state = {data: []};
	}
  

	componentDidMount()
	{
		fetch('http://drupal8/api/frameworks')
		.then((Response)=>Response.json())
		.then((findresponse)=>
		{
			this.setState({
				data:findresponse,
			})
		})
	}

	render(){
		let data = this.state.data;

		return(
			<div>
				<div className="row">
				{
					data.map((item, id) =>
						<div key={id} className="small-4 large-4 columns ">
							<div className="callout">
								<img src={"http://drupal8"+item.field_logo}/>
								<p>{item.title}</p>
							</div>
						</div>		
						)			
				}
				</div>
			</div>
		);
	}
}



ReactDOM.render((
  <BrowserRouter>
    		<App />
  </BrowserRouter>
), document.getElementById('root'));

ReactDOM.render((
    <BrowserRouter>
        <User />
    </BrowserRouter>
), document.getElementById('userarea'));

export default Index
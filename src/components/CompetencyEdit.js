import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Collapsible from 'react-collapsible'
import ReactModal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CompetencyList from './CompetencyList';

class CompetencyEdit extends React.Component{
	constructor(props){
		super(props);
		this.state = {data: [], competencyID:'', competencyUUID:'', competencyTitle:''};
		
	}

	componentDidMount(){

		this.setState({competencyID:this.props.competencyID, competencyUUID:this.props.competencyID, competencyTitle:this.props.competencyTitle  })
	}

	editCompetency(e){



		let title = this.refs.title.value;
		alert(title);
		fetch('http://dev-competency-mapper.pantheonsite.io/node/'+this.state.competencyID+'?_format=hal_json', { 
		  method: 'PATCH',
		  'cookies': 'x-access-token' ,
		  headers: {
		    'Accept': 'application/hal+json',
		    'Content-Type': 'application/hal+json',
		    'X-CSRF-Token': 'x58R-oBZjPtwULWgjmJzzGOEglWKnZSsE7wKgY4788M',
		    'Authorization': 'Basic',
		  },
		  body: JSON.stringify({
				  "_links":{
				    "type":{
				      "href":"http://dev-competency-mapper.pantheonsite.io/rest/type/node/competency" 
				    }
				  },
				  "title":[
				    {
				      "value": title
				    }
				  ],
				  "type":[
				    {
				      "target_id": "competency"
				  	}
				   ]
		  		})
			});

		e.preventDefault();
		}

		handleChange(e){
			this.setState({competencyTitle:this.refs.title.value});
		}

		render() {
		    return (
		    	<div>
			    	<form onSubmit={this.editCompetency.bind(this)}>
				      	<div className="row">
				    	    <div className="column large-11">
				      			<input type="text" value={this.state.competencyTitle} ref="title" onChange={this.handleChange.bind(this)}/>
				      		</div>
			      			<div className="column large-1">
								<input type="submit" className="button" value="Submit" /> 
			      			</div>
			      		</div>
				      </form> 
				</div>
		        
		    )
		}

}



export default CompetencyEdit;
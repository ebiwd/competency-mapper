import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Collapsible from 'react-collapsible'
import ReactModal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CompetencyList from './CompetencyList';

class CompetencyCreate extends React.Component{
	constructor(props){
		super(props);
		this.state = {data: []};
		alert("hello");
	}

  
	componentDidMount()
	{


	}

	createCompetency(e){
		var title = this.props.title;
		fetch('http://dev-competency-mapper.pantheonsite.io/node?_format=hal_json', { 
		  method: 'POST',
		  'cookies': 'x-access-token' ,
		  headers: {
		    'Accept': 'application/hal+json',
		    'Content-Type': 'application/hal+json',
		    'X-CSRF-Token': 'qtgkEDSxFRumXjRFOaTOkK9Rlp7SrHUcXpA_2KntFLg',
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
/*				  "field_competency_framework":[
				    {
				      "value": 54
				    }
				  ],*/
				  "type":[
				    {
				      "target_id": "competency"
				  	}
				   ]
		  		})
			})
		}

		render() {
		    return (
		        <CompetencyList title ={this.createCompetency } />
		    )
		}

}



export default CompetencyCreate;
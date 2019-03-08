import React from 'react'
import { Switch, Route } from 'react-router-dom'
import CompetencyList from './CompetencyList';
import { Line, Circle } from 'rc-progress';
import 'rc-progress/assets/index.css';
import ReactModal from 'react-modal';

class CompetencyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {values: [''], selectedDomainID:0, 'defaultValue':'Select domain', formSubmitted:false, domainAlert:false};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
   	this.handleCloseForm = this.handleCloseForm.bind(this);
   	this.handleShowForm = this.handleShowForm.bind(this);

  }
  
  createUI(){
     return this.state.values.map((el, i) => {
        if(i==0){
         	return <div key={i} className="row">
	    	    <div className="column large-9"><input type="text" required placeholder="Competency description" value={el||''} onChange={this.handleChange.bind(this, i)} /></div>
	    	</div>
		    }else{
		    	return <div key={i} className="row">
	    	    <div className="column large-9"><input type="text" required placeholder="Competency description" value={el||''} onChange={this.handleChange.bind(this, i)} /></div>
				<div className="column large-3"><a type='button' className="button" onClick={this.removeClick.bind(this, i)}> <i className="icon icon-functional" data-icon="x"></i></a></div>	    		
	    	</div>
		    }
        }
     )
  }
  handleCloseForm () {
    this.setState({ showModal: false });
    
  }

  handleShowForm(){
  	this.setState({formSubmitted:false});
  }

  handleChange(i, event) {
     let values = [...this.state.values];
     values[i] = event.target.value;
     this.setState({ values });
  }
  
  addClick(){
    this.setState(prevState => ({ values: [...prevState.values, '']}))
  }
  
  removeClick(i){
     let values = [...this.state.values];
     values.splice(i,1);
     this.setState({ values });
  }
  
  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.values.join(', '));
    //alert('Supplied value is: '+ this.props.temp + ' internal values are :' + this.state.values.join(', '));
    	var domainID = this.state.selectedDomainID;
    	if(!domainID){
			//alert('Please select a domain'+domainID);
			this.setState({domainAlert:true});
		}else{
    	var competencies = [];
		competencies = this.state.values;
		var domainUUID = this.refs.domain_ref.value;
		
			for(var i=0; i<competencies.length; i++){
		 		fetch('http://dev-competency-mapper.pantheonsite.io/node?_format=hal_json', { 
						  method: 'POST',
						  'cookies': 'x-access-token' ,
						  headers: {
						    'Accept': 'application/hal+json',
						    'Content-Type': 'application/hal+json',
						    'X-CSRF-Token': 'O1YI90dygefMwzYqQbEavAs7poklc9lLXCL8MwXYdaQ',
						    'Authorization': 'Basic',
						  },
						  body: JSON.stringify(
							  		{
									  "_links":{
									    "type":{
									      "href":"http://dev-competency-mapper.pantheonsite.io/rest/type/node/competency" 
									    },
									    "http://dev-competency-mapper.pantheonsite.io/rest/relation/node/competency/field_domain": {
									       "href": "http://dev-competency-mapper.pantheonsite.io/node/"+domainID+"?_format=hal_json"
									    }
									  },
									  "title":[
									    {
									      "value":competencies[i]
									    }
									  ],
									  "type":[
									    {
									      "target_id": "competency"
									  	}
									   ],
									   
									   "_embedded": {
									      "http://dev-competency-mapper.pantheonsite.io/rest/relation/node/competency/field_domain": [
									        {
									          "_links": {
									            "self": {
									              "href": "http://dev-competency-mapper.pantheonsite.io/node/"+domainID+"?_format=hal_json"
									            },
									            "type": {
									              "href": "http://dev-competency-mapper.pantheonsite.io/rest/type/node/domain"
									            }
									          },
									          "uuid": [
									            {
									              "value": domainUUID //"b20064ef-5cbf-4147-90f8-08e7a6693e17"
									            }
									          ],
									          "lang": "en"
									        }
									      ]
									    }
									}
								)
							})
			 			}
			 			this.setState({formSubmitted:competencies.length});
			 			this.setState({values:['']});
					}
	
    			event.preventDefault();

    
  		}

  onSelectChange(e){
  	this.setState({domainAlert:false});
  	var index = e.target.selectedIndex;
  	var optionElement = e.target.childNodes[index]
  	var option =  optionElement.getAttribute('data-id');
  	this.setState({ selectedDomainID: option});
  	this.setState({defaultValue: optionElement.value});

  }

  render() {
  		if(!this.state.formSubmitted){
		    return (
		      	<div style={{'position':'relative'}}>
				    <form onSubmit={this.handleSubmit}>
			      	<div className="row">
			    	    <div className="column large-9">
			    	    	<h4>Framework: {this.props.frameworkName}</h4>
			    	    	{this.state.domainAlert? <div> <span style={{'color':'red'}}>Please select domain </span> <i class="far fa-frown"> </i></div> :''}
			      			<select ref="domain_ref" id="select_domain" value={this.state.defaultValue} onChange={this.onSelectChange.bind(this)}>
			      				<option data-id="null" value="Select domain" disabled>Select domain</option>
			      				{this.props.domainsOptions}
			      			</select>
			      			
			      		</div>
		      			<div className="column large-3"></div>
		      		</div>

			          {this.createUI()}
			        <div className="row">
			    	    <div className="column large-9">
				          <a type='button' className="button" value='add more' onClick={this.addClick.bind(this)}> <i className="fas fa-plus-circle"></i>  Add more </a> <br/>
				          <input type="submit" className="button" value="Submit" /> 
				        </div>
				        <div className="column large-3"></div>
				    </div>
			      </form> 
			    </div>
			
		    );
		}else{
			return <div className='callout'> {this.state.formSubmitted} record(s) created.    <a className="readmore"  onClick={this.handleShowForm.bind(this)}> Add more records </a> </div>
		}
	}
}

export default CompetencyForm

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Collapsible from 'react-collapsible'
import ReactModal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CompetencyList from './CompetencyList';
import InlineEdit from 'react-edit-inline';
const $ = window.$;
let flag=false;

class ManageCompetency extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			data: [], 
			path: this.props.location.pathname.split("/"),
			csrf:'',
			domainID:'', 
			domainUUID:'',
			selectedDomainID:'',
			selectDefaultValue:'Select domain',
			domainAlert:false,
			selectedCompetency:'',
			updateFlag:'',
            roles:'',
		};
		this.dataChanged = this.dataChanged.bind(this);
		this.onSelectChange = this.onSelectChange.bind(this);
		this.archiveHandle = this.archiveHandle.bind(this);
		
	}

    /*shouldComponentUpdate(nextProps, nextState) {
        return this.state.data != nextState.data;
    }*/

	componentDidUpdate(prevProps, prevState){
		if(this.state.updateFlag){
        		this.fetchData();
				setTimeout(() => {
                this.setState({'updateFlag': false})
            },1000);
                console.log("componentDidUpdate");

		}
	}


	componentDidMount(){
		this.fetchData();
        if(localStorage.getItem('roles')){
            this.setState({roles:localStorage.getItem('roles')})
        }
        this.checkUser();
	}

	fetchData(){
		let framework = this.state.path[2].toLowerCase();
		let fetchCompetencyList = "https://dev-competency-mapper.pantheonsite.io/api/v1/framework/"+framework+"?_format=json";
		fetch(fetchCompetencyList)
		.then((Response)=>Response.json())
		.then((findresponse)=>
		{
			this.setState({
				data:findresponse,
				
			})
		});
	}

	handleSubmit(event) {

		let token = localStorage.getItem('csrf_token');
    	let domainID = this.state.selectedDomainID;
 		let title = this.refs.title.value;
		let domainUUID = this.refs.domain_ref.value;
		
		 		fetch('https://dev-competency-mapper.pantheonsite.io/node?_format=hal_json', {
                    credentials: 'include',
						  method: 'POST',
						  headers: {
                              'X-CSRF-Token': token,
                              'Accept': 'application/hal+json',
                              'Content-Type': 'application/hal+json',

						  },
						  body: JSON.stringify(
							  		{
									  "_links":{
									    "type":{
									      "href":"https://dev-competency-mapper.pantheonsite.io/rest/type/node/competency"
									    },
									    "https://dev-competency-mapper.pantheonsite.io/rest/relation/node/competency/field_domain": {
									       "href": "https://dev-competency-mapper.pantheonsite.io/node/"+domainID+"?_format=hal_json"
									    },
                                          "https://dev-competency-mapper.pantheonsite.io/rest/relation/node/competency/uid": {
                                              "href": "https://dev-competency-mapper.pantheonsite.io/user/1?_format=hal_json"
                                          },
									  },
									  "title":[
									    {
									      "value":title
									    }
									  ],
									  "type":[
									    {
									      "target_id": "competency"
									  	}
									   ],
									   
									   "_embedded": {
									      "https://dev-competency-mapper.pantheonsite.io/rest/relation/node/competency/field_domain": [
									        {
									          "_links": {
									            "self": {
									              "href": "https://dev-competency-mapper.pantheonsite.io/node/"+domainID+"?_format=hal_json"
									            },
									            "type": {
									              "href": "https://dev-competency-mapper.pantheonsite.io/rest/type/node/domain"
									            }
									          },
									          "uuid": [
									            {
									              "value": domainUUID
									            }
									          ],
									          "lang": "en"
									        }
									      ],
                                           "https://dev-competency-mapper.pantheonsite.io/rest/relation/node/competency/uid": [
                                               {
                                                   "_links": {
                                                       "self": {
                                                           "href": "https://dev-competency-mapper.pantheonsite.io/user/1?_format=hal_json"
                                                       },
                                                       "type": {
                                                           "href": "https://dev-competency-mapper.pantheonsite.io/rest/type/user/user"
                                                       }
                                                   },
                                                   "uuid": [
                                                       {
                                                           "value": "a6a85d5c-1fd9-4324-ab73-fdc27987d8cc"
                                                       }
                                                   ],
                                                   "lang": "en"
                                               }
                                           ],
									    }
									}
								)
							});
			 			this.refs.title.value='';

					this.setState({updateFlag: true});

    			event.preventDefault();
  		}

  		dataChanged(e){
  			let title = e["message"];
  			let cid = this.state.selectedCompetency;
  			let token = localStorage.getItem('csrf_token');
  			//alert(cid);
			fetch('https://dev-competency-mapper.pantheonsite.io/node/'+cid+'?_format=hal_json', {
                credentials: 'include',
			  method: 'PATCH',
			  'cookies': 'x-access-token' ,
			  headers: {
			    'Accept': 'application/hal+json',
			    'Content-Type': 'application/hal+json',
			    'X-CSRF-Token': token,
			    'Authorization': 'Basic',
			  },
			  body: JSON.stringify({
					  "_links":{
					    "type":{
					      "href":"https://dev-competency-mapper.pantheonsite.io/rest/type/node/competency"
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
			this.setState({'updateFlag':true});
  		}

  		selectedCompetency(id){
  			this.setState({selectedCompetency:id})
  		}

  	archiveHandle(cid, status, event){
		//alert("competency "+ cid+ "is "+ status);
		let archivedStatus = '';
		if(status ===1){
			archivedStatus = false;
		}else{
			archivedStatus = true;
		}
        let token = localStorage.getItem('csrf_token');
        fetch('https://dev-competency-mapper.pantheonsite.io/node/'+cid+'?_format=hal_json', {
            credentials: 'include',
            method: 'PATCH',
            'cookies': 'x-access-token' ,
            headers: {
                'Accept': 'application/hal+json',
                'Content-Type': 'application/hal+json',
                'X-CSRF-Token': token,
                'Authorization': 'Basic',
            },
            body: JSON.stringify({
                "_links":{
                    "type":{
                        "href":"https://dev-competency-mapper.pantheonsite.io/rest/type/node/competency"
                    }
                },
                "field_archived":[
                    {
                        "value": archivedStatus
                    }
                ],
                "type":[
                    {
                        "target_id": "competency"
                    }
                ]
            })
        });

        this.setState({'updateFlag':true});

		event.preventDefault();
	}
  	onSelectChange(e){
	  	this.setState({domainAlert:false});
	  	let index = e.target.selectedIndex;
	  	let optionElement = e.target.childNodes[index];
	  	let option =  optionElement.getAttribute('data-id');
	  	this.setState({selectedDomainID: option});
	  	//this.setState({selectDefaultValue: optionElement.value});
        //this.setState({selectDefaultValue: optionElement.value});
		//console.log(this.state.selectDefaultValue);

	  }

    checkUser(){
        if(!localStorage.getItem('roles')){
            this.props.history.push("/");
        }else if(!localStorage.getItem('roles').includes('framework_manager')){
            alert("You are not authorised to access this page. Contact the administrator");
            this.props.history.push("/");
        }
        console.log(localStorage.getItem('roles'))
    }

	render() {
        this.checkUser();
        console.log("render");
		let competencies= '';
		let domainUUID = '';
		let domainsOptions = [];
		let framework = this.state.path[2];

		{this.state.data.map((item)=>
									item.domains.map((domain)=>
											{
												domainsOptions.push(<option key={domain.uuid} data-id={domain.nid} value={domain.uuid}>{domain.title}</option>);
											}

										)
								)}

		 competencies = this.state.data.map((item)=>
									item.domains.map((domain, did)=>
										<tbody key={item.nid+domain.nid} >
											<tr key={domain.nid} className="white-color secondary-background"><td></td><td>{did+1}</td><td><h4>{domain.title}</h4></td>
												<td>Archive?</td><td>Manage attributes</td>
											</tr>
											{
												domain.competencies.map((competency, cid)=>
													<tr key={competency.id}>
														<td><i className="fas fa-arrows-alt position-icon"></i> </td>
														<td>{did+1}.{cid+1}</td>
														<td className="tooltip-td" onClick={this.selectedCompetency.bind(this, competency.id )}>

															<InlineEdit text={competency.title}  data-id="12" staticElement="div" paramName="message" change={this.dataChanged.bind(this)}
																style={{
																	display: 'inline-block', margin: 0,
												                	padding: 10, border: 1, width:'100%', 'fontSize':'120%'
												              		}}
															/> <span style={{'float':'right', 'position':'relative', 'fontSize':'12px'}}><strong> {competency.archived?'[Archived]':''}</strong></span>

														</td>
														<td>
															{competency.archived===1? <a href="#" onClick={this.archiveHandle.bind(this, competency.id, 1)}>  <i className="fas fa-toggle-on"></i></a> : <a href="#" onClick={this.archiveHandle.bind(this, competency.id, 0)}>	<i className="fas fa-toggle-off"></i></a> }
														</td>
														<td><a href={process.env.PUBLIC_URL+"/#/framework/"+framework.toLowerCase()+"/manage/competencies/"+ competency.id+"/manage-attributes"}>   <i className="fas fa-sitemap"></i>  </a> </td>
													</tr>
											)
										}
										</tbody>
										)
									);

	    return (

	    	<div>
                        <h2>Manage Framework - {framework.toUpperCase()} </h2>

                        <div className="row">
                            <div className="column large-12 callout">
                                <h4>Create new competency</h4>
                                <form className="form" onSubmit={this.handleSubmit.bind(this)}>
                                    <div className="row">
                                        <div className="column large-7">
                                            <input type="text" ref="title" required
                                                   placeholder="Enter competency description"/>
                                        </div>
                                        <div className="column large-3">
                                            <select ref="domain_ref" id="select_domain"

                                                    onChange={this.onSelectChange.bind(this)}>
                                                {/*<option data-id="null" value="Select domain" disabled>Select domain
                                                </option>*/}
                                                {domainsOptions}
                                            </select>
                                            {this.state.domainAlert ?
                                                <div><span style={{'color': 'red'}}>Please select domain </span> <i
                                                    className="far fa-frown"> </i></div> : ''}
                                        </div>
                                        <div className="column large-2">
                                            <input type="submit" className="button" value="Create new"/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="row">
                            <div className="column large-12">
                                <table>
                                    {competencies}
                                </table>
                            </div>
                        </div>


            </div>
	    )

	}

}

const ManageCompetencies = () => (
  <Switch>
    <Route exact path='/framework/:name/manage/competencies' component={ManageCompetency} />
  </Switch>
)

export default ManageCompetencies;
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import InlineEdit from 'react-edit-inline';

class ManageAttribute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	valuesAttribute: '', 
    	attributeTypeID: '', 
    	attributeTypeUUID:'', 
    	selectedAttributeType:0,
    	data: [],
		csrf:'',
		path: this.props.location.pathname.split("/"),
		frameworkDetails:[],
		selectedCompetencyUUID:'',
		selectedCompetencyTitle:'',
		selectedAttribute:'',
		
    };
    this.handleSubmit = this.handleSubmit.bind(this);
      this.archiveHandle = this.archiveHandle.bind(this);
  }

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
	}


	fetchData(){
        let csrfURL = "https://dev-competency-mapper.pantheonsite.io/rest/session/token";
        fetch(csrfURL)
            .then((Response)=>Response)
            .then((findresponse2)=>{
                this.setState({csrf: findresponse2})
            });

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

		let fetchFrameworkDetails = "https://dev-competency-mapper.pantheonsite.io/api/v1/framework?_format=json";
		fetch(fetchFrameworkDetails)
		.then((Response)=>Response.json())
		.then((findresponse1)=>
		{
			this.setState({
				frameworkDetails:findresponse1,

			})
		});

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

  
  handleSubmit(event) {
      	let token = localStorage.getItem('csrf_token');
		let attributes = this.state.valuesAttribute;
		let attributeTypes = this.state.valuesType;

		let competencyID = this.state.path[5];
		let competecyUUID = this.state.selectedCompetencyUUID;
				
		let attributeTypeID = '';
		let attributeTypeUUID = '';

		attributeTypeID = this.state.attributeTypeID;//this.state.attributeTypeUUID;//
		attributeTypeUUID = this.refs.attr_ref.value;

		let title = this.refs.title.value;

				fetch('https://dev-competency-mapper.pantheonsite.io/node?_format=hal_json', {
                    credentials: 'include',
				  method: 'POST',
				  'cookies': 'x-access-token' ,
				  headers: {
				    'Accept': 'application/hal+json',
				    'Content-Type': 'application/hal+json',
				    'X-CSRF-Token': token,
				    'Authorization': 'Basic',
				  },
				  body: JSON.stringify(
					  		{
							  "_links":{
							    "type":{
							      "href":"https://dev-competency-mapper.pantheonsite.io/rest/type/node/attribute"
							    },
							    "https://dev-competency-mapper.pantheonsite.io/rest/relation/node/attribute/field_competency": {
							       "href": "https://dev-competency-mapper.pantheonsite.io/node/"+competencyID+"?_format=hal_json"
							    },
							    "https://dev-competency-mapper.pantheonsite.io/rest/relation/node/attribute/field_attribute_type": {
							       "href": "https://dev-competency-mapper.pantheonsite.io/node/"+attributeTypeID+"?_format=hal_json"
							    }

							  },
							  "title":[
							    {
							      "value": title
							    }
							  ],
							  "type":[
							    {
							      "target_id": "attribute"
							  	}
							   ],
							   
							   "_embedded": {
							      "https://dev-competency-mapper.pantheonsite.io/rest/relation/node/attribute/field_competency": [
							        {
							          "_links": {
							            "self": {
							              "href": "https://dev-competency-mapper.pantheonsite.io/node/"+competencyID+"?_format=hal_json"
							            },
							            "type": {
							              "href": "https://dev-competency-mapper.pantheonsite.io/rest/type/node/competency"
							            }
							          },
							          "uuid": [
							            {
							              "value": competecyUUID //"b20064ef-5cbf-4147-90f8-08e7a6693e17"
							            }
							          ],
							          "lang": "en"
							        }
							      ],

							      "https://dev-competency-mapper.pantheonsite.io/rest/relation/node/attribute/field_attribute_type": [
							        {
							          "_links": {
							            "self": {
							              "href": "https://dev-competency-mapper.pantheonsite.io/node/"+attributeTypeID+"?_format=hal_json"
							            },
							            "type": {
							              "href": "https://dev-competency-mapper.pantheonsite.io/rest/type/node/attribute_type"
							            }
							          },
							          "uuid": [
							            {
							              "value": attributeTypeUUID
							            }
							          ],
							          "lang": "en"
							        }
							      ],

							    }
							}
						)
					});
      this.setState({'updateFlag':true});
		

    event.preventDefault();
  }

  clickToEdit(id){
  	//alert(id);
  	this.setState({selectedAttribute:id});
  }

  handleEdit(e){
  	
  	let aid = this.state.selectedAttribute;
  	let title = e["message"];
			fetch('https://dev-competency-mapper.pantheonsite.io/node/'+ aid +'?_format=hal_json', {
			  method: 'PATCH',
			  'cookies': 'x-access-token' ,
			  headers: {
			    'Accept': 'application/hal+json',
			    'Content-Type': 'application/hal+json',
			    'X-CSRF-Token': this.state.csrf,
			    'Authorization': 'Basic',
			  },
			  body: JSON.stringify({
					  "_links":{
					    "type":{
					      "href":"https://dev-competency-mapper.pantheonsite.io/rest/type/node/attribute"
					    }
					  },
					  "title":[
					    {
					      "value": title
					    }
					  ],
					  "type":[
					    {
					      "target_id": "attribute"
					  	}
					   ]
			  		})
				});
      this.setState({'updateFlag':true});
  }

    archiveHandle(aid, status, event){
        //alert("attribute "+ aid+ "is "+ status);
        let archivedStatus = '';
        if(status ===1){
            archivedStatus = false;
        }else{
            archivedStatus = true;
        }

        fetch('https://dev-competency-mapper.pantheonsite.io/node/'+aid+'?_format=hal_json', {
            method: 'PATCH',
            'cookies': 'x-access-token' ,
            headers: {
                'Accept': 'application/hal+json',
                'Content-Type': 'application/hal+json',
                'X-CSRF-Token': this.state.csrf,
                'Authorization': 'Basic',
            },
            body: JSON.stringify({
                "_links":{
                    "type":{
                        "href":"https://dev-competency-mapper.pantheonsite.io/rest/type/node/attribute"
                    }
                },
                "field_archived":[
                    {
                        "value": archivedStatus
                    }
                ],
                "type":[
                    {
                        "target_id": "attribute"
                    }
                ]
            })
        });

        this.setState({'updateFlag':true});

        event.preventDefault();
    }

  onSelectChange(e){
  	let index = e.target.selectedIndex;
  	let optionElement = e.target.childNodes[index];
  	let option =  optionElement.getAttribute('data-id');
  	this.setState({ attributeTypeID: option});

  }

  render() {
  	this.checkUser();

  	let selectedCompetency = this.state.path[5].toLowerCase();
  	let attributeTypeOptions = [];
  	let frameworkName = '';
  	let frameworkDefs = [];
  	{this.state.frameworkDetails.map((item, ikey) => {
								if(item.name.toLowerCase() == this.state.path[2]){
									frameworkName = item.name;
									item.attribute_types.map((attribute_type) =>
											{
												frameworkDefs.push(attribute_type.title),
												attributeTypeOptions.push(<option data-id={attribute_type.id} value={attribute_type.uuid}>{attribute_type.title}</option>)
											}
										)								
								}
							}
						)}

  	let attributesList = this.state.data.map((item)=>
  								item.domains.map((domain) =>
  										domain.competencies.filter((competency, id)=>
  												{
	  												if(competency.id == selectedCompetency){
	  													this.state.selectedCompetencyUUID = competency.uuid;
	  													this.state.selectedCompetencyTitle = competency.title;
	  													return competency;
	  												}
	  											}
  											).map((competency)=>
  													frameworkDefs.map((def) => {
  														return <tbody>
																	<tr className="secondary-background white-color">
																		<td></td>
																		<td><strong><em>{def}</em></strong></td><td></td>
																	</tr>
                                                                     {
                                                                        competency.attributes.map((attribute) => {
                                                                                if (attribute.type == def) {
                                                                                	return <tr>
                                                                                        <td><i className="fas fa-arrows-alt position-icon"></i> </td>
                                                                                        <td style={{"left":"20px"}} className="tooltip-td"
                                                                                            onClick={this.clickToEdit.bind(this, attribute.id)}>
                                                                                            <InlineEdit
                                                                                                text={attribute.title}
                                                                                                data-id="12"
                                                                                                staticElement="div"
                                                                                                paramName="message"
                                                                                                change={this.handleEdit.bind(this)}
                                                                                                style={{
                                                                                                    display: 'inline-block',
                                                                                                    margin: 0,
                                                                                                    padding: 5,
                                                                                                    border: 1,
                                                                                                    width: '100%',
                                                                                                    'fontSize': '110%'
                                                                                                }}
                                                                                            />

                                                                                        </td>
																					<td> {attribute.archived==1?'Archived':''}
                                                                                        {attribute.archived==1? <a href="#" onClick={this.archiveHandle.bind(this, attribute.id, 1)}>  <i className="fas fa-toggle-on"></i></a> : <a href="#" onClick={this.archiveHandle.bind(this, attribute.id, 0)}>	<i className="fas fa-toggle-off"></i></a> }
																					</td>
                                                                                    </tr>

                                                                                }
                                                                            }
                                                                        )

                                                                    }
																</tbody>
  													}		
  											)
  									)
  							)
  						);




    return (
      	<div>
            <div className="row">
                <div className="column large-12">

                    <h3>Manage attributes</h3>
					<h4><a href={"/competency-mapper/#/framework/"+frameworkName+"/manage/competencies"}> {frameworkName}</a> / {this.state.selectedCompetencyTitle}</h4>

                </div>
            </div>

			<div className="row">
				<div className="column 12 callout">
					<h4>Create new attribute</h4>
				  <form onSubmit={this.handleSubmit}>
					<div className="row">
						<div className="column large-7">
						  <input type="text" ref="title" placeholder="Attribute description" />
						</div>
						<div className="column large-3">
							<select ref="attr_ref" onChange={this.onSelectChange.bind(this)}>
								{attributeTypeOptions}
							</select>
						</div>
						<div className="column large-2">
							<input type="submit" className="button" value="Submit" />
						</div>
					</div>
				  </form>
				</div>
			</div>
	    

	     <div className="row">
	     	<div className="column large-12">
	     		<table>{attributesList}</table>
	     	</div>

	     </div>
 		</div>



    );
  }
}


const ManageAttributes = () => (
  <Switch>
    <Route exact path='/framework/:name/manage/competencies/:cid/manage-attributes' component={ManageAttribute} />
  </Switch>
)

export default ManageAttributes;

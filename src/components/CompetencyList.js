import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Collapsible from 'react-collapsible'
import ReactModal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CompetencyForm from './CompetencyForm';
import CompetencyEdit from './CompetencyEdit';
import AttributeForm from './AttributeForm';
import CompetencyDetails from './CompetencyDetails';
import {CSVLink, CSVDownload} from 'react-csv';
import 'rc-progress/assets/index.css';
import Parser from 'html-react-parser';

const $ = window.$;

class CompetencyList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			data: [],
			resources:[],
			frameworkdetails:[], 
			framework: this.props.location.pathname.split("/"), 
			selectedID:'', 
			selectedUUID:'',
			competencyTitle:'',
			frameworkUUID:'',
			domains:[],
			csrf:'',
			lastUpdated:0,
			progress:0,
			showForm:this.props.formStatus,
			showAttrEdit:'',
			foundation:false,
			//demo: this.props.func,
		};
		this.handleOpenModal = this.handleOpenModal.bind(this);
    	this.handleCloseModal = this.handleCloseModal.bind(this);

    	this.handleOpenForm = this.handleOpenForm.bind(this);
    	this.handleCloseForm = this.handleCloseForm.bind(this);

    	this.handleOpenForm2 = this.handleOpenForm2.bind(this);
    	this.handleCloseForm2 = this.handleCloseForm2.bind(this);

    	this.handleOpenForm3 = this.handleOpenForm3.bind(this);
    	this.handleCloseForm3 = this.handleCloseForm3.bind(this);

    	this.handleMouseOver = this.handleMouseOver.bind(this)
    	this.handleMouseOut = this.handleMouseOut.bind(this)

    	this.increase = this.increase.bind(this);
    	this.restart = this.restart.bind(this);

    	this.lastUpdated = 0;

	}

	handleOpenModal (temp) {
    this.setState({ selectedID:temp });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }

  handleOpenForm () {
  		this.setState({ showForm: true});  
  }

  handleCloseForm () {
    this.setState({ showForm: false });
  }

  handleOpenForm2 (temp1, temp2, temp3, temp4) {
    this.setState({ showForm2: true, selectedID: temp1, selectedUUID: temp2, competencyTitle: temp3});
  }
  
  handleCloseForm2 () {
    this.setState({ showForm2: false });
  

  }

  handleOpenForm3 (temp1, temp2, temp3, temp4) {
    this.setState({ showForm3: true, selectedID: temp1, selectedUUID: temp2, competencyTitle: temp3});
  }
  
  handleCloseForm3 () {
    this.setState({ showForm3: false });
  }

  handleMouseOver(e){
  	this.setState({showAttrEdit:true});
  }

  handleMouseOut(e){
  	this.setState({showAttrEdit:false});
  }

  	increase(){
  		const progress = this.state.progress + 1;
  		if(progress >= 100){
  			clearTimeout(this.tm);
  			return;
  		}
  		this.setState({progress});
  		this.tm = setTimeout(this.increase, 10);
  	}

  	restart() {
    clearTimeout(this.tm);
    this.setState({ progress: 0 }, () => {
      this.increase();
    });
  }


	componentDidMount()
	{
		//let demo = this.handleLogin();
		//console.log(this.state.demo);

		this.increase();
		
		let csrfURL = "https://dev-competency-mapper.pantheonsite.io/rest/session/token";
		fetch(csrfURL)
		.then((Response)=>Response)
		.then((findresponse2)=>{
			this.setState({csrf: findresponse2})
		});

		
		let frameworkID = this.state.framework[2];
		let fetchCompetencyList = "https://dev-competency-mapper.pantheonsite.io/api/v1/framework/"+frameworkID+"?_format=json";
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
				frameworkdetails:findresponse1,

			})
		});

        let resourcesURL = "https://dev-competency-mapper.pantheonsite.io/api/v1/training-resources/all?_format=json";
        fetch(resourcesURL)
            .then((Response)=>Response.json())
            .then((findresponse)=>
            {
                this.setState({
                    resources:findresponse,

                })
            });

		for(var i=0; i<50; i++){
			this.setState({'progress':i});
		}
		
		
	}

	filter(e){
		this.setState({filter: e.target.value})
	}

    filter2(e){
        this.setState({filter2: e.target.value})
    }

	render(){

		let frameworkDetails = this.state.frameworkdetails;
		let frameworkName = '';
		let desc = '';
		let data = this.state.data;
		let frameworkDefs = [];
		let frameworkDomains = [];
		let domainsOptions = [];
		let attributeTypeOptions = [];
		let data1= '';
        let resources = this.state.resources;
		if(this.state.filter) {
            data = data.filter((item) =>
                item.domains.filter((domain) =>

                    domain.competencies.some((competency) =>
                        competency.title.toLowerCase().includes(this.state.filter.toLowerCase())
                    )
                )
            ).map(item => {
                return Object.assign({}, item, {domains: item.domains.filter(domain =>
                        domain.competencies.some(competency =>
                            competency.title.toLowerCase().includes(this.state.filter.toLowerCase())

                        )
                    )
                })
            })
        }


		{frameworkDetails.map((item, ikey) => {
								if(item.name.toLowerCase() == this.state.framework[2]){
									frameworkName = item.name;
									desc = item.description;
									this.state.frameworkUUID = item.uuid;
									item.attribute_types.map((attribute_type) =>
											{
												frameworkDefs.push(attribute_type.title),
												attributeTypeOptions.push(<option data-id={attribute_type.id} value={attribute_type.uuid}>{attribute_type.title}</option>)
											}
										),
									item.domains.map((domain) =>
											{
												domainsOptions.push(<option data-id={domain.id} value={domain.uuid}>{domain.title}</option>);
											}
										)
								
								}
							}
						)}
		
		
		const ListOfCompetencies = data.map((item) =>

                item.domains.map((domain, did) =>

                    <tbody>
                    <tr key={domain.nid} className="white-color secondary-background">
                        <td>{did + 1}</td>
                        <td><h4> {domain.title}</h4></td>
                    </tr>
                    {
                        domain.competencies.map((competency, cid) => {
                                if (competency.archived === 0) {
                                    return <tr key={competency.id}>
                                        <td>{did + 1}.{cid + 1}</td>
                                        <td>
                                            <Collapsible
                                                trigger={<div><h5
                                                    style={{cursor: 'pointer'}}> {competency.title}
                                                    <span
                                                        style={{fontSize: '12px'}}> {competency.archived ? '[Archived]' : ''} </span>
                                                    <i className="fas fa-expand float-right"></i></h5>
                                                </div>}
                                                triggerWhenOpen={<div><h5
                                                    style={{cursor: 'pointer'}}> {competency.title}
                                                    <span
                                                        style={{fontSize: '12px'}}> {competency.archived ? '[Archived]' : ''} </span>
                                                    <i className="fas fa-minus-square float-right"></i>
                                                </h5>
                                                </div>}>
                                                <ul style={{
                                                    marginLeft: 1 + 'em',
                                                    marginBottom: 1 + 'em'
                                                }}>
                                                    <li key={"competency" + competency.id}
                                                        className="float-right no-bullet">
                                                        {/*<a onClick={()=>this.handleOpenForm2(competency.id, competency.uuid, competency.title)}>  <i className="icon icon-functional" data-icon="+"></i> Add attribute</a><br/>*/}
                                                        {/*<a onClick={()=>this.handleOpenModal(competency.id)}> <i className="fas fa-info-circle"></i> More details</a><br/>*/}
                                                        <a onClick={() => this.handleOpenModal(competency.id)}
                                                           href={process.env.PUBLIC_URL + "/#/framework/" + item.title + "/competency/details/" + competency.id}>
                                                            <i className="fas fa-info-circle"></i> More
                                                            details</a><br/>


                                                    </li>
                                                    {
                                                        frameworkDefs.map((def) => {
                                                                return <div style={{marginLeft: 1 + 'em'}}>
                                                                    <div><strong><em>{def}</em></strong>
                                                                    </div>
                                                                    {
                                                                        competency.attributes.map((attribute) => {
                                                                                if (attribute.type == def)
                                                                                    return <li
                                                                                        key={attribute.id}
                                                                                        style={{marginLeft: 1 + 'em'}}
                                                                                        key={attribute.id}>{attribute.title}

                                                                                        <span
                                                                                            ref={"span" + attribute.id}
                                                                                            hidden>
																								<a data-toggle={"example-dropdown" + attribute.id}> <i
                                                                                                    className="icon icon-functional"
                                                                                                    data-icon="s"> </i></a>
																								<div
                                                                                                    className="dropdown-pane"
                                                                                                    id={"example-dropdown" + attribute.id}
                                                                                                    data-dropdown
                                                                                                    data-close-on-click="true"
                                                                                                    data-auto-focus="true">
																								  Settings
																								  <div className="row">
																								  	<div
                                                                                                        className="column large-6">
																								  		<a onClick={() => this.handleOpenForm3(competency.id, competency.uuid, competency.title)}><i
                                                                                                            className="fas fa-pen-square"></i> Edit</a><br/>
																								  		<a href="#"><i
                                                                                                            className="fas fa-archive"></i> Archive</a> <br/>
																								  	</div>
																								  	<div
                                                                                                        className="column large-6">
																								  		<a href="#"><i
                                                                                                            className="fas fa-exchange-alt"></i> Domain</a> <br/>
																								  		<a onClick={() => this.handleOpenForm2(competency.id, competency.uuid, competency.title)}><i
                                                                                                            className="fas fa-plus-circle"></i> Attributes</a>
																								  	</div>

																								  </div>
																								</div>
																								</span>


                                                                                    </li>
                                                                            }
                                                                        )
                                                                    }
                                                                </div>
                                                            }
                                                        )
                                                    }

                                                </ul>
                                            </Collapsible>
                                        </td>


                                    </tr>
                                }


                            }
                        )
                    }


                    </tbody>
                )

									);

		const competencyDetails = data.map((item) =>
		 								item.domains.map((domain)=>
		 									domain.competencies.map((competency) =>{
		 												if(competency.id == this.state.selectedID){
			 														return <div className="row">
			 																	<div className="column large-7">
				 																	<h1>{item.title}</h1> 
				 																	<h3> {domain.title}</h3> 
				 																	<h4>{competency.title}</h4>
				 																	<ul>
				 																		{
																	frameworkDefs.map((def) => {
																	return <div>
																				<div> <strong><em>{def}</em></strong></div>
																				{
																				competency.attributes.map((attribute) =>{ 
																						if(attribute.type == def)
																						return	<li key={attribute.id}>{attribute.title} </li> 
																						}
																				)
																			}
																				</div>
																}
															)
														}
				 																	</ul>
				 																</div>
				 																<div className="column large-5">
				 																	<div className="callout notice industry-background white-color">
					 																	<h4>This competency is derived from:</h4>
					 																	<ul>
					 																		<li>[CORBEL][C.12] - A competency from derived framewor will display here </li>
					 																	</ul>
					 																</div>
					 																<div className="callout notice training-background white-color">
					 																	<h4>Training resources mapped to this competency</h4>
					 																	<ul>
					 																		<li><a href="/training/events/2018/bringing-data-life-data-management-biomolecular-sciences">Bringing data to life: data management for the biomolecular sciences</a></li>
					 																		<li><a href="/training/online/course/biocuration-introduction">Biocuration: An introduction</a></li>
					 																		<li><a href="/training/events/2018/exploring-human-genetic-variation-0">Exploring Human Genetic Variation</a></li>
					 																		<li><a href="/training/online/course/cellular-microscopy-phenotype-ontology-cmpo-quick">Cellular Microscopy Phenotype Ontology (CMPO): Quick tour</a></li>
					 																	</ul>
					 																</div>
				 																</div>
			 																</div>
		 												}

		 											}
		 										)
		 									)
									);

        if(this.state.filter2){
            resources = resources.filter((item) =>
                item.title.toLowerCase().includes(this.state.filter2.toLowerCase()) || item.keywords.toLocaleLowerCase().includes(this.state.filter2.toLowerCase())
                || item.type.toLocaleLowerCase().includes(this.state.filter2.toLowerCase()) || item.description.toLocaleLowerCase().includes(this.state.filter2.toLowerCase())
				|| item.dates.includes(this.state.filter2)
            );
        }


		const ListOfResources = resources.map((item, index) =>
							item.competency_profile.map((profile) =>{
								if(profile.uuid == this.state.frameworkUUID && item.archived != 1 ) {
								return	<tr key={index}>

											<td><a href={process.env.PUBLIC_URL+"/#/training-resources/" + item.id}> {item.title} </a>
												{/*<p>{item.dates} </p>*/}
												{/*{Parser(item.description.substr(0, 360) + "...")} <br/>
												<strong> URL: </strong> <a href={item.url} target={"_blank"}>{item.url}</a>*/}
											</td>
											<td>
                                                {item.type}
											</td>
											<td>
												<ul>
												{
													item.competency_profile.map((profile) =>
														{
															if(profile.uuid == this.state.frameworkUUID) {
															return	profile.domains.map((domain) =>
																	domain.competencies.map((competency) =>
																		 <li><a href={process.env.PUBLIC_URL+ '/#/framework/'+ profile.title + "/competency/details/" + competency.id}>{competency.title} </a></li>
																	)
																)
															}
                                                        }

													)
												}
												</ul>
											</td>
										</tr>
	            }
            }
							)
		);

				        			
		return(
				
				<div key={1234}>


					<h3 id="page">{frameworkName}</h3>
                    {Parser(desc)}
					{frameworkDomains[2]}
					
					<Tabs>

				    <TabList>
				      <Tab>Competencies</Tab>
				      <Tab>Training resources</Tab>
				    </TabList>

				   			    

				    <TabPanel>
				  		<div className="row">
						    <div className="column large-12">
							    <div>
									<input type="text" onChange={this.filter.bind(this)} placeholder="Type to search" />
								</div>
							</div>
						</div>

				      <table>
						{ListOfCompetencies}
						</table>

						<div>
					       <ReactModal isOpen={this.state.showModal} className="Modal" overlayClassName="Overlay" contentLabel="Minimal Modal Example">
					        <div style={{'textAlign':'center',  'width':'102%', 'height':'70px', 'top':'-18px', 'left':'-15px', 'position':'relative', 'padding':'5px'}}>
				        		<h2 className="services-background white-color">Competency details <i className="fas fa-window-close float-right" data-close onClick={this.handleCloseModal}></i>	</h2>
			        		</div>	
					        		{competencyDetails}
					        </ReactModal>
				    	</div>
				    </TabPanel>

				    <TabPanel>
                        <div className="row">
                            <div className="column large-12">
                                <div>
                                    <input type="text" onChange={this.filter2.bind(this)} placeholder="Type to search" />
                                </div>
                            </div>
                        </div>

				      <table className={"table"}>
                          <thead>
						  	<tr>
								<th>Name</th>
								<th>Type</th>
								<th>Competency</th>
							</tr>
                          </thead>
						  <tbody>


						  	{ListOfResources}

						  </tbody>
					  </table>
				    </TabPanel>
				  </Tabs>

				  <div>
			        <ReactModal isOpen={this.state.showForm} className="ModalCompetency" overlayClassName="OverlayForm" contentLabel="Create content form">
			        	<div style={{'background-color':'#ccc', 'text-align':'center',  'width':'107%', 'height':'50px', 'top':'-18px', 'left':'-18px', 'position':'relative', 'padding':'5px'}}>
			        		<h4 style={{'color':'black'}}>Create Competency <i className="fas fa-window-close float-right" size="9x" data-close onClick={this.handleCloseForm}></i>	</h4>
			        		<a><h4>				     </h4>   </a>
			        	</div>
			        		<CompetencyForm frameworkName={frameworkName} domainsOptions={domainsOptions} />
						
			        </ReactModal>

			         <ReactModal isOpen={this.state.showForm2} className="ModalAttribute" overlayClassName="OverlayForm" contentLabel="Create attribute form">
			        	<div style={{'background-color':'#ccc', 'text-align':'center',  'width':'104%', 'height':'50px', 'top':'-18px', 'left':'-17px', 'position':'relative', 'padding':'5px'}}>
			        		<h4 style={{'color':'black'}}>Create attribute <i className="fas fa-window-close float-right" data-close onClick={this.handleCloseForm2}></i></h4>
			        		<a><h4>					     </h4>   </a>	
			        	</div>				        
			        		<AttributeForm selectedCompetencyUUID={this.state.selectedUUID} selectedCompetencyTitle={this.state.competencyTitle} selectedCompetencyID={this.state.selectedID} attributeTypeOptions={attributeTypeOptions} />
			        </ReactModal>
				        
				    <ReactModal isOpen={this.state.showForm3} className="ModalCompetencyEdit" overlayClassName="OverlayForm" contentLabel="Edit competency">
			        	<div style={{'background-color':'#ccc', 'text-align':'center',  'width':'107%', 'height':'50px', 'top':'-18px', 'left':'-17px', 'position':'relative', 'padding':'5px'}}>
			        		<h4 style={{'color':'black'}}>Edit competency <i className="fas fa-window-close float-right" data-close onClick={this.handleCloseForm3}></i></h4>
			        	</div>				        
			        		<CompetencyEdit competencyID={this.state.selectedID} competencyTitle={this.state.competencyTitle} competencyUUID={this.state.selectedUUID} />
			        		
			        </ReactModal>
				        

				        {/*<Line percent={this.state.progress} strokeWidth="2" strokeColor="green" trailColor="#ccc" />
				        <button onClick={this.restart}>Restart</button>*/}

				        <CompetencyDetails data={competencyDetails} />
  						
			        

		    	</div>
			</div>


		);
	}
}

const Competencies = () => (
  <Switch>
    <Route exact path='/framework/:name' component={CompetencyList} />
  </Switch>
)


export default Competencies

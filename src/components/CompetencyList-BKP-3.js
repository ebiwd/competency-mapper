import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Collapsible from 'react-collapsible'
import ReactModal from 'react-modal';



class CompetencyList extends React.Component{
	constructor(props){
		super(props);
		this.state = {data: [], frameworkdetails:[], framework: this.props.location.pathname.split("/"), selected:''};

		this.handleOpenModal = this.handleOpenModal.bind(this);
    	this.handleCloseModal = this.handleCloseModal.bind(this);
		
	}

	handleOpenModal (temp) {
    this.setState({ showModal: true, selected:temp });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }

  
	componentDidMount()
	{
		let frameworkID = this.state.framework[2];
		let fetchCompetencyList = "http://drupal8/api/v1/framework/"+frameworkID+"?_format=json";
		fetch(fetchCompetencyList)
		.then((Response)=>Response.json())
		.then((findresponse)=>
		{
			this.setState({
				data:findresponse,
				
			})
		});

		let fetchFrameworkDetails = "http://drupal8/api/v1/framework?_format=json";
		fetch(fetchFrameworkDetails)
		.then((Response)=>Response.json())
		.then((findresponse1)=>
		{
			this.setState({
				frameworkdetails:findresponse1,

			})
		})
	}



	render(){
		let frameworkDetails = this.state.frameworkdetails;
		let frameworkName = '';
		let data = this.state.data;
		let frameworkDefs = [];
		{frameworkDetails.map((item, ikey) => {
								if(item.name.toLowerCase() == this.state.framework[2]){
									frameworkName = item.name;
									item.attribute_types.map((attribute_type) =>
											{frameworkDefs.push(attribute_type.title)}
										)
									
								}
							}
						)}
		
		const ListOfCompetencies = data.map((item) => 
									item.domains.map((domain, did) => 
										<div>
											<h4 > [{did+1}] {domain.title} </h4>
											<ul className="no-bullet">{
												domain.competencies.map((competency, cid) =>
													<li key={competency.id}>
														<Collapsible trigger={<h5 style={{cursor: 'pointer'}}>[ {did+1}.{cid+1} ] {competency.title}  </h5>}>
															<ul className="no-bullet callout" style={{marginLeft: 1 + 'em', marginBottom: 1 + 'em'}}>
															<li className="float-right">
																<button className="button" onClick={()=>this.handleOpenModal(competency.id)}> <i className="icon icon-common" data-icon="&#x2b;"></i>More details</button>
															</li>
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
													    </Collapsible>
													</li>

													)
											}
											</ul>
											
										</div>
										)

									);

		const competencyDetails = data.map((item) =>
		 								item.domains.map((domain)=>
		 									domain.competencies.map((competency) =>{
		 												if(competency.id == this.state.selected){
		 													
			 														return <div className="row callout">
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
										


									)

		return(
				<div key={1234}>
				<h3>{frameworkName}</h3>
				<p>The BioExcel training programme is based on a competency profile. A competency is an observable ability of any professional, integrating multiple components such as knowledge, skills and behaviours. A competency profile lists and defines all the competencies that an individual might need to fulfil a particular role, or that define specific user groups.</p>
				{
					data.map((item) => (
						ListOfCompetencies
						))
				}
				<div>
				        
				        <ReactModal isOpen={this.state.showModal} contentLabel="Minimal Modal Example">
				        <button className="close-button" data-close onClick={this.handleCloseModal}>x</button>
				        
				        {competencyDetails}
											
				          
				        </ReactModal>
				      </div>
				</div>
		);
	}
}

const Competencies = () => (
  <Switch>
    <Route path='/framework' component={CompetencyList} />
  </Switch>
)


export default Competencies

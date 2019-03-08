import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Collapsible from 'react-collapsible'



class CompetencyList extends React.Component{
	constructor(props){
		super(props);
		this.state = {data: [], frameworkdetails:[], framework: this.props.location.pathname.split("/")};
		
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
		let data = this.state.data;
		console.log(this.state.frameworkdetails);
		let frameworkDefs = [];
		let domainStyle = "background-color:'#ccc'";
		{frameworkDetails.map((item, ikey) => {
								if(item.name.toLowerCase() == this.state.framework[2]){
									//alert({item.name.toLowerCase()})
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
															<li className="float-right"><a href="#" class="readmore">More details</a></li>
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

		return(
				<div key={1234}>
				{
					data.map((item) => (
						ListOfCompetencies
						))
				}
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

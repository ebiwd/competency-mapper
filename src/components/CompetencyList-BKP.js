import React from 'react'
import { Switch, Route } from 'react-router-dom'


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

		return(

				<div>
					<div>
						
					</div>
					<div><h2> {data.map((item, ikey) => item.title)} </h2></div>
					<div className="row">
								<div className="column large-2"><h3>Number</h3> </div>
								<div className="column large-10"><h3>Name and Description </h3><p></p></div>
					</div>

						{
							data.map((item, id) =>
								item.domains.map((domain, domainkey) =>
										<div key={domainkey}>
											<div className="row callout" key={domain.id}>
												<div className="column large-2"><p className="badge">{(this.state.framework[2][0].toUpperCase())+""+(domainkey+1)}</p> </div>
												<div className="column large-10"><h4>{domain.title}</h4></div>
											</div>
												{
													domain.competencies.map((competency, ckey)=>
													<div className="row" key={ckey}>
														<div className="row" key={competency.id}>
															<div className="column large-2 light-gray-background"><p className="badge">{(domainkey+1)+"."+(ckey+1)} </p> </div>
															<div className="column large-10"><h5>{competency.title}</h5> </div>
														</div>
														<div className="row">
															{
																
															frameworkDefs.map((def, defindex) => 
																{
																return	<div className="row" key={defindex}>
																			<div className="column large-12">
																				<div className="row"  >
																					<div className="column large-2"></div>
																					<div className="column large-10"><strong>{def}</strong></div>
																				</div>
																					{																				
																						competency.attributes.map((attribute, akey)=>{
																								if(attribute.type == def){
																								 return <div className="row"  key={attribute.id}>
																											<div className="column large-2"></div>
																											<div className="column large-10">{attribute.title}</div>
																										</div>
																							}
																						
																						})
																					}
																			</div>
																		</div>
																		
															}
														)	

														
													}
														</div>
														<p></p>
													</div>

													)
												}
										</div>
									)
								)
								
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

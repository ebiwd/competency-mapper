import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Parser from 'html-react-parser';

// The Roster component matches one of two different routes
// depending on the full pathname
const $ = window.$;

class FrameworksList extends React.Component{
	constructor(props){
		super(props);
		this.state = {data: []};
	}
  
	componentDidMount()
	{
		fetch('https://dev-competency-mapper.pantheonsite.io/api/frameworks')
		.then((Response)=>Response.json())
		.then((findresponse)=>
		{
			this.setState({
				data:findresponse,
				frameworkID:'',
				
			})
		});
		$(document).foundation();
	}

	render(){
		let data = this.state.data;
		let temp = 0;

		return(
			<div>
				{
					<div>
					<h3>Overview</h3>
					<p className="lead">Introduction to the idea of competency frameworks and their linkage with training resources. 
					Two lines of description should look good and then links can be given to <a href="#" className="readmore"> read more </a></p>
					<table className="responsive-table hover">
					  <tbody>
						  	<tr> 
							{
							data.map((item, id) =>
									{
										if(id <= 2){
										return	<td className="callout text-center" >
													<a href={process.env.PUBLIC_URL+'/#/framework/'+item.title.toLowerCase()}>
														<div style={{height:'170px'}}>
															<img src={"http://dev-competency-mapper.pantheonsite.io/"+item.field_logo} />
														</div>
														<div className={"highlight-caption highlight-caption-big"}  style={{position:'relative', top:'-5px'}}>
															<p>{Parser(item.field_description.substr(0,120)+'...'+'<i className="icon icon-functional" data-icon=">"></i>')}</p>
														</div>
													</a>
												</td>										
										}
									}					
								)
							}
							</tr>
							<tr> 
							{
							data.map((item, id) =>
									{
										if(id >= 3){
										return	<td className="callout text-center" >
                                            <a href={process.env.PUBLIC_URL+'/#/framework/'+item.title.toLowerCase()}>
                                                <div style={{height:'170px'}}>
                                                    <img src={"http://dev-competency-mapper.pantheonsite.io/"+item.field_logo} />
                                                </div>
                                                <div className={"highlight-caption highlight-caption-big"} style={{position:'relative', top:'-5px'}}>
                                                    <p>{Parser(item.field_description.substr(0,120)+'...'+'<i className="icon icon-functional" data-icon=">"></i>')}</p>
                                                </div>
                                            </a>
                                        </td>
                                        }
									}					
								)
							}
							</tr>
						</tbody>
					</table>
					</div>
				}
				
			</div>
		);
	}
}



const Frameworks = () => (
  <Switch>
    <Route exact path='/' component={FrameworksList} />
  </Switch>
);

export default Frameworks

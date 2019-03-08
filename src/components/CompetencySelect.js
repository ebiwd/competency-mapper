import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Collapsible from 'react-collapsible'
import 'rc-progress/assets/index.css';

const $ = window.$;

class CompetencySelect extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            framework: this.props.selectedFramework,
            resourceID: this.props.resourceID,
            frameworkdetails: [],
            csrf:'',
            frameworkUUID:'',
            competencies:[],
        };

        this.handleSelect = this.handleSelect.bind(this);

    }

    componentDidMount() {
        let csrfURL = "https://dev-competency-mapper.pantheonsite.io/rest/session/token";
        fetch(csrfURL)
            .then((Response)=>Response)
            .then((findresponse2)=>{
                this.setState({csrf: findresponse2})
            });
    }

    handleSelect(){
        let checkedCompetencies = this.state.competencies;
        let competencyIDs = [];
        for(let i=0; i<checkedCompetencies.length; i++){
            competencyIDs.push(checkedCompetencies[i].split('id',2));
        }

        if(competencyIDs.length > 0) {
            let payload = {"_links":{"type":{"href":"https://dev-competency-mapper.pantheonsite.io/rest/type/node/training_resource"},
                    "https://dev-competency-mapper.pantheonsite.io/rest/relation/node/training_resource/field_competency_mapped": {"href": "http://dev-competency-mapper.pantheonsite.io/node/"+competencyIDs[0][1]+"?_format=hal_json"}
                },

                "type":[{"target_id":"training_resource"}],
                "_embedded": {
                }
            };

            let embedded_string = [];
            for(let i=0; i<competencyIDs.length; i++) {
                embedded_string.push(
                    {
                        "_links": {
                            "self": {
                                "href": "https://dev-competency-mapper.pantheonsite.io/node/" + competencyIDs[i][1] + "?_format=hal_json"
                            },
                            "type": {
                                "href": "https://dev-competency-mapper.pantheonsite.io/rest/type/node/competency"
                            }
                        },
                        "uuid": [
                            {
                                "value": competencyIDs[i][0]
                            }
                        ],
                    }
                );
            }

            payload._embedded = {"https://dev-competency-mapper.pantheonsite.io/rest/relation/node/training_resource/field_competency_mapped": embedded_string};

                fetch('https://dev-competency-mapper.pantheonsite.io/node/' + this.state.resourceID + '?_format=hal_json', {
                    method: 'PATCH',
                    'cookies': 'x-access-token',
                    headers: {
                        'Accept': 'application/hal+json',
                        'Content-Type': 'application/hal+json',
                        'X-CSRF-Token': this.state.csrf,
                        'Authorization': 'Basic',
                    },
                    body: JSON.stringify(
                        payload
                    )
                });
            }

        //this.props.handleCloseModal();
    }

    handleChange(id, uuid, e) {
        const competencies = this.state.competencies;
        let isChecked = e.target.checked;
        if(isChecked){
            competencies.push(uuid+"id"+id);
            this.setState({competencies});
        }else{
            competencies.pop(id);
            this.setState({competencies});
        }
    }

    componentDidMount()
    {

        let csrfURL = "https://dev-competency-mapper.pantheonsite.io/rest/session/token";
        fetch(csrfURL)
            .then((Response)=>Response)
            .then((findresponse2)=>{
                this.setState({csrf: findresponse2})
            });

        let fetchCompetencyList = "https://dev-competency-mapper.pantheonsite.io/api/v1/framework/"+this.state.framework+"?_format=json";
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
    }

    render(){

        let frameworkDetails = this.state.frameworkdetails;
        let data = this.state.data;
        let frameworkName = '';
        let frameworkDefs = [];
        let frameworkDomains = [];
        let domainsOptions = [];
        let attributeTypeOptions = [];


        {frameworkDetails.map((item, ikey) => {
                if(item.name.toLowerCase() === this.state.framework){
                    frameworkName = item.name;
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
                    <tr key={domain.nid}><td>{did+1}</td> <td><strong> {domain.title}</strong> </td>  </tr>
                    {
                        domain.competencies.map((competency, cid) =>
                            <tr key={competency.id}>
                                <td>{did+1}.{cid+1}</td>
                                <td>
                                   <input type={"checkbox"} id={competency.id} onChange={this.handleChange.bind(this, competency.id, competency.uuid)}/> {competency.title}
                                        <ul style={{marginLeft: 1 + 'em', marginBottom: 1 + 'em'}}>
                                            {
                                                frameworkDefs.map((def) => {
                                                        return <div style={{marginLeft: 1 + 'em'}}>
                                                            <div> <strong><em>{def}</em></strong></div>
                                                            {
                                                                competency.attributes.map((attribute) =>{
                                                                        if(attribute.type === def)
                                                                            return	<li key={attribute.id} style={{marginLeft: 1 + 'em'}} key={attribute.id}> <input type={"checkbox"}/> {attribute.title}
                                                                            </li>
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                    }
                                                )
                                            }
                                        </ul>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            )
        );


        return(
            <div>{ListOfCompetencies}
                <div id={"footer-button"}>
                    <button className={"button"} onClick={this.handleSelect.bind(this)} > Save</button>

                </div>
            </div>




        );
    }
}

export default CompetencySelect;
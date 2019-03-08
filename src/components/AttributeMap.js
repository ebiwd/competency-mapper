import React from 'react'
import 'rc-progress/assets/index.css';

const $ = window.$;

class AttributeMap extends React.Component{
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
            attributes:  this.props.selectedAttributes,
            selectedAttributes: this.props.selectedAttributes,
            selectedCompetencies: this.props.selectedCompetencies,
            resourceDetails:[],
        };
        this.handleSelect = this.handleSelect.bind(this);
    }


    handleSelect(){
        let checkedAttributes = this.state.selectedAttributes;
        let attributeIDs = [];
        let token = localStorage.getItem('csrf_token');
        for(let i=0; i<checkedAttributes.length; i++){
            attributeIDs.push(checkedAttributes[i].split('id',2));
        }

        if(attributeIDs.length > 0) {
            let payload = {"_links":{"type":{"href":"https://dev-competency-mapper.pantheonsite.io/rest/type/node/training_resource"},
                    "https://dev-competency-mapper.pantheonsite.io/rest/relation/node/training_resource/field_attribute_mapped": {"href": "http://dev-competency-mapper.pantheonsite.io/node/"+attributeIDs[0][1]+"?_format=hal_json"}
                },

                "type":[{"target_id":"training_resource"}],
                "_embedded": {
                }
            };

            let embedded_string = [];
            for(let i=0; i<attributeIDs.length; i++) {
                embedded_string.push(
                    {
                        "_links": {
                            "self": {
                                "href": "https://dev-competency-mapper.pantheonsite.io/node/" + attributeIDs[i][1] + "?_format=hal_json"
                            },
                            "type": {
                                "href": "https://dev-competency-mapper.pantheonsite.io/rest/type/node/attribute"
                            }
                        },
                        "uuid": [
                            {
                                "value": attributeIDs[i][0]
                            }
                        ],
                    }
                );
            }

            payload._embedded = {"https://dev-competency-mapper.pantheonsite.io/rest/relation/node/training_resource/field_attribute_mapped": embedded_string};

            fetch('https://dev-competency-mapper.pantheonsite.io/node/' + this.state.resourceID + '?_format=hal_json', {
                credentials: 'include',
                method: 'PATCH',
                'cookies': 'x-access-token',
                headers: {
                    'Accept': 'application/hal+json',
                    'Content-Type': 'application/hal+json',
                    'X-CSRF-Token': token,
                    'Authorization': 'Basic',
                },
                body: JSON.stringify(
                    payload
                )
            });
        }

        this.props.handleCloseModal();
    }

    handleAllCheck(id, uuid, e) {
        const selectedAttributes = this.state.selectedAttributes;
        let childItems = document.getElementsByName(id);
        if(e.target.checked) {
            for (let i = 0; i < childItems.length; i++) {
                childItems[i].checked = true;
                selectedAttributes.push(childItems[i].getAttribute('data-uuid') +"id"+ childItems[i].getAttribute('data-id'));
                this.setState({selectedAttributes});
                console.log(this.state.selectedAttributes)
            }
        }else{
            for (let i = 0; i < childItems.length; i++) {
                if(childItems[i].checked == true) {
                    childItems[i].checked = false;
                    //selectedAttributes.pop(childItems[i].getAttribute('data-id'));
                    //let index = array.indexOf(element);
                    selectedAttributes.splice(selectedAttributes.indexOf(childItems[i]), 1);
                    this.setState({selectedAttributes});
                    console.log(this.state.selectedAttributes)
                }

            }
        }
    }

    handleAttributeClick(id, uuid, e) {
        const selectedAttributes = this.state.selectedAttributes;
        let isChecked = e.target.checked;
        if(isChecked){
            selectedAttributes.push(uuid+"id"+id);
            this.setState({selectedAttributes});
            document.getElementById(e.target.name).checked = true;
            console.log(this.state.selectedAttributes)
        }else{
            //selectedAttributes.pop(id);
            selectedAttributes.splice( selectedAttributes.indexOf(uuid+"id"+id), 1);
            this.setState({selectedAttributes});
            if (!$(":checkbox[name="+e.target.name+"]").is(":checked"))
            {
                document.getElementById(e.target.name).checked = false;
                console.log(this.state.selectedAttributes)
            }
        }
    }

    handleListAllChecked(e){
        let lists = [];
        $(":checkbox").each(function(){
            if($(this).is(":checked")){
                lists.push($(this).attr("id"));
            }
        });
        alert(lists);
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

        fetch("https://dev-competency-mapper.pantheonsite.io/node/"+this.state.resourceID+"?_format=hal_json")
            .then((Response)=>Response.json())
            .then((findresponse)=>{
                this.setState({
                    resourceDetails:findresponse
                })
            });

        //console.log(this.state.resourceDetails);
    }

    shouldComponentUpdate(nextProps, nextState){

        return this.state.attributes === nextState.attributes;

    }

    render(){
        let frameworkDetails = this.state.frameworkdetails;
        let data = this.state.data;
        let frameworkName = '';
        let frameworkDefs = [];
        let frameworkDomains = [];
        let domainsOptions = [];
        let attributeTypeOptions = [];


        //console.log(this.state.selectedAttributes);

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
                                <input type={"checkbox"} defaultChecked={-1 !== this.state.selectedCompetencies.indexOf(competency.id)}  data-test={competency.uuid} id={competency.id} onChange={this.handleAllCheck.bind(this, competency.id, competency.uuid)}/> {competency.title}
                                <ul style={{marginLeft: 1 + 'em', marginBottom: 1 + 'em'}}>
                                    {
                                        frameworkDefs.map((def) => {
                                                return <div style={{marginLeft: 1 + 'em'}}>
                                                    <div> <strong><em>{def}</em></strong></div>
                                                    {
                                                        competency.attributes.map((attribute) =>{
                                                                if(attribute.type === def)
                                                                    return	<li key={attribute.id} style={{marginLeft: 1 + 'em'}}>
                                                                            <input type={"checkbox"} defaultChecked={-1 !== this.state.selectedAttributes.indexOf(attribute.uuid+"id"+attribute.id)} name={competency.id} data-id={attribute.id} data-uuid={attribute.uuid} id={attribute.id} onChange={this.handleAttributeClick.bind(this, attribute.id, attribute.uuid)}/> {attribute.title}

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
                <tr><td><td>

                </td></td></tr>
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

export default AttributeMap;
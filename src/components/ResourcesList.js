import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Parser from 'html-react-parser';

const $ = window.$;

class ResourcesList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            resources: [],
            filterType:'',
        };
        this.archiveHandle = this.archiveHandle.bind(this);
    }

    checkUser(){
        if(!localStorage.getItem('roles')){
            this.props.history.push("/");
        }else if(!localStorage.getItem('roles').includes('content_manager')){
            alert("You are not authorised to access this page. Contact the administrator");
            this.props.history.push("/");
        }
            console.log(localStorage.getItem('roles'))
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

    componentDidMount()
    {
        this.fetchData();
    }

    fetchData(){
        let csrfURL = "https://dev-competency-mapper.pantheonsite.io/rest/session/token";
        fetch(csrfURL)
            .then((Response)=>Response)
            .then((findresponse2)=>{
                this.setState({csrf: findresponse2})
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
    }

    filter(e){
        this.setState({filter: e.target.value})
    }

    filterTypeHandle(e){
        this.setState({filterType: e.target.value});
    }

    archiveHandle(rid, status, event){
        //alert("competency "+ cid+ "is "+ status);
        let archivedStatus = '';
        if(status ===1){
            archivedStatus = false;
        }else{
            archivedStatus = true;
        }
        let token = localStorage.getItem('csrf_token');
        fetch('https://dev-competency-mapper.pantheonsite.io/node/'+rid+'?_format=hal_json', {
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
                        "href":"https://dev-competency-mapper.pantheonsite.io/rest/type/node/training_resource"
                    }
                },
                "field_archived":[
                    {
                        "value": archivedStatus
                    }
                ],
                "type":[
                    {
                        "target_id": "training_resource"
                    }
                ]
            })
        });

        this.setState({'updateFlag':true});

        event.preventDefault();
    }


    render(){
        this.checkUser();
        let resources = this.state.resources;
        if(this.state.filter){
            resources = resources.filter((item) =>
                item.title.toLowerCase().includes(this.state.filter.toLowerCase())
                || item.description.toLocaleLowerCase().includes(this.state.filter.toLowerCase())
            );
        }

        if(this.state.filterType!='All'){
            resources = resources.filter((item) =>
                 item.type.toLocaleLowerCase().includes(this.state.filterType.toLowerCase())
            );
        }

        const ListOfResources = resources.map((item, index) =>
                <tr key={index}>
                    <td>{index+1} </td>
                    <td> <h4> <a href={process.env.PUBLIC_URL+"/#/training-resources/"+item.id}> {item.title} </a> </h4>
                        <p>{item.dates} </p>
                        <strong>Learning resource type:</strong> {item.type} <br/>
                        {Parser(item.description.substr(0, 240)+ "..." )} <br/><br/>
                        <strong> URL: </strong> <a href={item.url} target={"_blank"}>{item.url}</a>
                    </td>
                    <td>
                        {item.archived==1? <a href="#" onClick={this.archiveHandle.bind(this, item.id, 1)}>  <i className="fas fa-toggle-on"></i> <span>Archived</span>  </a> : <a href="#" onClick={this.archiveHandle.bind(this, item.id, 0)}>	<i className="fas fa-toggle-off"></i></a> }
                    </td>
                    <td><a href={process.env.PUBLIC_URL+"/#/training-resource/edit/"+item.id}><i className="fas fa-edit"></i>   </a>  </td>
                </tr>
        );
        return(
            <div className={"row"}>
                <h3>Training Resources</h3>
                <div className="row">
                    <div className="column large-8">
                        <div>
                            <input type="text" onChange={this.filter.bind(this)} placeholder="Type to search" />
                        </div>
                    </div>
                    <div className="column large-2">
                        <div>
                            <select ref={"type"} onChange={this.filterTypeHandle.bind(this)}>
                                <option value={"All"}>All</option>
                                <option value={"Online"}>Online</option>
                                <option value={"Face-to-Face"}>Face-to-Face</option>
                                <option value={"Webinar"}>Webinar</option>
                                <option value={"Hackathon"}>Hackathon</option>
                            </select>
                        </div>
                    </div>
                    <div className={"column large-2"}>
                        <a className={"button float-right"} href={process.env.PUBLIC_URL+"/#/training-resource/create"}> <i className="fas fa-plus-circle"> </i> Add new </a>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>
                                S. No.
                            </th>
                            <th>
                                Details
                            </th>
                            <th>Archive</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ListOfResources}
                    </tbody>
                </table>
            </div>




        );
    }
}

const Resources = () => (
    <Switch>
        <Route exact path='/all-training-resources' component={ResourcesList} />
    </Switch>
);


export default Resources

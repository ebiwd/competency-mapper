import React from 'react'
import { Switch, Route } from 'react-router-dom'
import CKEditor from "react-ckeditor-component"


class ResourceCreate extends React.Component{
    constructor(props){
        super(props);
        //this.onChange = this.onChange.bind(this);
        this.changeDescription = this.changeDescription.bind(this);
        this.changeTargetAudience = this.changeTargetAudience.bind(this);
        this.changeLearningOutcomes = this.changeLearningOutcomes.bind(this);
        this.changeOrganisers = this.changeOrganisers.bind(this);
        this.changeTrainers = this.changeTrainers.bind(this);

        this.state = {
            data: [],
            csrf:'',
            updateFlag:false,
            content:'content',
            description:'',
            target_audience:'',
            learning_outcomes:'',
            organisers:'',
            trainers:'',
        };
    }

    changeDescription(evt){
        let newContent = evt.editor.getData();
        this.setState({description: newContent});
    }

    changeTargetAudience(evt){
        let newContent = evt.editor.getData();
        this.setState({target_audience: newContent});
    }

    changeLearningOutcomes(evt){
        let newContent = evt.editor.getData();
        this.setState({learning_outcomes: newContent});
    }

    changeOrganisers(evt){
        let newContent = evt.editor.getData();
        this.setState({organisers: newContent});
    }

    changeTrainers(evt){
        let newContent = evt.editor.getData();
        this.setState({trainers: newContent});
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.updateFlag){
            setTimeout(() => {
                this.props.history.push("/all-training-resources");
                //this.setState({'updateFlag': false});
            },1000);

            console.log("componentDidUpdate");

        }
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

    componentDidMount(){
        let csrfURL = "https://dev-competency-mapper.pantheonsite.io/rest/session/token";
        fetch(csrfURL)
            .then((Response)=>Response)
            .then((findresponse2)=>{
                this.setState({csrf: findresponse2})
            });
    }

    handleSubmit(event) {
        let title = this.refs.title.value;
        let dates = this.refs.dates.value;
        let dates2 = this.refs.dates2.value;
        let type = 'Online';
        if(this.refs.type.value){
            type = this.refs.type.value;
        }

        let description = this.state.description;
        let location = this.refs.location.value;
        let url = this.refs.url.value;
        let target_audience = this.state.target_audience;
        let learning_outcomes = this.state.learning_outcomes;
        let keywords = this.refs.keywords.value;
        let organisers = this.state.organisers;
        let trainers = this.state.trainers;

        let token = localStorage.getItem('csrf_token');

        //alert(learning_outcomes);

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
                                "href":"https://dev-competency-mapper.pantheonsite.io/rest/type/node/training_resource"
                            },
                        },
                        "title":[
                            {
                                "value":title
                            }
                        ],
                        "field_dates":[
                            {
                                "value":dates
                            }
                        ],
                        "field_end_date":[
                            {
                                "value":dates2
                            }
                        ],
                        "field_type":[
                            {
                                "value":type
                            }
                        ],
                        "field_description":[
                            {
                                "value":description,
                                "format": "basic_html"
                            }
                        ],
                        "field_location":[
                            {
                                "value":location
                            }
                        ],
                        "field_url":[
                            {
                                "value":url
                            }
                        ],
                        "field_target_audience":[
                            {
                                "value":target_audience,
                                "format": "basic_html"
                            }
                        ],
                        "field_learning_outcomes":[
                            {
                                "value": learning_outcomes,
                                "format": "basic_html"
                            },
                        ],
                        "field_keywords":[
                            {
                                "value":keywords
                            }
                        ],
                        "field_organisers":[
                            {
                                "value":organisers,
                                "format": "basic_html"
                            }
                        ],
                        "field_trainers":[
                            {
                                "value":trainers,
                                "format": "basic_html"
                            }
                        ],

                        "type":[
                            {
                                "target_id": "training_resource"
                            }
                        ],
                    }
                )
            });

        event.target.reset();
        this.setState({'updateFlag':true});
        event.preventDefault();

    }



    render() {
        this.checkUser();
        return (
            <div>
                <h2>Create Training Resources</h2>

                <div className="row">
                    <div className="column large-12 callout">
                        <h4>Create new competency</h4>
                        <form className="form" id={"resource_create_form"} onSubmit={this.handleSubmit.bind(this)}>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Title</strong>
                                    <input type="text" ref="title" required placeholder="Title"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-6">
                                    <strong>Start Date</strong>
                                    <input type="date" ref="dates" placeholder="Date"/>
                                </div>
                                <div className="column large-6">
                                    <strong>End Date</strong>
                                    <input type="date" ref="dates2" placeholder="Date"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Event type</strong>
                                    <select ref={"type"}>
                                        <option value={"Online"}>Online</option>
                                        <option value={"Face-to-Face"}>Face-to-Face</option>
                                        <option value={"Webinar"}>Webinar</option>
                                        <option value={"Hackathon"}>Hackathon</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Description</strong>
                                    <CKEditor content={this.state.description}
                                              events={{
                                                  "change": this.changeDescription
                                              }} activeClass="p10" required />
                                    {/*<textarea rows={"5"} ref="description" required placeholder="Description"/>*/}
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Location</strong>
                                    <input type="text" ref="location" placeholder="Location"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>URL</strong>
                                    <input type="text" ref="url" required placeholder="URL"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Target audience</strong>
                                    <CKEditor content={this.state.target_audience}
                                              events={{
                                                  "change": this.changeTargetAudience
                                              }} activeClass="p10" />
                                    {/*<input type="text" ref="target_audience" required placeholder="Target audience"/>*/}
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Learning outcomes</strong>
                                    <CKEditor content={this.state.learning_outcomes}
                                              events={{
                                                  "change": this.changeLearningOutcomes
                                              }} activeClass="p10" />
                                    {/*<textarea rows={"5"} ref="learning_outcomes" required placeholder="Learning outcomes"/>*/}
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Organisers</strong>
                                    <CKEditor content={this.state.organisers}
                                              events={{
                                                  "change": this.changeOrganisers
                                              }} activeClass="p10" />

                                    {/*<textarea rows={"5"} ref="organisers" required placeholder="Organisers"/>*/}
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Trainers</strong>
                                    <CKEditor content={this.state.trainers}
                                              events={{
                                                  "change": this.changeTrainers
                                              }} activeClass="p10" />
                                    {/*<textarea rows={"5"} ref="trainers" required placeholder="Trainers"/>*/}
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Keywords</strong>
                                    <input type="text" ref="keywords" placeholder="Keywords"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-2">
                                    <input type="submit" className="button" value="Submit" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        )

    }

}

const CreateResources = () => (
    <Switch>
        <Route exact path='/training-resource/create' component={ResourceCreate} />
    </Switch>
)

export default CreateResources;
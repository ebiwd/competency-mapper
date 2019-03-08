import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import CKEditor from "react-ckeditor-component"

class ResourceEdit extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            data: [],
            csrf: '',
            updateFlag: false,
            path: this.props.location.pathname.split("/"),
            nid: '',
            title: '',
            dates:'',
            dates2:'',
            type:'',
            description: '',
            location: '',
            url: '',
            target_audience:'',
            learning_outcomes:'',
            keywords:'',
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

    componentDidMount() {
        this.setState({'nid': this.state.path[3]});
        let nid = this.state.path[3];

        let csrfURL = "https://dev-competency-mapper.pantheonsite.io/rest/session/token";
        fetch(csrfURL)
            .then((Response) => Response)
            .then((findresponse2) => {
                this.setState({csrf: findresponse2})
            });

        //let fetchResource = "http://dev-competency-mapper.pantheonsite.io/api/v1/training-resources/"+nid+"?_format=json";
        let fetchResource = "https://dev-competency-mapper.pantheonsite.io/api/v1/training-resources/all?_format=json";
        fetch(fetchResource)
            .then((Response) => Response.json())
            .then((findresponse) => {
                this.setState({
                    data: findresponse,

                })
            });
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

    render(){
        this.checkUser();
        let nid = '';
        let title = '';
        let dates ='';
        let dates2 ='';
        let type ='';
        let description = '';
        let location = '';
        let url = '';
        let target_audience='';
            let learning_outcomes ='';
            let keywords ='';
            let organisers ='';
            let trainers = '';
            let temp_date = [];

        this.state.data.map((item) => {
                {
                    if(item.id === this.state.nid) {
                        nid = item.id;
                        title = item.title;
                        //temp_date = item.dates.split("-");
                        dates = item.start_date;
                        dates2 = item.end_date;
                        type = item.type;
                        description = item.description;
                        location = item.location;
                        url = item.url;
                        target_audience = item.target_audience;
                        learning_outcomes = item.learning_outcomes;
                        keywords = item.keywords;
                        organisers = item.organisers;
                        trainers = item.trainers;
                    }
                }
            }
        );
            if(this.state.data.length > 0) {
                console.log(title);
                return(
                    <EditForm nid={nid} title={title} dates={dates} dates2={dates2} type={type} description={description}
                              location={location} url={url} target_audience={target_audience} learning_outcomes={learning_outcomes}
                              keywords={keywords} organisers={organisers} trainers={trainers} />
                )
            }else{
                return(null)
            }
        }


}

class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nid: this.props.nid,
            title: this.props.title,
            dates: this.props.dates,
            dates2: this.props.dates2,
            type: this.props.type,
            description: this.props.description,
            location: this.props.location,
            url: this.props.url,
            target_audience: this.props.target_audience,
            learning_outcomes: this.props.learning_outcomes,
            keywords: this.props.keywords,
            organisers: this.props.organisers,
            trainers: this.props.trainers,
            redirect: false,
            updateFlag:false,
            csrf:'',
        };
        this.handleTitle = this.handleTitle.bind(this);
        this.handleDates = this.handleDates.bind(this);
        this.handleDates2 = this.handleDates2.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleDesc = this.handleDesc.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.handleURL = this.handleURL.bind(this);
        this.handleTargetAudience = this.handleTargetAudience.bind(this);
        this.handleLearningOutcomes = this.handleLearningOutcomes.bind(this);
        this.handleKeywords = this.handleKeywords.bind(this);
        this.handleOrganisers = this.handleOrganisers.bind(this);
        this.handleTrainers = this.handleTrainers.bind(this);

    }

    componentDidMount(){
        let csrfURL = "https://dev-competency-mapper.pantheonsite.io/rest/session/token";
        fetch(csrfURL)
            .then((Response) => Response)
            .then((findresponse2) => {
                this.setState({csrf: findresponse2})
            });
    }

    static contextTypes = {
        router: PropTypes.object
    };

    handleTitle(event){
        this.setState({'title':event.value})
    }

    handleDates(event){
        this.setState({'dates':event.value})
    }

    handleDates2(event){
        this.setState({'dates2':event.value})
    }

    handleType(event){
        this.setState({'type':event.value})
    }

    handleDesc(event){
        this.setState({'description':event.editor.getData()})
    }
    handleLocation(event){
        this.setState({'location':event.value})
    }
    handleURL(event){
        this.setState({'url':event.value})
    }

    handleTargetAudience(event){
        this.setState({'target_audience':event.editor.getData()})
    }

    handleLearningOutcomes(event){
        this.setState({'learning_outcomes':event.editor.getData()})
    }

    handleKeywords(event){
        this.setState({'keywords':event.value})
    }

    handleOrganisers(event){
        this.setState({'organisers':event.editor.getData()})
    }

    handleTrainers(event){
        this.setState({'trainers':event.editor.getData()})
    }

    setRedirect = () => {
        this.props.history.push('all-training-resources');
    };

    componentDidUpdate(prevProps, prevState){
        if(this.state.updateFlag){
            setTimeout(() => {
                this.context.router.history.push('/training-resources/'+this.state.nid);
            },1000);

            console.log("componentDidUpdate");

        }
    }


    handleSubmit(event) {

        let nid = this.state.nid;
        let title = this.refs.title.value;
        let dates = this.refs.dates.value;
        let dates2 = this.refs.dates2.value;
        let type = this.refs.type.value;
        let description = this.state.description;
        let location = this.refs.location.value;
        let url = this.refs.url.value;
        let target_audience = this.state.target_audience;
        let learning_outcomes = this.state.learning_outcomes;
        let organisers = this.state.organisers;
        let trainers = this.state.trainers;
        let keywords = this.refs.keywords.value;
        let csrf = localStorage.getItem('csrf_token');

        fetch('https://dev-competency-mapper.pantheonsite.io/node/'+nid+'?_format=hal_json', {
            method: 'PATCH',
            'cookies': 'x-access-token',
            headers: {
                'Accept': 'application/hal+json',
                'Content-Type': 'application/hal+json',
                'X-CSRF-Token': csrf,//'yoM7eSiML2AI6A3FGH2EKCaX_agiJfmYkRIPL0MdPlI',
                'Authorization': 'Basic',
            },
            body: JSON.stringify(
                {
                    "_links": {
                        "type": {
                            "href": "https://dev-competency-mapper.pantheonsite.io/rest/type/node/training_resource"
                        },
                    },
                    "title": [
                        {
                            "value": title
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
                    "field_description": [
                        {
                            "value": description,
                            "format": "basic_html"
                        }
                    ],
                    "field_location": [
                        {
                            "value": location
                        }
                    ],
                    "field_url": [
                        {
                            "value": url
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
                            "value":learning_outcomes,
                            "format": "basic_html"
                        }
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
                    "type": [
                        {
                            "target_id": "training_resource"
                        }
                    ],
                }
            )
        });

        //event.target.reset();

        event.preventDefault();
        this.setState({'updateFlag':true});
    }

    render() {


        return (
            <div>
                <h2>Edit Training Resources</h2>

                <div className="row">
                    <div className="column large-12 callout">

                        <form className="form" id={"resource_edit_form"} onSubmit={this.handleSubmit.bind(this)}>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Title</strong>
                                    <input type="text" ref="title" id={"title"} value={this.state.title} onChange={this.handleTitle.bind(this)} required placeholder="Title"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-6">
                                    <strong>Dates</strong>
                                    <input type="date" ref="dates" value={this.state.dates} onChange={this.handleDates.bind(this)} placeholder="Date"/>
                                </div>
                                <div className="column large-6">
                                    <strong>Dates</strong>
                                    <input type="date" ref="dates2" value={this.state.dates2} onChange={this.handleDates2.bind(this)} placeholder="Date"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Event type</strong>
                                    <select ref={"type"} value={this.state.type} onChange={this.handleType.bind(this)} >
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
                                                  "change": this.handleDesc
                                              }} activeClass="p10"  required/>
                                    {/*<textarea rows={"5"} ref="description" value={this.state.description} onChange={this.handleDesc.bind(this)} required placeholder="Description"/>*/}
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Location</strong>
                                    <input type="text" ref="location" value={this.state.location} onChange={this.handleLocation.bind(this)}  placeholder="Location"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>URL</strong>
                                    <input type="text" ref="url" value={this.state.url} onChange={this.handleURL.bind(this)} required placeholder="URL"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Target audience</strong>
                                    <CKEditor content={this.state.target_audience}
                                              events={{
                                                  "change": this.handleTargetAudience
                                              }} activeClass="p10" />
                                    {/*<textarea rows={"5"} ref="target_audience" value={this.state.target_audience} onChange={this.handleTargetAudience.bind(this)} required placeholder="Target audience"/>*/}
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Learning outcomes</strong>
                                    <CKEditor content={this.state.learning_outcomes}
                                              events={{
                                                  "change": this.handleLearningOutcomes
                                              }} activeClass="p10" />
                                    {/*<textarea rows={"5"} ref="learning_outcomes" value={this.state.learning_outcomes} onChange={this.handleLearningOutcomes.bind(this)} required placeholder="Learning outcomes"/>*/}
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Organisers</strong>
                                    <CKEditor content={this.state.organisers}
                                              events={{
                                                  "change": this.handleOrganisers
                                              }} activeClass="p10" />
                                    {/*<textarea rows={"5"} ref="organisers" value={this.state.organisers} onChange={this.handleOrganisers.bind(this)} required placeholder="Organisers"/>*/}
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Trainers</strong>
                                    <CKEditor content={this.state.trainers}
                                              events={{
                                                  "change": this.handleTrainers
                                              }} activeClass="p10" />
                                    {/*<textarea rows={"5"} ref="trainers" value={this.state.trainers} onChange={this.handleTrainers.bind(this)} required placeholder="Trainers"/>*/}
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-12">
                                    <strong>Keywords</strong>
                                    <input type="text" ref="keywords" value={this.state.keywords} onChange={this.handleKeywords.bind(this)}  placeholder="Keywords"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="column large-2">
                                    <input type="submit" className="button" value="Update" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        )

    }


}

const EditResources = () => (
    <Switch>
        <Route exact path='/training-resource/edit/:nid' component={ResourceEdit} />
    </Switch>
);

export default EditResources;
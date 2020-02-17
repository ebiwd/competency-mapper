import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CKEditor from 'react-ckeditor-component';
import FileUpload from './FileUpload';
import { apiUrl } from '../services/http/http';
import Dropzone from 'react-dropzone';

class ArticleCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: [],
      fid: ''
    };
  }

  componentDidUpdate(prevProps, prevState) {}

  componentDidMount() {
    let csrfURL = `${apiUrl}/rest/session/token`;
    fetch(csrfURL)
      .then(Response => Response)
      .then(findresponse2 => {
        this.setState({ csrf: findresponse2 });
      });
  }

  async handleSubmit(event) {
    let title = this.refs.title.value;
    let token = localStorage.getItem('csrf_token');
    let fid = '';
    //let file = this.refs.fileref.value;
    console.log(this.state.file);
    //alert(learning_outcomes);

    let fileinfo = await fetch(
      `${apiUrl}/file/upload/node/article/field_hero_image?_format=json`,
      {
        credentials: 'include',
        method: 'POST',
        cookies: 'x-access-token',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/octet-stream',
          'X-CSRF-Token': token,
          'Content-Disposition': 'file; filename="filename.jpg"',
          Authorization: 'Basic'
        },
        // body: JSON.stringify({
        //   _links: {
        //     type: {
        //       href: `${apiUrl}/rest/type/node/article`
        //     }
        //   },
        //   title: [
        //     {
        //       value: title
        //     }
        //   ],
        //   type: [
        //     {
        //       target_id: 'article'
        //     }
        //   ]
        // })
        data: [
          {
            value: this.state.file
          }
        ]
      }
    );
    // .then((resp) => resp.json())
    //   .then(function(data) {
    //     //console.log(data.fid[0].value);
    //     return data.fid[0].value;
    //     //his.setState({fid:data.fid[0].value});
    // })
    console.log(fileinfo.json());
    //event.target.reset();
    this.setState({ updateFlag: true });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h2>File upload</h2>

        <div className="row">
          <div className="column large-12 callout">
            <h4>Bulk upload training resources</h4>
            <form
              className="form"
              id={'resource_create_form'}
              onSubmit={this.handleSubmit.bind(this)}
            >
              <div id="fileupload" className="row">
                <div className="column large-12">
                  <strong>File upload</strong>
                  <Dropzone
                    ref="fileref"
                    onDrop={acceptedFiles => {
                      //console.log(acceptedFiles)
                      const reader = new FileReader();

                      reader.onabort = () =>
                        console.log('file reading was aborted');
                      reader.onerror = () =>
                        console.log('file reading has failed');
                      reader.onload = () => {
                        // Do whatever you want with the file contents
                        const binaryStr = reader.result;
                        this.setState({ file: binaryStr });
                        //console.log(binaryStr)
                      };
                      document
                        .getElementById('fileupload')
                        .append(acceptedFiles[0].name);
                      acceptedFiles.forEach(file =>
                        reader.readAsArrayBuffer(file)
                      );
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <a href="#">Click to select files</a>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </div>
              </div>

              <div className="row">
                <div className="column large-12">
                  <strong>Remarks</strong>
                  <input
                    type="text"
                    ref="title"
                    required
                    placeholder="Remarks"
                  />
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
    );
  }
}

const CreateArticles = () => (
  <Switch>
    <Route exact path="/article/create" component={ArticleCreate} />
  </Switch>
);

export default CreateArticles;

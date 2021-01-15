import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CKEditor from 'react-ckeditor-component';
import FileUpload from './FileUpload';
import { apiUrl } from '../services/http/http';
import Dropzone from 'react-dropzone';

class ArticleCreate extends React.Component {
  constructor(props) {
    super(props);

    this.createArticle = this.createArticle.bind(this);

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
    event.preventDefault();
    let title = this.refs.title.value;
    let token = localStorage.getItem('csrf_token');
    let fid = '';

    console.log(this.state.file);

    let response = await fetch(
      apiUrl + '/file/upload/node/article/field_image?_format=hal_json',
      {
        credentials: 'include',
        method: 'POST',
        cookies: 'x-access-token',
        headers: {
          accept: 'application/octet-stream',
          'Content-Type': 'application/octet-stream',
          'X-CSRF-Token': token,
          'Content-Disposition': 'file; filename="prakash_file.png"'
        },
        body: this.state.file
      }
    )
      .then(resp => resp.json())
      .then(
        function(data) {
          this.setState({ fid: data.fid[0].value }, this.createArticle);
        }.bind(this)
      );
  }

  createArticle() {
    let token = localStorage.getItem('csrf_token');
    fetch(`${apiUrl}/node/6771?_format=hal_json`, {
      credentials: 'include',
      method: 'PATCH',
      cookies: 'x-access-token',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/hal+json',
        'X-CSRF-Token': token,
        Authorization: 'Basic'
      },
      body: JSON.stringify({
        _links: {
          type: {
            href: `${apiUrl}/rest/type/node/article`
          }
        },
        field_image: [
          {
            target_id: this.state.fid,
            description: 'The most fascinating image ever!'
          }
        ]
      })
    });
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
                        //const binaryStr = reader.result;
                        var stringImage = reader.result;
                        if (stringImage) {
                          console.log(' image content =' + stringImage);
                          var striped = stringImage.toString().split('base64');
                          if (striped[1]) {
                            //this.uploadDrupalImage(striped[1]);
                            this.setState({ newfile: striped[1] });
                          }
                        }
                        this.setState({ file: reader.result });
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

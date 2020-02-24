import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
//import CKEditor from 'react-ckeditor-component';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileUpload from './FileUpload';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';
//import ProfilePreview from './ProfilePreview';

export const ProfileCreate = props => {
  const activeRequests = new ActiveRequestsService();
  const profileService = new ProfileService();
  const [title, setTitle] = useState();
  const [age, setAge] = useState();
  const [currentRole, setCurrentRole] = useState();
  const [gender, setGender] = useState();

  const [selectedFile, setSelectedFile] = useState();
  const [fid, setFid] = useState();
  const [imgpreview, setImgpreview] = useState();

  const [jobTitle, setJobTitle] = useState();
  const [qualification, setQualification] = useState();

  const [framework, setFramework] = useState();
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];

  //const [preview, setPreview] = useState()

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json`
      )
        .then(Response => Response.json())
        .then(findresponse => {
          setFramework(findresponse);
        });
    };
    //console.log(frameworkName + ' ' + frameworkVersion)
    fetchData();

    if (!selectedFile) {
      setImgpreview(undefined);
      console.log('file not selected');
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setImgpreview(objectUrl);

    // free memory when ever this component is unmounted
    // return () => URL.revokeObjectURL(objectUrl)

    // const checkFile = async () => {
    //   let token = localStorage.getItem('csrf_token');

    //   await fetch(apiUrl + '/file/upload/node/profile/field_image?_format=hal_json', {
    //               credentials: 'include',
    //               method: 'POST',
    //               cookies: 'x-access-token',
    //               headers: {
    //                    accept: 'application/octet-stream',
    //                 'Content-Type': 'application/octet-stream',
    //                 'X-CSRF-Token': token,
    //                'Content-Disposition': 'file; filename="persona_picture.png"',
    //               },
    //               body: selectedFile
    //             })
    //               .then((resp) => resp.json())
    //               .then(function(data) {
    //                 console.log(data.fid[0].value)
    //                     setFid(data.fid[0].value)
    //                });
    //             };
    //             checkFile();
  }, [selectedFile]);

  const checkFile = async () => {
    if (selectedFile) {
      let token = localStorage.getItem('csrf_token');
      console.log(selectedFile);

      await fetch(
        apiUrl + '/file/upload/node/profile/field_image?_format=hal_json',
        {
          credentials: 'include',
          method: 'POST',
          cookies: 'x-access-token',
          headers: {
            accept: 'application/octet-stream',
            'Content-Type': 'application/octet-stream',
            'X-CSRF-Token': token,
            'Content-Disposition': 'file; filename="persona_picture.png"'
          },
          body: selectedFile
        }
      )
        .then(resp => resp.json())
        .then(function(data) {
          console.log(data.fid[0].value);
          setFid(data.fid[0].value);
        });
    }
  };

  const handleSubmit = async evt => {
    evt.preventDefault();
    let frameworkId = framework[0].nid; //9
    let frameworkUuid = framework[0].uuid; //'b20064ef-5cbf-4147-90f8-08e7a6693e17';
    var arrayBuffer = '';

    await checkFile();
    console.log(fid);

    let response = await profileService.createProfile({
      title,
      frameworkId,
      frameworkUuid,
      age,
      currentRole,
      gender,
      jobTitle,
      qualification,
      fid
    });

    console.log(title + ' ' + selectedFile);

    //console.log(response.path[0].alias);
    //console.log(response);

    props.history.push(
      `/framework/bioexcel/2.0/profile/view/${response.nid[0].value}`
    );
  };

  const setPreview = () => {
    console.log('redirecting');
    ////return <Redirect to='/' />
    props.history.push('/framework/bioexcel/2.0/profile/preview', {
      title: title
    });
  };

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  const clearimgpreview = e => {
    e.preventDefault();
    setSelectedFile(undefined);
    document.getElementById('fileupload').value = '';
  };

  return (
    <div>
      <div>
        <h2>Create reference profile</h2>
        <form className="form" id="profile_create_form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="column large-12">
              <strong>Title</strong>
              <input
                type="text"
                id="title"
                placeholder="Title"
                onChange={e => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div id="fileupload" className="row">
            <div className="column large-3">
              <strong>Image</strong>
              <input type="file" id="imagefile" onChange={onSelectFile} />
            </div>
            <div className="column large-9">
              <img
                id="imgpreview_image"
                width="100px"
                src={imgpreview}
                height="100px"
                style={{
                  border: '1px solid #ccc',
                  padding: '5px',
                  width: '30%'
                }}
              />
              {imgpreview ? (
                <a href="#" onClick={e => clearimgpreview(e)}>
                  Clear image x
                </a>
              ) : (
                ''
              )}
            </div>
          </div>

          <div className="row">
            <div className="column large-12">
              <strong>Job title</strong>
              <input
                type="text"
                id="jobTitle"
                placeholder="Job title"
                onChange={e => setJobTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="column large-12">
              <strong>Age (in years)</strong>
              <input
                type="number"
                id="age"
                placeholder="Age"
                onChange={e => setAge(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="column large-12">
              <strong>Gender</strong>
              <select
                defaultValue="-None-"
                onChange={e => setGender(e.target.value)}
              >
                <option value={'-None-'}>None</option>
                <option value={'Male'}>Male</option>
                <option value={'Female'}>Female</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="column large-12">
              <strong>Acitivities of current role</strong>
              <CKEditor
                editor={ClassicEditor}
                data={currentRole}
                onInit={editor => {
                  console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setCurrentRole(data);
                }}
              />
            </div>
          </div>

          <div className="row">
            <div className="column large-12">
              <strong>Qualification and background</strong>
              <CKEditor
                editor={ClassicEditor}
                data={qualification}
                onInit={editor => {
                  console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setQualification(data);
                }}
              />
            </div>
          </div>

          <p />
          <div className="row">
            <div className="column medium-2" />
            <div className="column medium-3">
              <input
                type="submit"
                className="button"
                value="Save and continue"
              />
            </div>
            <div className="column medium-7" />
          </div>
        </form>
      </div>
    </div>
  );
};

export const CreateProfile = () => (
  <Switch>
    <Route
      exact
      path="/framework/:framework/:version/profile/create"
      component={ProfileCreate}
    />
  </Switch>
);

export default CreateProfile;

/*checkUser() {
    if (!localStorage.getItem('roles')) {
      this.props.history.push('/');
    } else if (!localStorage.getItem('roles').includes('content_manager')) {
      alert(
        'You are not authorised to access this page. Contact the administrator'
      );
      this.props.history.push('/');
    }
    console.log(localStorage.getItem('roles'));
  }*/

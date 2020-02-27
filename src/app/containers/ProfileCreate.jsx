import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileUpload from './FileUpload';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { Link, Redirect } from 'react-router-dom';

export const ProfileCreate = props => {
  const activeRequests = new ActiveRequestsService();
  const profileService = new ProfileService();
  const [title, setTitle] = useState();
  const [age, setAge] = useState();
  const [currentRole, setCurrentRole] = useState();
  const [gender, setGender] = useState();

  const [selectedFile, setSelectedFile] = useState();
  const [selectedFileData, setSelectedFileData] = useState([]);
  const [fid, setFid] = useState();
  const [imgpreview, setImgpreview] = useState();

  const [jobTitle, setJobTitle] = useState();
  const [qualification, setQualification] = useState();

  const [framework, setFramework] = useState();
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];

  const [errorMsgTitle, setErrorMsgTitle] = useState();
  const [errorMsgJobTitle, setErrorMsgJobTitle] = useState();
  let errors = [];

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

    fetchData();
  }, [selectedFile]);

  const handleSubmit = async evt => {
    evt.preventDefault();
    let frameworkId = framework[0].nid;
    let frameworkUuid = framework[0].uuid;
    var arrayBuffer = '';
    var fileid = null;

    // Do nothing if Form doesn't pass validation criteris above
    if (!title || !jobTitle || title.length < 2 || jobTitle.length < 3) {
    }
    // Check if is Anonymous/Authenticated
    else if (!localStorage.getItem('roles')) {
      setErrorMsgTitle('');
      setErrorMsgJobTitle('');

      profileService.downloadProfile({
        title,
        frameworkId,
        frameworkUuid,
        age,
        currentRole,
        gender,
        jobTitle,
        qualification,
        selectedFile,
        selectedFileData
      });
    } else if (localStorage.getItem('roles').includes('framework_manager')) {
      if (selectedFile) {
        let token = localStorage.getItem('csrf_token');
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
            fileid = data.fid[0].value;
          });
      }

      let response = await profileService.createProfile({
        title,
        frameworkId,
        frameworkUuid,
        age,
        currentRole,
        gender,
        jobTitle,
        qualification,
        fileid
      });

      props.history.push(
        `/framework/bioexcel/2.0/profile/view/${response.nid[0].value}`
      );
    }
  };

  const setPreview = () => {
    props.history.push('/framework/bioexcel/2.0/profile/preview', {
      title: title
    });
  };

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    } else {
      const objectUrl = URL.createObjectURL(e.target.files[0]);

      // convert image file to base64 string. From https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        function() {
          // Set Image Preview
          setImgpreview(reader.result);

          // Set selected image src
          let img = new Image();
          img.src = reader.result;
          img.addEventListener('load', function() {
            img.width = this.width;
            img.height = this.height;

            setSelectedFileData([
              {
                src: this.src,
                width: this.width,
                height: this.height
              }
            ]);
          });
        },
        false
      );
      if (e.target.files) {
        reader.readAsDataURL(e.target.files[0]);
      }

      setSelectedFile(e.target.files[0]);
    }
  };

  const clearimgpreview = e => {
    e.preventDefault();
    setSelectedFile(undefined);
    setImgpreview(undefined);
    document.getElementById('fileupload').value = '';
  };

  function ButtonLabel() {
    let submitButtonLabel = 'Save and continue';
    if (!localStorage.getItem('roles')) {
      submitButtonLabel = 'Download';
    }

    return <input type="submit" className="button" value={submitButtonLabel} />;
  }

  const getWhoCreateProfile = () => {
    let placeholder = 'a reference';
    if (!localStorage.getItem('roles')) {
      placeholder = 'your';
    }
    return placeholder;
  };

  const placeholder = getWhoCreateProfile();

  // Check if Fields are not empty hide Help Text
  let titleCalloutClass = 'small callout alert';
  let jobTitleCalloutClass = 'small callout alert';
  let nameHelp = 'Name is required and must be at least 2 characters long';
  let jobTitleHelp =
    'Job Title is required and must be at least 3 characters long';
  if (title) {
    if (title.length > 1) {
      nameHelp = '';
      titleCalloutClass = '';
    }
  }

  if (jobTitle) {
    if (jobTitle.length > 2) {
      jobTitleHelp = '';
      jobTitleCalloutClass = '';
    }
  }

  return (
    <div>
      <h2>Create {placeholder} profile</h2>
      <form className="form" id="profile_create_form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="column large-4">
            <span>
              <strong>Name</strong>
              <input
                type="text"
                id="title"
                placeholder="Name"
                onChange={e => setTitle(e.target.value)}
              />
              <div className={titleCalloutClass}>
                <i>{nameHelp}</i>
              </div>
            </span>
          </div>
          <div className="column large-8">
            <span>
              <strong>Job title</strong>
              <input
                type="text"
                id="jobTitle"
                placeholder="Job title"
                onChange={e => setJobTitle(e.target.value)}
              />
              <div className={jobTitleCalloutClass}>
                <i>{jobTitleHelp}</i>
              </div>
            </span>
          </div>
        </div>

        <div className="row">
          <div className="column large-4">&nbsp;</div>
          <div className="column large-8" />
        </div>

        <div className="row">
          <div className="column large-4">
            <span>
              <strong>Image</strong>
              <input type="file" id="imagefile" onChange={onSelectFile} />
            </span>

            <span>
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
                <div>
                  <a href="#" onClick={e => clearimgpreview(e)}>
                    Clear image x
                  </a>
                </div>
              ) : (
                ''
              )}
            </span>

            <br />
            <br />
            <span>
              <strong>Age (in years)</strong>
              <input
                type="number"
                id="age"
                placeholder="Age"
                width={4}
                onChange={e => setAge(e.target.value)}
              />
            </span>

            <span>
              <strong>Gender</strong>
              <select
                defaultValue="-None-"
                onChange={e => setGender(e.target.value)}
              >
                <option value={'-None-'}>None</option>
                <option value={'Male'}>Male</option>
                <option value={'Female'}>Female</option>
              </select>
            </span>
          </div>
          <div className="column large-8">
            <span>
              <strong>Qualification and background</strong>
              <CKEditor
                editor={ClassicEditor}
                data={qualification}
                onInit={editor => {}}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setQualification(data);
                }}
              />
            </span>

            <br />
            <span>
              <strong>Acitivities of current role</strong>
              <CKEditor
                editor={ClassicEditor}
                data={currentRole}
                onInit={editor => {}}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setCurrentRole(data);
                }}
              />
            </span>
          </div>
        </div>

        <p />
        <div className="row">
          <div className="column medium-2" />
          <div className="column medium-3">
            <ButtonLabel />
          </div>
          <div className="column medium-7" />
        </div>
      </form>
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

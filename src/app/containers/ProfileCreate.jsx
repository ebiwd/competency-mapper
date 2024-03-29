import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import HttpService from '../services/http/http';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
import auth from '../services/util/auth';

export const ProfileCreate = props => {
  const profileService = new ProfileService();
  const [title, setTitle] = useState('');
  const [age, setAge] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [gender, setGender] = useState('');

  const [selectedFile, setSelectedFile] = useState();
  const [selectedFileData, setSelectedFileData] = useState([]);
  const [imgpreview, setImgpreview] = useState();
  const [fileSizeError, setFileSizeError] = useState();
  const [fileTypeError, setFileTypeError] = useState();

  const [jobTitle, setJobTitle] = useState('');
  const [qualification, setQualification] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [framework, setFramework] = useState();
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];

  const [profile, setProfile] = useState();

  const [frameworkMoreData, setFrameworkMoreData] = useState();
  const http = new HttpService();

  useEffect(() => {
    // Set variables from Local Storage to populate form fields onload
    const bootstrap = () => {
      let storedProfile = JSON.parse(
        localStorage.getItem('ProfileDownloadData')
      );
      setProfile(storedProfile);

      if (storedProfile) {
        setTitle(storedProfile.title);
        setJobTitle(storedProfile.jobTitle);
        setAge(storedProfile.age);
        setGender(storedProfile.gender);
        setQualification(storedProfile.qualification);
        setCurrentRole(storedProfile.currentRole);
        setAdditionalInfo(storedProfile.additionalInfo);
        if (storedProfile.selectedFileData[0]) {
          setSelectedFileData(storedProfile.selectedFileData);
          setImgpreview(storedProfile.selectedFileData[0].src);
        }
      }
    };

    // Calling multiple APIs, since data Framework are in two different endpoints
    const fetchData = async () => {
      try {
        const promise1 = http
          .get(
            `${apiUrl}/api/${frameworkName}/${frameworkVersion}?_format=json&timestamp=${Date.now()}`
          )
          .then(response1 => response1.data);

        const promise2 = http
          .get(
            `${apiUrl}/api/version_manager?_format=json&timestamp=${Date.now()}`
          )
          .then(response2 => response2.data);

        const [data1, data2] = await Promise.all([promise1, promise2]);

        setFramework(data1);
        setFrameworkMoreData(
          data2.filter(item => {
            return item.title.toLowerCase() === frameworkName;
          })
        );
      } catch (err) {
        console.log(err);
      }
    };

    bootstrap();
    fetchData();
  }, [selectedFile, frameworkName, frameworkVersion, http]);

  const handleSubmit = async evt => {
    evt.preventDefault();
    let frameworkId = framework[0].nid;
    let frameworkName = framework[0].title;
    let frameworkUuid = framework[0].uuid;
    console.log(frameworkMoreData);
    let liveVersion = frameworkMoreData[0].versions.find(
      ver => ver.status === 'live'
    );

    let versionID = liveVersion.id;

    var fileid = null;

    // Do nothing if Form doesn't pass validation criteria above
    if (
      !title ||
      !jobTitle ||
      title.length < 2 ||
      jobTitle.length < 3 ||
      fileTypeError ||
      fileSizeError
    ) {
    }
    // Check if is Anonymous/Authenticated
    else if (auth.currently_logged_in_user.roles.length === 0) {
      //setErrorMsgTitle('');
      //setErrorMsgJobTitle('');

      // Retrieve values from Local Storage if exist
      let storedProfile = JSON.parse(
        localStorage.getItem('ProfileDownloadData')
      );

      profileService.mapDownloadProfile({
        title,
        frameworkId,
        //frameworkLogoData,
        frameworkName,
        frameworkUuid,
        age,
        currentRole,
        gender,
        jobTitle,
        qualification,
        additionalInfo,
        selectedFile,
        // selectedFileData: storedProfile ? selectedFileData ? selectedFileData : '' : '',
        selectedFileData,
        mapping: storedProfile ? storedProfile.mapping : [],
        mappingAttributes: storedProfile ? storedProfile.mappingAttributes : []
      });
      //props.history.push('/framework/bioexcel/2.0/profile/map/download/');
    } else if (
      auth.currently_logged_in_user.roles.includes('framework_manager')
    ) {
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
        versionID,
        age,
        currentRole,
        gender,
        jobTitle,
        qualification,
        additionalInfo,
        fileid
      });

      props.history.push(
        `/framework/${frameworkName.toLowerCase()}/${frameworkVersion}/profile/map/${
          response.nid[0].value
        }`
      );
    }
  };

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    } else {
      //const objectUrl = URL.createObjectURL(e.target.files[0]);

      if (e.target.files[0].size > 2097152) {
        setFileSizeError(1);
      } else {
        setFileSizeError(undefined);
      }

      if (
        e.target.files[0].type !== 'image/jpeg' &&
        e.target.files[0].type !== 'image/png'
      ) {
        setFileTypeError(1);
      } else {
        setFileTypeError(undefined);
      }

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
    setFileTypeError(undefined);
    setFileSizeError(undefined);
    document.getElementById('fileupload').value = '';
  };

  function ButtonLabel() {
    let submitButtonLabel = 'Map Competencies';
    if (auth.currently_logged_in_user.roles.length > 0) {
      submitButtonLabel = 'Map Competencies';
    }

    return (
      <input
        type="submit"
        className="vf-button vf-button--sm vf-button--primary"
        value={submitButtonLabel}
      />
    );
  }

  const getWhoCreateProfile = () => {
    let placeholder = 'a reference';
    if (auth.currently_logged_in_user.roles.length === 0) {
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
      <form
        className="vf-form"
        id="profile_create_form"
        onSubmit={handleSubmit}
      >
        <div className="vf-grid vf-grid__col-6">
          <div className="vf-grid__col--span-2">
            <span>
              <strong>Name</strong>
              <input
                type="text"
                id="title"
                placeholder="Name"
                onChange={e => setTitle(e.target.value)}
                defaultValue={profile ? profile.title : title}
                className="vf-form__input"
              />
              <div className={titleCalloutClass}>
                <i>{nameHelp}</i>
              </div>
            </span>
            <span>
              <strong>Image</strong>
              <input type="file" id="fileupload" onChange={onSelectFile} />
            </span>
            <span>
              <img
                alt=""
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
                  <button
                    className="vf-button vf-button--secondary vf-button--sm"
                    href="#"
                    onClick={e => clearimgpreview(e)}
                  >
                    Clear image x
                  </button>
                </div>
              ) : (
                ''
              )}

              {fileSizeError ? (
                <div className="small callout alert">
                  <em> Image size should not be more than 2 MB </em>{' '}
                </div>
              ) : (
                ''
              )}

              {fileTypeError ? (
                <div className="small callout alert">
                  <em> Only JPG or PNG images are allowed </em>{' '}
                </div>
              ) : (
                ''
              )}
            </span>
            <span>
              <strong>Age (in years)</strong>
              <input
                type="number"
                id="age"
                placeholder="Age"
                width={4}
                onChange={e => setAge(e.target.value)}
                defaultValue={profile ? profile.age : age}
                className="vf-form__input"
              />
            </span>

            <span>
              <strong>Gender</strong>
              <select
                onChange={e => setGender(e.target.value)}
                defaultValue={profile ? profile.gender : gender}
                className="vf-form__input"
              >
                <option value={'None'}>None</option>
                <option value={'Male'}>Male</option>
                <option value={'Female'}>Female</option>
                <option value={'Nonbinary'}>Nonbinary</option>
                <option value={'Prefernottosay'}>Prefer not to say</option>
              </select>
            </span>
          </div>
          <div className="vf-grid__col--span-4">
            <span>
              <strong>Job title</strong>
              <input
                type="text"
                id="jobTitle"
                placeholder="Job title"
                onChange={e => setJobTitle(e.target.value)}
                defaultValue={profile ? profile.jobTitle : jobTitle}
                className="vf-form__input"
              />
              <div className={jobTitleCalloutClass}>
                <i>{jobTitleHelp}</i>
              </div>
            </span>
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
                className="vf-form__input"
              />
            </span>

            <br />
            <span>
              <strong>Activities of current role</strong>
              <CKEditor
                editor={ClassicEditor}
                data={currentRole}
                onInit={editor => {}}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setCurrentRole(data);
                }}
                className="vf-form__input"
              />
            </span>

            <br />
            <span>
              <strong>Additional information</strong>
              <CKEditor
                editor={ClassicEditor}
                data={additionalInfo}
                onInit={editor => {}}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setAdditionalInfo(data);
                }}
                className="vf-form__input"
              />
            </span>
            <br />
          </div>
        </div>

        <div className="vf-grid">
          <div />
          <div>
            <ButtonLabel />
          </div>
          <div />
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

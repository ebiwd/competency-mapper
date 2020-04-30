import React, { useState, useEffect } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CompetencyService from '../services/competency/competency';
import { apiUrl } from '../services/http/http';
import ProfileService from '../services/profile/profile';
import ActiveRequestsService from '../services/active-requests/active-requests';

const activeRequests = new ActiveRequestsService();
const competencyService = new CompetencyService();
const profileService = new ProfileService();

export const ProfileCreate = props => {
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
  const [frameworkLogoData, setFrameworkLogoData] = useState([]);
  const frameworkName = props.location.pathname.split('/')[2];
  const frameworkVersion = props.location.pathname.split('/')[3];

  const [profile, setProfile] = useState();

  const profileName = process.env.REACT_APP_LOCALSTORAGE_PROFILE;

  useEffect(() => {
    // Set variables from Local Storage to populate form fields onload
    const bootstrap = () => {
      let storedProfile = JSON.parse(localStorage.getItem(profileName));
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
      const [data1, data2] = await Promise.all([
        competencyService.getVersionedFramework(
          frameworkName,
          frameworkVersion
        ),
        competencyService.getAllVersionedFrameworks()
      ]);
      // Get current Framework only
      let frameworkMoreData = data2.filter(item => {
        return item.nid === '9';
      });
      if (frameworkMoreData[0].logo[0].url) {
        // setFrameworkLogoData([
        //   {
        //     url: frameworkMoreData[0].logo[0].url,
        //     src: frameworkMoreData[0].logo[0].url
        //   }
        // ]);

        toDataURL(frameworkMoreData[0].logo[0].url, function(myBase64) {
          let img = new Image();
          img.src = myBase64;
          img.addEventListener('load', function() {
            img.width = this.width;
            img.height = this.height;
            setFrameworkLogoData([
              {
                url: frameworkMoreData[0].logo[0].url,
                src: img.src,
                width: this.width,
                height: this.height
              }
            ]);
          });
        });
      }
      setFramework(data1);
    };

    bootstrap();

    try {
      activeRequests.startRequest();
      fetchData();
    } finally {
      activeRequests.finishRequest();
    }
  }, [frameworkName, frameworkVersion, profileName, selectedFile]);

  const handleSubmit = async evt => {
    evt.preventDefault();
    let frameworkId = framework[0].nid;
    let frameworkName = framework[0].title;
    let frameworkUuid = framework[0].uuid;
    let fileid = null;

    // Do nothing if Form doesn't pass validation criteris above
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
    else if (!localStorage.getItem('roles')) {
      // Retrieve values from Local Storage if exist
      let storedProfile = JSON.parse(localStorage.getItem(profileName));

      profileService.mapUserProfile({
        title,
        frameworkId,
        frameworkLogoData,
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
      props.history.push('./map');
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
        additionalInfo,
        fileid
      });

      props.history.push(
        `/framework/bioexcel/2.0/profile/view/${response.nid[0].value}/${
          response.path[0].alias
        }`
      );
    }
  };

  const setPreview = () => {
    props.history.push('./preview', {
      title: title
    });
  };

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    } else {
      const objectUrl = URL.createObjectURL(e.target.files[0]);

      if (e.target.files[0].size > 2097152) {
        setFileSizeError(1);
      } else {
        setFileSizeError(undefined);
      }

      if (
        e.target.files[0].type != 'image/jpeg' &&
        e.target.files[0].type != 'image/png'
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
    let submitButtonLabel = 'Save and continue';
    if (!localStorage.getItem('roles')) {
      submitButtonLabel = profileService.hasUserProfile()
        ? 'Update competencies'
        : 'Add competencies';
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

  // From https://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
  const getImageData = (url, callback) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
      let reader = new FileReader();
      reader.onloadend = function() {
        return callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };

  const toDataURL = (src, callback, outputFormat) => {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      let canvas = document.createElement('CANVAS');
      let ctx = canvas.getContext('2d');
      let dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      img.src = src;
    }
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
                defaultValue={profile ? profile.title : title}
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
                defaultValue={profile ? profile.jobTitle : jobTitle}
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
              <input type="file" id="fileupload" onChange={onSelectFile} />
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
                defaultValue={profile ? profile.age : age}
              />
            </span>

            <span>
              <strong>Gender</strong>
              <select
                onChange={e => setGender(e.target.value)}
                defaultValue={profile ? profile.gender : gender}
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
              <strong>Activities of current role</strong>
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
              />
            </span>
            <br />
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

export default ProfileCreate;

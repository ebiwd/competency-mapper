import React from 'react';

import Dropzone from 'react-dropzone';

class FileUpload extends React.Component {
  render() {
    return (
      <Dropzone
        onDrop={acceptedFiles => {
          console.log(acceptedFiles);
          const reader = new FileReader();

          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = () => {
            // Do whatever you want with the file contents
            const binaryStr = reader.result;
            console.log(binaryStr);
          };
          document.getElementById('fileupload').append(acceptedFiles[0].name);
          acceptedFiles.forEach(file => reader.readAsArrayBuffer(file));
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button href="#">Click to upload image</button>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}

export default FileUpload;

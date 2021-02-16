import PropTypes from 'prop-types';
import './MapUpload.css';
import axios from 'axios';
import React,{Component} from 'react';
import Block from '../Block/Block';
 
class MapUpload extends Component {
  
    state = {
 
      // Initially, no file is selected
      selectedFile: null
    };
    
    // On file select (from the pop up)
    onFileChange = event => {
    
      // Update the state
      this.setState({ selectedFile: event.target.files[0] });
    
    };
    
    // On file upload (click the upload button)
    onFileUpload = () => {
    
      // Create an object of formData
      const formData = new FormData();
    
      // Update the formData object
      formData.append(
        "log",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
    
      // Details of the uploaded file
      console.log(this.state.selectedFile);
    
      // Request made to the backend api
      // Send formData object
      // axios.post("api/uploadfile", formData);

      axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/upload`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })    
      .then((res) => {             
        this.setState({selectedFile: null});
      })
      .catch((err) => {
        console.log(err);
      });
    };
    
    // File content to be displayed after
    // file upload is complete
    fileData = () => {
    
      if (this.state.selectedFile) {
         
        return (
          <div>
            <h2>File Details:</h2>
             
<p>File Name: {this.state.selectedFile.name}</p>
 
             
<p>File Type: {this.state.selectedFile.type}</p>
 
             
<p>
              Last Modified:{" "}
              {this.state.selectedFile.lastModifiedDate.toDateString()}
            </p>
 
          </div>
        );
      } else {
        return (
          <div>
          </div>
        );
      }
    };
    
    render() {
     
      return (
        <Block title="Upload Logfile">
          <div className="input-bar">
        <div className="input-bar-item width100">
             <div className="input-group">
                <input type="file" className="form-control width100" onChange={this.onFileChange} />
                <span className="input-group-btn">
                  <button className="btn btn-info" onClick={this.onFileUpload}>Upload</button>
                </span>
            </div>
        </div>
      </div>

          {this.fileData()}
        </Block>
      );
    }
  }
 
  export default MapUpload;
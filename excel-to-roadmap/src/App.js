import React, { Component } from 'react';
import './App.scss';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dataLoaded: false,
      isFormInvalid: false,
      rows: null,
      cols: null
    }
    this.fileHandler = this.fileHandler.bind(this);
    this.toggle = this.toggle.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.fileInput = React.createRef();
  }

  renderFile = (fileObj) => {
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(Object.entries(resp.rows))
        console.table(resp.rows)
        this.setState({
          dataLoaded: true,
          cols: resp.cols,
          rows: resp.rows
        });
      }
    });
  }

  fileHandler = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;


      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
        this.setState({
          uploadedFileName: fileName,
          isFormInvalid: false
        });
        this.renderFile(fileObj)
      }
      else {
        this.setState({
          isFormInvalid: true,
          uploadedFileName: ""
        })
      }
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }


  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  getUniqueItems(object) {
    return object.map((item) => { return item[0] }).slice(1).filter(this.onlyUnique);
  }

  statusTagPicker(str) {
    if (str == '21-Q1')
      return 'Shipped';
    else if (str == '21-Q2')
      return 'ComingSoon';
    else if (str == '21-Q3')
      return 'InTheWorks';
    else
      return '';
  }

  render() {
    return (
      <div className='container'>
        <div className='header'>
          <div className='logo'></div>
          <h1>ConnectWise Roadmap</h1>
          <p>Please upload an excel file here to view roadmap.</p>
          <label for="file-upload" class="custom-file-upload">Upload Excel</label>
          <input id="file-upload" type="file" onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event) => { event.target.value = null }} />
        </div>
        {this.state.dataLoaded &&
          <div className='contentPanel'>
            {
              this.getUniqueItems(this.state.rows).map(catagory => {
                return <div className='catagory'>
                  <h2>{catagory}</h2>
                  <div>
                    {this.state.rows.filter((item) => { return item[0] === catagory }).map((it) => {
                      return <div className='item'>
                        <span className={'is' + this.statusTagPicker(it[2])}>{it[2]}</span>
                        <span className='shipped'>SHIPPED</span>
                        <span className='comingSoon'>COMING SOON</span>
                        <span className='inTheWorks'>IN THE WORKS</span>
                        <h4>{it[1]}</h4>
                        <p>{it[3]}</p>
                      </div>
                    })}

                  </div>
                </div>
              })
            }
          </div>}
        {!this.state.dataLoaded &&
          <div className='emptyState'>
          </div>}
        <div className='footer'>
          <p>
            Copyright © 2021 ConnectWise
            </p>
          <span>
            Build by Meng Huang
            </span>
        </div>
      </div>
    );
  }
}

export default App;
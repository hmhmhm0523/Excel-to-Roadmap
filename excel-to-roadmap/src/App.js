import React, { Component } from 'react';
import './App.scss';
import { ExcelRenderer } from 'react-excel-renderer';

const STATUS_MAP = {
  shipped: '21-Q1',
  comingSoon: '21-Q2',
  inTheWorks: '21-Q3',
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dataLoaded: false,
      isFormInvalid: false,
      rows: null,
      cols: null,
      filter: ''
    }
    this.fileHandler = this.fileHandler.bind(this);
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

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  getUniqueItems(object) {
    return object.map((item) => { return item[0] }).slice(1).filter(this.onlyUnique);
  }

  statusTagPicker(str) {
    if (str == STATUS_MAP.shipped)
      return 'Shipped';
    else if (str == STATUS_MAP.comingSoon)
      return 'ComingSoon';
    else if (str == STATUS_MAP.inTheWorks)
      return 'InTheWorks';
    else
      return '';
  }

  handleFilterChagne(filterText) {
    this.setState({
      filter: filterText
    });
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
            <div className='statusFilter'>
              <h4>Stauts:</h4>
              <button onClick={() => this.handleFilterChagne('')} className={this.state.filter == '' ? 'selected' : ''}>All</button>
              <button onClick={() => this.handleFilterChagne(STATUS_MAP.shipped)} className={this.state.filter == STATUS_MAP.shipped ? 'selected' : ''}>Shipped</button>
              <button onClick={() => this.handleFilterChagne(STATUS_MAP.comingSoon)} className={this.state.filter == STATUS_MAP.comingSoon ? 'selected' : ''}>Coming soon</button>
              <button onClick={() => this.handleFilterChagne(STATUS_MAP.inTheWorks)} className={this.state.filter == STATUS_MAP.inTheWorks ? 'selected' : ''}>In the works</button>
            </div>
            {
              this.getUniqueItems(this.state.rows).map(catagory => {
                return <div className='catagory'>
                  <h2>{catagory}</h2>
                  {this.state.rows.filter((item) => { return item[0] === catagory }).filter((item) => { return this.state.filter ? item[2] === this.state.filter : true }).map((it) => {
                    return <div className='item'>
                      <span className={'is' + this.statusTagPicker(it[2])}>{it[2]}</span>
                      <span className='shipped'>SHIPPED</span>
                      <span className='comingSoon'>COMING SOON</span>
                      <span className='inTheWorks'>IN THE WORKS</span>
                      <h4>{it[1]}</h4>
                      <p>{it[3]}</p>
                    </div>
                  })}
                  <p className='emptyStateText'>No item in this catagory</p>
                </div>
              })
            }
          </div>}
        {!this.state.dataLoaded &&
          <div className='emptyState'>
          </div>}
        <div className='footer'>
          <p>Copyright © 2021 ConnectWise</p>
          <span>Build by Meng Huang</span>
        </div>
      </div>
    );
  }
}

export default App;
import React, { Component } from 'react';
import './App.scss';
import { ExcelRenderer } from 'react-excel-renderer';
import { data } from './data';

const STATUS_MAP = {
  shipped: '21-Q1',
  comingSoon: '21-Q2',
  inTheWorks: '21-Q3',
  future: '21-Q4'
};

const CATAGORY_MAP = {
  unifiedManagement: 'Unified Management',
  securityManagement: 'Security Management',
  businessManagement: 'Business Management',
  expertServices: 'Expert Services',
  platformServices: 'Platform Services'
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dataLoaded: true,
      isFormInvalid: false,
      rows: data,
      cols: null,
      statusFilter: '',
      catagoryFilter: ''
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
        // console.log(JSON.stringify(this.state.rows));
        // console.log(JSON.stringify(resp.rows));
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
    if (str === STATUS_MAP.shipped)
      return 'Shipped';
    else if (str === STATUS_MAP.comingSoon)
      return 'ComingSoon';
    else if (str === STATUS_MAP.inTheWorks)
      return 'InTheWorks';
    else if (str === STATUS_MAP.future)
      return 'Future';
    else
      return '';
  }

  handleStatusFilterChagne(statusFilterText) {
    this.setState({
      statusFilter: statusFilterText
    });
  }

  handleCatagoryFilterChagne(catagoryFilterText) {
    this.setState({
      catagoryFilter: catagoryFilterText
    });
  }

  render() {
    return (
      <div className='container'>
        <div className='header'>
          <div className='logo'></div>
          <h1>ConnectWise Roadmap</h1>
          <p>Upload an excel file here to view a differnt roadmap.</p>
          <label htmlFor="file-upload" className="custom-file-upload">Upload Excel</label>
          <input id="file-upload" type="file" onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event) => { event.target.value = null }} />
        </div>
        {this.state.dataLoaded &&
          <div className='contentPanel'>
            <div className='wraper'>
              <div className='sidePanel'>
                <div className='filter'>
                  <h4>Stauts:</h4>
                  <div>
                    <button key={'All'} onClick={() => this.handleStatusFilterChagne('')} className={this.state.statusFilter === '' ? 'selected' : ''}>All Status</button>
                    <button key={'Shipped'} onClick={() => this.handleStatusFilterChagne(STATUS_MAP.shipped)} className={this.state.statusFilter === STATUS_MAP.shipped ? 'selected' : ''}>Shipped</button>
                    <button key={'ComingSoon'} onClick={() => this.handleStatusFilterChagne(STATUS_MAP.comingSoon)} className={this.state.statusFilter === STATUS_MAP.comingSoon ? 'selected' : ''}>Coming soon</button>
                    <button key={'InTheWorks'} onClick={() => this.handleStatusFilterChagne(STATUS_MAP.inTheWorks)} className={this.state.statusFilter === STATUS_MAP.inTheWorks ? 'selected' : ''}>In the works</button>
                    <button key={'Future'} onClick={() => this.handleStatusFilterChagne(STATUS_MAP.future)} className={this.state.statusFilter === STATUS_MAP.future ? 'selected' : ''}>Future</button>
                  </div>
                </div>
                <div className='filter'>
                  <h4>Catagory:</h4>
                  <div>
                    <button onClick={() => this.handleCatagoryFilterChagne('')} className={this.state.catagoryFilter === '' ? 'selected' : ''}>All Catagory</button>
                    {Object.keys(CATAGORY_MAP).map((catagory) => {
                      return <button key={catagory ? catagory.toString() : 'unknown'} onClick={() => this.handleCatagoryFilterChagne(CATAGORY_MAP[catagory])} className={this.state.catagoryFilter === CATAGORY_MAP[catagory] ? 'selected' : ''}>{CATAGORY_MAP[catagory]}</button>
                    })}
                  </div>
                </div>
              </div>
              <div className='mainPanel'>
                {
                  this.getUniqueItems(this.state.rows)
                    .filter((catagory) => { return this.state.catagoryFilter ? catagory === this.state.catagoryFilter : true })
                    .map(catagory => {
                      return <div key={catagory ? catagory.toString() : 'unknown'} className='catagory'>
                        <h2>{catagory}</h2>
                        {this.state.rows
                          .filter((item) => { return this.state.catagoryFilter ? item[0] === this.state.catagoryFilter : item[0] === catagory })
                          .filter((item) => { return this.state.statusFilter ? item[2] === this.state.statusFilter : true })
                          .map((it) => {
                            return <div kep={it.toString()} className='item'>
                              <span className={'is' + this.statusTagPicker(it[2])}>{it[2]}</span>
                              <span className='shipped'>SHIPPED</span>
                              <span className='comingSoon'>COMING SOON</span>
                              <span className='inTheWorks'>IN THE WORKS</span>
                              <span className='future'>FUTURE</span>
                              <h4>{it[1]}</h4>
                              <p>{it[3]}</p>
                            </div>
                          })}
                        <p className='emptyStateText'>No item in this catagory</p>
                      </div>
                    })
                }
              </div>
            </div>
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
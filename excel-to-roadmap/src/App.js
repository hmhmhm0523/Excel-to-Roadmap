import React, { Component } from 'react';
import './App.css';
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

render() {
  return (
    <div>
        <input type="file" onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event) => { event.target.value = null }} />
        {this.state.dataLoaded &&
          <div>

            <div><ul>
              {
               
                this.state.rows.map((item, key) => {
                  return <li key={key}>
                    <h3>{item[0]}</h3>
                    <h4>{item[1]}</h4>
                    <span>{item[2]}</span>
                    <p>{item[3]}</p>
                  </li>
                })
              }
            </ul></div>
            <OutTable data={this.state.rows} columns={this.state.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
          </div>}
    </div>
  );
}
}

export default App;
import React from 'react';
import {connect} from 'react-redux';
import {
  changeHeader,
  parseData,
  finish,
  fetchHeaders,
  setVisitors,
  setHosts,
  clearData
} from '../actions';
import FileUpload from '../components/file-upload';
import HeaderMatcher from '../components/header-matcher';
import _ from 'lodash';
var Loading = require('../../Loading.js');
var moment = require('moment');

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      date: moment()
    };
  }
  componentDidMount() {
    this.props.dispatch(clearData());
    this.props.dispatch(fetchHeaders());
  }
  render(){
    const { dispatch, headers, data, finished} = this.props;
    console.log('FINISHED PARSED DATA IS:', finished.data);
    if(data) {
    var options = data.map(e =>
        e.key
        );
    options = _.uniq(options);
    }
    if(
        this.props.headers.isFetching) {
      return <Loading />;
    }
      if(this.props.data.length === 0) {
        return (
          <div className="col-xs-12 text-center">
            <h3>Uploading for {moment().format('MM/DD')}</h3>
            <FileUpload
              uploadFile={fileData =>
                dispatch(parseData(fileData))
              }
              setHosts={() => {
                  dispatch(setHosts());
              }}
              setVisitors={() => {
                dispatch(setVisitors());
              }}
              hostsOrVisitors={this.props.hostsOrVisitors}
              style={{margin: '10px', display: 'inline-block'}}
            />
          </div>
        );
      } else {
        return (
          <div>
            <HeaderMatcher
              headers={headers.data}
              changeHeader={function(needed, given) {
                dispatch(changeHeader(needed, given));
              }}
              options={options}
              visitors={data}
              onFinish={function() {
                  dispatch(finish());
                }}
            />
          </div>
        );
      }
    }
}
export default connect(state => state)(App)

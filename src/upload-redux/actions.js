import fetch from 'isomorphic-fetch';
import mpath from 'mpath';

export function parseData(rawCSV){
  return {type: 'PARSE_DATA', rawCSV };
}

export function changeHeader(needed, given){
  return { type: 'CHANGE_HEADER', needed, given}
}

export function removeDataPoint(key){
  return { type: 'REMOVE_DATA_KEY', key}
}

export function removeDataPoints(keys){
  return { type: 'REMOVE_DATA_KEYS', keys}
}

export function changeKey(oldKey, newKey){
  return { type: 'CHANGE_KEY', oldKey, newKey}
}

export function changeKeys(keyArray) {
  return { type: 'CHANGE_KEYS', keyArray}
}


export function setHeaders(given) {
  return { type: 'SET_HEADERS', given }
}
export function initialParse(rawCSV){
  return dispatch => dispatch(parseData(rawCSV))
}
export function setHeadersGivenToNeeded(){
  return { type: 'SET_HEADERSGIVEN_TO_NEEDED' }
}

export function finish(){
  return function(dispatch, getState) {
    const data = getState().data;
    const headers = getState().headers;
    const givenArray = mpath.get('given', headers.data);
    const dropKeys = [];
    const changeKeysArray = [];
    data.forEach(function(dataPoint) {
      const index = givenArray.indexOf(dataPoint.key);
      if(index > -1 ) {
        changeKeysArray.push({
          oldKey: headers.data[index].given,
          newKey: headers.data[index].needed
        });
      } else {
        dropKeys.push(dataPoint.key);
      }
    });
    dispatch(removeDataPoints(dropKeys));
    dispatch(changeKeys(changeKeysArray));
    dispatch(finishChangingKeys(getState().data));
    // dispatch(setHeadersGivenToNeeded());
  }
}
export function finishChangingKeys(data) {
  return { type: 'FINISH_HEADER_MATCH', data };
}

export function getHeadersError(error) {
  return { type: 'GET_HEADERS_ERROR', error };
}

export function getHeaders() {
  return { type: 'GET_HEADERS_BEGIN' };
}
export function receiveHeaders(data) {
  data = Object.keys(data).map(function(e) {
      return { needed: e, given: data[e] };
  });
  return { type: 'GET_HEADERS_SUCCESS', data };
}

export function fetchHeaders() {
  return function(dispatch) {
    dispatch(getHeaders());
    return fetch('/headerOrder', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(resp =>
      resp.json()
    ).then( data =>
      dispatch(receiveHeaders(data))
    ).catch(err =>
      dispatch(getHeadersError(err))
    );
  };
}
export function updateHeadersError(err) {
  return { type: 'UPDATE_HEADER_ERROR', err};
}
export function updateHeaderOrder(){
  return function(dispatch, getState) {
    console.log('FINISHED', getState());
    // var body = getState().headers.data.reduce(function(prev, curr) {
    //     prev[curr.needed] = curr.given;
    //     return prev;
    // }, {});
    // return fetch('updateHeaderOrder', {
    //   method: 'POST',
    //   credentials: 'same-origin',
    //   body: JSON.stringify(body),
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   }
    // }).then(resp => {
    //   return dispatch(finish());
    // }).then( e => {
    //   dispatch(getSchools());
    //   dispatch(getEmployers());
    // });
  };
}

function successUpload() {
  return { type: 'SUCCESS_DATA_UPLOAD' };
}
function errorUpload(err){
  return { type: 'ERROR_UPLOAD', err };
}
export function setDate(date){
  return { type: 'SET_DATE', date};
}
export function startUpload(){
  return { type: 'START_UPLOAD'};
}

export function uploadData(url, cb){
  return function(dispatch, getState){
    var url = getState().hostsOrVisitors ? '/hosts' : '/visitors';
    dispatch(startUpload());
    var body = getState().finished.data;
    body = body.filter(function(person){
      return Object.keys(person).filter(key =>
          key !== 'visitDate'
        ).some(function(key){
        return person[key] !== ' ';
      });
    });
    console.log(getState().twoSlots);
    if(url === '/visitors'){
      body = {
        visitors: body,
        twoSlot: getState().twoSlots
      }
    }
      
    //TODO take this out when the date box works
    return fetch(process.env.URL + url, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(resp => {
      if(resp.status > 400){
        dispatch(errorUpload(resp.status))
      } else {
         dispatch(successUpload());
         cb();
      }
    });
  };
}

export function clearData() {
  return { type: 'CLEAR_PREV_DATA' };
}

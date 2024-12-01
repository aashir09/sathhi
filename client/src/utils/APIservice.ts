// import data from '../../public/variable.json';
// let data = (localStorage.getItem('REACT_APP_BASEURL'));
// console.log(data);

const config = {
  apiUrl: 'https://sathhi-backend.onrender.com',
  // apiUrl: "http://192.168.29.114:8083",
  // apiUrl: data.REACT_APP_BASEURL,
  // apiUrl: "http://192.168.29.114:8083",
  // apiUrl: process.env.REACT_APP_BASEURL,
  // api: 'http://localhost:1337',
  // apiUrl: 'https://matrimonyapi.native.software',
  // apiUrl: process.env.REACT_APP_BASEURL,
  //api: 'http://192.168.29.204:9096/api',
  options: {
    headers: { 'content-type': 'application/json', Authorization: '', refreshtoken: '', Accept: 'application/json' }
  }
};

const httpGet = async (endpoint: string, sessionToken?: string) => {
  // const response = await fetch('/admin/variable.json'); 
  
  // // Adjust the file path as needed
  // const apiUrl = await response.json();

  if (sessionToken)
    config.options.headers.Authorization = 'bearer ' + sessionToken;
  return fetch(`${endpoint}`, {
    ...config.options
  })
    .then((response) => handleResponse(response))
    .then((response) => response)
    .catch((error) => {

      console.error(error);
      throw Error(error);
    });
};

const httpPost = async (endpoint: string, data: any, sessionToken?: string, refreshToken?: string) => {

  const response = await fetch('/admin/variable.json'); 
// Adjust the file path as needed
  // const apiUrl = await response.json();
  // console.log(apiUrl);
  if (sessionToken)
    config.options.headers.Authorization = 'bearer ' + sessionToken;
  config.options.headers.refreshtoken = refreshToken;
  // console.log(config.apiUrl);

  return fetch(`${endpoint}`, {
    method: 'post',
    body: data ? JSON.stringify(data) : null,
    ...config.options
  })  
    .then((response) => handleResponse(response))
    .then((response) => response)
    .catch((error) => {
      console.error(error);
      throw Error(error);
    });
};

const httpPut = (endpoint: string, data: any, sessionToken?: string) => {
  if (sessionToken)
    config.options.headers.Authorization = 'bearer ' + sessionToken;
  return fetch(`${config.apiUrl}${endpoint}`, {
    method: 'put',
    body: data ? JSON.stringify(data) : null,
    ...config.options
  })
    .then((response) => handleResponse(response))
    .then((response) => response)
    .catch((error) => {
      console.error(error);
      throw Error(error);
    });
};

const httpDelete = (endpoint: string, sessionToken?: string) => {
  if (sessionToken)
    config.options.headers.Authorization = 'bearer ' + sessionToken;
  return fetch(`${config.apiUrl}${endpoint}`, {
    method: 'delete',
    ...config.options
  })
    .then((response) => handleResponse(response))
    .then((response) => response)
    .catch((error) => {
      console.error(error);
      throw Error(error);
    });
};

const handleResponse = (response: any) => {
  // You can handle 400 errors as well.
  console.log(response);

  if (response.status === 200) {
    return response.json();
  } else {
    return response.json();
    //   throw Error(response.json() | 'error');
    //throw Error('error');
  }
};

export default { httpGet, httpPost, httpPut, httpDelete, config };

const checkResponseStatus = response => {
  if (response.status === 200) {
    return Promise.resolve(response);
  } else if (response.status === 400 || response.status === 401) {
    return Promise.resolve(response);
  } else if (response.staus === 500) {
    return Promise.resolve(response);
  }
};

module.exports = checkResponseStatus;

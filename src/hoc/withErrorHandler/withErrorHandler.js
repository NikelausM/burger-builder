import React, { useEffect, useState } from 'react'

import Modal from 'components/UI/Modal/Modal'
import Aux from 'hoc/Auxiliary/Auxiliary'

const SerializeError = require('serialize-error')

const withErrorHandler = (WrappedComponent, axios) => {
  const WithErrorHandler = props => {
    const [error, setError] = useState(null);
    const requestInterceptor = axios.interceptors.request.use(
      req => {
        setError(null);
        return req;
      }
    );
    const responseInterceptor = axios.interceptors.response.use(
      res => res,
      error => {
        setError(error);
        return Promise.reject(error);
      }
    );
    useEffect(
      () => {
        return () => {
          axios.interceptors.request.eject(requestInterceptor);
          axios.interceptors.response.eject(responseInterceptor);
        };
      },
      [requestInterceptor, responseInterceptor]
    );

    let errorMessage = null
    if (error) {
      let errorSerialized = SerializeError.serializeError(error)
      // console.log("errorSerialized: ", errorSerialized)
      if (errorSerialized.response.data.error) {
        errorMessage = errorSerialized.response.data.error.message ?
          errorSerialized.response.data.error.message :
          errorSerialized.response.data.error;
      }
    }

    // create and return error modal
    return (
      <Aux>
        <Modal
          show={error !== null}
          modalClosed={() => setError(null)}
        >
          {/* {error !== null ? error.message : null} */}
          {`Error: ${errorMessage ? errorMessage : "Undefined error."}`}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    )
  };
  return WithErrorHandler;
};
export default withErrorHandler;
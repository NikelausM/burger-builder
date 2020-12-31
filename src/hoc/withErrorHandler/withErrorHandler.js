import React from 'react'

import Modal from 'components/UI/Modal/Modal'
import Aux from 'hoc/Auxiliary/Auxiliary'
import useHttpErrorHandler from 'hooks/http-error-handler'

const SerializeError = require('serialize-error')

const withErrorHandler = (WrappedComponent, axios) => {
  return props => {

    const [error, errorConfirmedHandler] = useHttpErrorHandler(axios)

    let errorMessage = null
    if (error) {
      let errorSerialized = SerializeError.serializeError(error)
      if (errorSerialized.response.data.error) {
        errorMessage = errorSerialized.response.data.error.message
          ? errorSerialized.response.data.error.message
          : errorSerialized.response.data.error;
      }
    }

    // const MODAL_ERROR_MESSAGE =  error !== null ? error.message : null
    const MODAL_ERROR_MESSAGE = `Error: ${errorMessage ? errorMessage : "Undefined error."}`

    // create and return error modal
    return (
      <Aux>
        <Modal
          show={error}
          modalClosed={errorConfirmedHandler}
        >
          {MODAL_ERROR_MESSAGE}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    )
  };
};
export default withErrorHandler;
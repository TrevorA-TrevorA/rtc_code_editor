import { CLEAR_ERROR } from "../reducers/root_reducer";

const clearErrorMessage = () => dispatch => {
  $('.error-message').animate({ opacity:0 }, 500);
    setTimeout(() => dispatch({ type:CLEAR_ERROR }), 500)
}

export default clearErrorMessage;
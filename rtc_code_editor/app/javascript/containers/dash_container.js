import { connect } from 'react-redux';
import Dash from '../components/dash';
import uploadDocuments from '../actions/upload_documents';
import clearErrorMessage from '../actions/clear_error_message';

const mapStateToProps = (state) => {
  const { user, selected, errorMessage } = state;
  return { user, selected, errorMessage };
}

const matchDispatchToProps = dispatch => ({ 
  uploadDocuments: (docs) => dispatch(uploadDocuments(docs)),
  clearErrorMessage: () => dispatch(clearErrorMessage())
})
const DashContainer = connect(mapStateToProps, matchDispatchToProps)(Dash);

export default DashContainer;

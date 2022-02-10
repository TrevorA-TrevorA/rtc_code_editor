import { connect } from 'react-redux';
import Dash from '../components/dash';
import uploadDocuments from '../actions/upload_documents';

const mapStateToProps = (state) => ({
  user: state.user,
  selected: state.selected
});

const matchUpload = dispatch => ({ uploadDocuments: (docs) => dispatch(uploadDocuments(docs)) })
const DashContainer = connect(mapStateToProps, matchUpload)(Dash);

export default DashContainer;

import { connect } from 'react-redux';
import uploadDocuments from '../actions/upload_documents';

import {
  UploadButton,
  DeleteButton,
} from '../components/dash_buttons';

const mapStateToProps = (state) => ({
  user: state.user,
  documents: state.documents,
});

const matchUpload = dispatch => ({ uploadDocuments: (docs) => dispatch(uploadDocuments(docs)) })

export const UploadButtonContainer = connect(mapStateToProps, matchUpload)(UploadButton);
export const DeleteButtonContainer = connect(mapStateToProps)(DeleteButton);

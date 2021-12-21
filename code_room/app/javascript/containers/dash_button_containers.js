import { connect } from 'react-redux';
import uploadDocuments from '../actions/upload_documents';
import removeDocuments from '../actions/delete_documents';

import {
  UploadButton,
  DeleteButton,
  DownloadButton
} from '../components/dash_buttons';

const mapStateToProps = (state) => ({
  user: state.user,
  documents: state.documents,
  selected: state.selected
});

const matchUpload = dispatch => ({ uploadDocuments: (docs) => dispatch(uploadDocuments(docs)) })
const matchRemove = dispatch => ({ removeDocuments: () => dispatch(removeDocuments())})

export const UploadButtonContainer = connect(mapStateToProps, matchUpload)(UploadButton);
export const DeleteButtonContainer = connect(mapStateToProps, matchRemove)(DeleteButton);
export const DownloadButtonContainer = connect(mapStateToProps)(DownloadButton);
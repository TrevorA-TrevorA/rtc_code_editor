import { connect } from 'react-redux';
import uploadDocuments from '../actions/upload_documents';
import deleteDocuments from '../actions/delete_documents';

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
const matchDelete = dispatch => ({ deleteDocuments: () => dispatch(deleteDocuments()) })

export const UploadButtonContainer = connect(mapStateToProps, matchUpload)(UploadButton);
export const DeleteButtonContainer = connect(mapStateToProps, matchDelete)(DeleteButton);
export const DownloadButtonContainer = connect(mapStateToProps)(DownloadButton);
import { connect } from 'react-redux';
import {
  UploadButton,
  DeleteButton,
} from '../components/dash_buttons';

const mapStateToProps = (state) => ({
  user: state.user,
  documents: state.docs,
});

export const UploadButtonContainer = connect(mapStateToProps)(UploadButton);
export const DeleteButtonContainer = connect(mapStateToProps)(DeleteButton);

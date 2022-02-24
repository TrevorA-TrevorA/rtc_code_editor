import { connect } from 'react-redux';
import Room from '../components/room';

const mapStateToProps = (state) => ({
  user: state.user,
  documents: state.documents,
  editables: state.editables,
  avatarUrl: state.avatarUrl,
  errorMessage: state.errorMessage
});

const RoomContainer = connect(mapStateToProps)(Room);

export default RoomContainer;

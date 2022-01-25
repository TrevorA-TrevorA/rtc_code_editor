import { connect } from 'react-redux';
import CollabManager from '../components/collab_manager';

const mapStateToProps = (state) => ({
  user: state.user,
  selected: state.selected,
  editables: state.editables,
  documents: state.documents
});

const CollabManagerContainer = connect(mapStateToProps)(CollabManager);

export default CollabManagerContainer;

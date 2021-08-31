import { connect } from 'react-redux';
import DocList from '../components/doc_list';

const mapStateToProps = (state) => ({
  user: state.user,
  documents: state.documents
});

const DocListContainer = connect(mapStateToProps)(DocList);

export default DocListContainer;

import { connect } from 'react-redux';
import DocRow from '../components/doc_row';

const mapStateToProps = (state) => ({
  user: state.user
});

const DocRowContainer = connect(mapStateToProps)(DocRow);

export default DocRowContainer;

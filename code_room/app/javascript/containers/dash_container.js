import { connect } from 'react-redux';
import Dash from '../components/dash';

const mapStateToProps = (state) => ({
  user: state.user,
  selected: state.selected
});

const DashContainer = connect(mapStateToProps)(Dash);

export default DashContainer;

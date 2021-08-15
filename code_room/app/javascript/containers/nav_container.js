import { connect } from 'react-redux';
import nav from '../components/nav';

const mapStateToProps = state => ({
  user: state.user
})

const NavContainer = connect(mapStateToProps)(nav);

export default NavContainer;
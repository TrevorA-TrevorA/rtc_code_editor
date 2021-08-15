import { connect } from 'react-redux';
import Nav from '../components/nav';

const mapStateToProps = state => ({
  user: state.user
})

const NavContainer = connect(mapStateToProps)(Nav);

export default NavContainer;
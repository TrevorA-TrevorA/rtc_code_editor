import { connect } from 'react-redux';
import Nav from '../components/nav';

const mapStateToProps = (state) => ({
  user: state.user,
  avatarUrl: state.avatarUrl
});

const NavContainer = connect(mapStateToProps)(Nav);

export default NavContainer;

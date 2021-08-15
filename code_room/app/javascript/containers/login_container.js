import { connect } from 'react-redux';
import Login from '../components/login';

const mapStateToProps = state => ({
  user: state.user
})

const LoginContainer = connect(mapStateToProps)(Login);

export default LoginContainer;
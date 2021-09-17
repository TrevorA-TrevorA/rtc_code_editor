import { connect } from 'react-redux';
import SignUp from '../components/sign_up';

const mapStateToProps = (state) => ({
  user: state.user
});

const SignUpContainer = connect(mapStateToProps)(SignUp);

export default SignUpContainer;

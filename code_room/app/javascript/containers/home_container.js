import { connect } from 'react-redux';
import Home from '../components/home';

const mapStateToProps = state => ({
  user: state.user
})

const HomeContainer = connect(mapStateToProps)(Home);

export default HomeContainer;
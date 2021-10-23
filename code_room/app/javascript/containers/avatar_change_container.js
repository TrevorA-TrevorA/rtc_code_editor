import { connect } from 'react-redux';
import AvatarChange from '../components/avatar_change';

const mapStateToProps = (state) => ({
  user: state.user,
  avatarUrl: state.avatarUrl
});

const AvatarChangeContainer = connect(mapStateToProps)(AvatarChange);

export default AvatarChangeContainer;
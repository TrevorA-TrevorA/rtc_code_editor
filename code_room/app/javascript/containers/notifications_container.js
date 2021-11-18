import { connect } from 'react-redux';
import Notifications from '../components/notifications';

const mapStateToProps = (state) => ({
  user: state.user
});

const NotificationsContainer = connect(mapStateToProps)(Notifications);

export default NotificationsContainer;

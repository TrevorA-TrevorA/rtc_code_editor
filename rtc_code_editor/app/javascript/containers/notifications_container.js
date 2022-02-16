import { connect } from 'react-redux';
import Notifications from '../components/notifications';

const mapStateToProps = (state) => ({
  user: state.user,
  notifications: state.notifications
});

const NotificationsContainer = connect(mapStateToProps)(Notifications);

export default NotificationsContainer;

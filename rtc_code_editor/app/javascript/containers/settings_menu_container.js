import { connect } from 'react-redux';
import SettingsMenu from '../components/settings_menu';

const mapStateToProps = (state) => ({
  user: state.user
});

const SettingsMenuContainer = connect(mapStateToProps)(SettingsMenu);

export default SettingsMenuContainer;

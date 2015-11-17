'use strict';

var React = require('react-native');
var store = require('react-native-simple-store');
var NavigationBar = require('react-native-navbar');

var {
  Navigator,
  StatusBarIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Platform,
  ToolbarAndroid,
  BackAndroid,
} = React;

// Flux
var StockActions = require('./App/Utils/Stock/actions');

// Views
var AddNewView = require('./App/Views/AddNew');
var SettingsView = require('./App/Views/Settings');
// 注意: require的使用，和python一样，要么导入一个class, 要么导入一个package(带有index.js文件)
var StocksView = require('./App/Views/Stocks');
var WebView = require('./App/Views/Web');

// Styles
var styles = require('./style');

Platform.OS === 'ios' ? StatusBarIOS.setStyle('default', false): null;

var _navigator;

var NavToolbar = React.createClass({

  componentWillMount: function() {
    var navigator = this.props.navigator;
  },

  render: function () {
    if (this.props.navIcon) {
      return (
        <ToolbarAndroid
          style={styles.toolbar}
          navIcon={{uri: 'ic_arrow_back_white_24dp', isStatic: true}}
          onIconClicked={this.props.navigator.pop}
          actions={this.props.actions}
          onActionSelected={this.props.onActionSelected}
          title={this.props.route.title}
          titleColor='white' />
      )
    }
    return (
      <ToolbarAndroid
        style={styles.toolbar}
        onIconClicked={this.props.navigator.pop}
        actions={this.props.actions}
        onActionSelected={this.props.onActionSelected}
        titleColor='white'
        title='Finance' />
    )
  }
})

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
     return false;
  }
  _navigator.pop();
  return true;
});

var Finance = React.createClass({
  getInitialState: function() {
    return {};
  },

  configureSceneAndroid: function(route) {
    return Navigator.SceneConfigs.FadeAndroid;
  },

  configureSceneIOS: function(route) {
    switch (route.id) {
      case 'settings':
        return Navigator.SceneConfigs.FloatFromBottom;
      case 'add':
        return Navigator.SceneConfigs.FloatFromBottom;
      case 'yahoo':
        return Navigator.SceneConfigs.HorizontalSwipeJump;
      default:
        return Navigator.SceneConfigs.FloatFromBottom;
    }
  },

  renderSceneAndroid: function(route, navigator) {
    _navigator = navigator;
    if (route.id === 'stocks') {
      return (
        <View style={styles.container}>
          <NavToolbar
            navigator={navigator}
            route={route}
            actions={[{title: 'Reload', icon: require('image!ic_reload_white'), show: 'always'}]}
            onActionSelected={() => StockActions.updateStocks()} />
          <StocksView navigator={navigator} route={route} />
        </View>
      );
    }
    if (route.id === 'settings') {
      return (
        <View style={styles.container}>
          <NavToolbar
            navIcon={true}
            navigator={navigator}
            route={route}
            actions={[{title: 'Add', icon: require('image!ic_plus_white'), show: 'always'}]}
            onActionSelected={() => _navigator.push({title: 'Add', id: 'add'})} />
          <SettingsView navigator={navigator} route={route} />
        </View>
      )
    }
    if (route.id === 'add') {
      return (
        <View style={styles.container}>
          <NavToolbar navigator={navigator} route={route} />
          <AddNewView navigator={navigator} route={route} />
        </View>
      )
    }
    // WebView is not working for Android App
    // if (route.id === 'yahoo') {
    //   return (
    //     <View style={styles.container}>
    //       <NavToolbar navIcon={true} navigator={navigator} route={route} />
    //       <WebView title={route.title} url={route.url} />
    //     </View>
    //   )
    // }
  },

  renderSceneIOS: function(route, navigator) {
    var Component = route.component;
    var navBar = route.navigationBar;

    switch (route.id) {
      case 'empty':
        //Com <View />;
      case 'stocks':
        // 默认展示StocksView, 但是没有导航Bar
        Component = StocksView;
        navBar = null;
        break;
      case 'settings':
        Component = SettingsView;

        // 如何直接定义: NavigationBar?
        // 标题，左右按钮等等
        navBar = <NavigationBar
          style={styles.navBar}
          leftButton={{
            title: '＋',
            handler: () => navigator.push({title: 'Add', id: 'add'}),
            tintColor: '#3CABDA',
          }}
          rightButton={{
            title: 'Done',
            handler: () => navigator.pop(),
            tintColor: '#3CABDA',
          }}
          title={{"title": "Stocks", "tintColor": "white"}} />;
        break;
      case 'add':
        Component = AddNewView;
        navBar = null
        break;
      case 'yahoo':
        Component = WebView;
        navBar = <NavigationBar
          style={styles.navBar}
          leftButton={{
            title: 'Back',
            handler: () => navigator.pop(),
            tintColor: '#3CABDA',
          }}
          title={{"title": "Yahoo", "tintColor": "white"}} />;
        break;
      }

    // 这个statusBar是如何处理的呢?
    // 难道: statusBar也是自己绘制的呢?
    //      NavigationBar的高度包含: statusBar + NavigationBar(?)的高度: 20 + 44
    if (navBar === null) {
      navBar = <View style={styles.statusBar} />;
    }

    return (
      <View style={styles.container}>
        {navBar}
        <Component
          navigator={navigator}
          route={route} />
      </View>
    );
  },

  render: function() {
    // 如何分别处理: ios/android
    var renderScene = Platform.OS === 'ios' ? this.renderSceneIOS: this.renderSceneAndroid;
    var configureScene = Platform.OS === 'ios' ? this.configureSceneIOS: this.configureSceneAndroid;

    // 纯JS版的Navigator
    // Navigator也不一定有NavigationBar
    //
    return (
      <Navigator
        debugOverlay={false}
        initialRoute={{title: 'Finance', id: 'stocks'}}
        configureScene={configureScene}
        renderScene={renderScene}
      />
    );
  },
});

// 导出App
module.exports = Finance;

'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  stocksBlock: {
    flexDirection: 'column',
    flex: 9,
  },
  middleBlock: {
    flex: 5,
    backgroundColor: '#202020',
    justifyContent: 'space-between',
  },
  footerBlock: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#202020',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  loadingText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
    marginRight: 10,
    color: 'white',
  },
  stocksListView: {
    flex: 1,
    backgroundColor: 'black',
  },
  yahoo: {
    flex: 1,
  },
  yahooText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    // 注意: textAlign样式
    textAlign: 'left',
  },
  footerMiddle: {
    flex: 1,
  },
  marketTimeText: {
    fontSize: 12,
    color: '#A6A6A6',
    textAlign: 'center',
  },
  settings: {
    flex: 1,
    // 内部的内容又对齐
    alignItems: 'flex-end',
  },
  icon: {
    width: 20,
    height: 20,
  },
});

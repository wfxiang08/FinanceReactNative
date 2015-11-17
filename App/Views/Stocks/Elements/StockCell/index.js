/* @flow */
'use strict';

var React = require('react-native');
var Reflux = require('reflux');
var store = require('react-native-simple-store');

var {
  Text,
  TouchableHighlight,
  View,
  } = React;

// Flux
var PropertyActions = require('../../../../Utils/Property/actions');
var PropertyStore = require('../../../../Utils/Property/store');
var StockStore = require('../../../../Utils/Stock/store');

// Styles
var styles = require('./style');

var StockCell = React.createClass({
  mixins: [Reflux.ListenerMixin],

  onChangeShowingProperty: function (data:string) {
    this.setState({
      showingProperty: data,
    });
  },

  onUpdateStocks: function (watchlist:Array<Object>, result:Array<Object>) {
    this.setState({
      watchlistResult: result,
    });
  },

  getInitialState: function () {
    return {
      showingProperty: 'Change',
    };
  },

  componentDidMount: function () {
    // 注意: DOM的Life Cycle
    this.listenTo(PropertyStore, this.onChangeShowingProperty);
    this.listenTo(StockStore, this.onUpdateStocks);

    store.get('showingProperty').then((result) => {
      if (!result) {
        result = 'Change';
        store.save('showingProperty', result);
      }
      this.setState({
        showingProperty: result,
      });
    });

    store.get('watchlistResult').then((result) => {
      this.setState({
        watchlistResult: result,
      });
    });
  },

  getShowingProperty: function () {
    store.get('showingProperty').then((result) => {
      return result;
    });
  },

  changeShowingProperty: function (currentShowingProperty:string) {
    // 1. 保存到store中
    var newShowingProperty;
    if (currentShowingProperty === 'Change') {
      newShowingProperty = 'ChangeinPercent';
    } else if (currentShowingProperty === 'ChangeinPercent') {
      newShowingProperty = 'MarketCapitalization';
    } else if (currentShowingProperty === 'MarketCapitalization') {
      newShowingProperty = 'Change';
    }
    store.save('showingProperty', newShowingProperty);

    // 2. Actions如何处理呢/
    PropertyActions.changeShowingProperty(newShowingProperty);
  },

  render: function () {
    return (
      <TouchableHighlight onPress={this.props.onSelect} underlayColor='#202020'>
        <View style={styles.container}>
          <View style={styles.stockContainer}>
            {/* 展示符号：flex 3 */}
            <View style={styles.symbol}>
              <Text style={styles.symbolText}>
                {this.props.stock.symbol}
              </Text>
            </View>
            {/* 展示价格：flex 2 */}
            <View style={styles.price}>
              <Text style={styles.priceText}>
                {this.state.watchlistResult && this.state.watchlistResult[this.props.stock.symbol] && this.state.watchlistResult[this.props.stock.symbol].LastTradePriceOnly}
              </Text>
            </View>

            {/* 信息展示 */}
            <TouchableHighlight
              style={(() => {
                  switch (this.state.watchlistResult && this.state.watchlistResult[this.props.stock.symbol] && this.state.watchlistResult[this.props.stock.symbol].Change && this.state.watchlistResult[this.props.stock.symbol].Change.startsWith('+')) {
                    case true:                   return styles.changeGreen;
                    case false:                  return styles.changeRed;
                    default:                     return styles.changeGreen;
                  }
                })()}
              underlayColor={(() => {
                  switch (this.state.watchlistResult && this.state.watchlistResult[this.props.stock.symbol] && this.state.watchlistResult[this.props.stock.symbol].Change && this.state.watchlistResult[this.props.stock.symbol].Change.startsWith('+')) {
                    case true:                   return '#53D769';
                    case false:                  return '#FC3D39';
                    default:                     return '#53D769';
                  }
                })()}
              onPress={() => this.changeShowingProperty(this.state.showingProperty)}>
              <View>
                <Text style={styles.changeText}>
                  {(() => {
                    switch (this.state.showingProperty) {
                      case 'Change':
                        return this.state.watchlistResult && this.state.watchlistResult[this.props.stock.symbol] && this.state.watchlistResult[this.props.stock.symbol].Change || '--';
                      case 'ChangeinPercent':
                        return this.state.watchlistResult && this.state.watchlistResult[this.props.stock.symbol] && this.state.watchlistResult[this.props.stock.symbol].ChangeinPercent || '--';
                      case 'MarketCapitalization':
                        return this.state.watchlistResult && this.state.watchlistResult[this.props.stock.symbol] && this.state.watchlistResult[this.props.stock.symbol].MarketCapitalization || '--';
                      default:
                        return this.state.watchlistResult && this.state.watchlistResult[this.props.stock.symbol] && this.state.watchlistResult[this.props.stock.symbol].Change || '--';
                    }
                  })()}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }
});

module.exports = StockCell;

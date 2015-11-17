/* @flow */
var Reflux = require('reflux');

// 参考: https://github.com/jasonmerino/react-native-simple-store
var store = require('react-native-simple-store');

// Flux
var Actions = require('./actions');

// Utils
var UtilFuncs = require('../functions');
var finance = require('../../Utils/finance');

var Store = Reflux.createStore({
  listenables: Actions,

  // 添加新的股票的列表
  onAddStock: function(symbol) {
    store.get('watchlist').then((result) => {
      // 1. 首先从 AsyncStorage 读取关注的 watchlist, 并且转换为大写
      var symbols = result.map((item) => {
        return item.symbol.toUpperCase();
      });

      // 2. 如果没有关注，则关注
      if (symbols.indexOf(symbol.toUpperCase()) === -1) {
        result.push({symbol: symbol.toUpperCase(), share: 100});

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        result.sort(UtilFuncs.dynamicSort('symbol'));


        console.log('onAddStock', result, symbol);

        // 然后重新保存 watchlist
        store.save('watchlist', result).then(() => {
          this.onUpdateStocks();
        });
      }
    });
  },

  onDeleteStock: function(symbol) {
    store.get('watchlist').then((result) => {
      console.log('onDeleteStock', result, symbol);
      return UtilFuncs.removeObjectfromArray(result, 'symbol', symbol);
    }).then((result) => {
      store.save('watchlist', result);
      return result;
    }).then((result) => {
      console.log('onDeleteStock trigger');
      // this.trigger(result);
      this.onUpdateStocks();
    });
  },

  onUpdateStocks: function() {
    console.log('onUpdateStocks');
    var that = this;
    store.get('watchlist').then((watchlist) => {
      // 1. 默认的watchlist
      if (!Array.isArray(watchlist) || watchlist.length === 0) {
        watchlist = [
          {symbol: 'AAPL', share: 100},
          {symbol: 'GOOG', share: 100},
        ];
        store.save('watchlist', watchlist);
      }

      var symbols = watchlist.map((item) => {
        return item.symbol;
      });

      // 读取stocks
      finance.getStock({stock: symbols}, 'quotes')
        .then(function(response) {
          return response.json();
        }).then(function(json) {
          var quotes = json.query.results.quote ;
          quotes = Array.isArray(quotes) ? quotes : [quotes];

          var watchlistResult = {};
          quotes.forEach((quote) => {
            watchlistResult[quote.symbol] = quote;
          });
          store.save('watchlistResult', watchlistResult);
          return watchlistResult;
        }).then((result) => {
          console.log('onUpdateStocks trigger');
          // 通知watchlist结果
          this.trigger(watchlist, result);
        }).catch((error) => {
          console.log('Request failed', error);
          // 如果失败，则利用本地缓存
          store.get('watchlistResult').then((result) => {
            this.trigger(watchlist, result);
          });

        });
    });
  },
});

module.exports = Store;

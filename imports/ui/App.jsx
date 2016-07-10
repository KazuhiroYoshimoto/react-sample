import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import Shop from './Shop.jsx';

var apiUrl = 'http://api.gnavi.co.jp/RestSearchAPI/20150630/';
var keyid = '';
var format = 'json';

// App component - represents the whole app
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isResult: false,
            shops : Array()
        };
        this.onSearch = this.onSearch.bind(this);
        this.onIndex = this.onIndex.bind(this);
    }

    /**
     * トップページ
     */
    onIndex(){
        this.setState({ isResult: false});
    }

    /**
     * 検索結果
     */
    onSearch(){
        this.setState({ isResult: true});
    }

    /**
     * お店一覧を作成
     */
    createShops(data){
        var shops = [];
        if(data.total_hit_count > 1){
            for(var i=0; i<data.rest.length; i++){
                shops[i] = data.rest[i];
                if(typeof shops[i].image_url.shop_image1 == 'string'){
                    shops[i].hasShopImage = true;
                }else{
                    shops[i].hasShopImage = false;
                }
            }
        }else if(data.total_hit_count == 1){
            shops[0] = data.rest;
            if(typeof shops[0].image_url.shop_image1 == 'string'){
                shops[0].hasShopImage = true;
            }else{
                shops[0].hasShopImage = false;
            }
        }
        return shops;
    }

  setShops(){
      navigator.geolocation.getCurrentPosition(
            function(position){
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var range = '1';
                this.setState({data: []});
                $.ajax ({
                    url: apiUrl,
                    dataType: 'jsonp',
                    data: {keyid:keyid,format:format,latitude:latitude,longitude:longitude,range:range},
                    success: function(data) {
                        var searchShops = this.createShops(data);
                        this.setState({shops: searchShops});
                    }.bind(this),
                    error: function(xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                });
            }.bind(this)
        );
  }

  renderShops() {
    this.setShops();
    return this.state.shops.map((shop) => (
      <Shop key={shop.id} shop={shop} />
    ));
  }

  render() {
    if(this.state.isResult){
        return (
            <div className="container">
                <header>
                <h1>検索結果</h1>
                </header>
                <button　onClick={this.onIndex}>戻る</button>
                <ul>
                {this.renderShops()}
                </ul>
            </div>
        );
    }else{
        return (
            <div className="container">
                <header>
                <h1>現在地から検索</h1>
                </header>
                <button　onClick={this.onSearch}>検索する</button>
            </div>
        );
    }
  }
}
import React, {Component} from 'react';
import ReactNative from 'react-native';
import * as firebase from 'firebase';
const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js');
import Prompt from 'react-native-prompt';

const { Alert, AppRegistry, ListView, View } = ReactNative;

const firebaseConfig = {
  apiKey: "AIzaSyB8rYlm5udRMfNuZYHvYDgWjtezwktrsLE",
  authDomain: "rn-todo-test.firebaseapp.com",
  databaseURL: "https://rn-todo-test.firebaseio.com",
  projectId: "rn-todo-test",
  storageBucket: "rn-todo-test.appspot.com",
  messagingSenderId: "80528088621"
}

const firebaseApp = firebase.initializeApp(firebaseConfig);

class GroceryApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      message: '',
      promptVisible: false
    };

    this.itemsRef = this.getRef().child('items');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        
        console.log('title: ' + child.val().title);
        console.log('key: ' + child.val().title);

        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      console.log(items);

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  _addItem(value) {
    console.log('test');
    this.itemsRef.push({ 'title': value });
    this.setState({ promptVisible: false });
  }

  render() {
    return (
      <View style={styles.container}>

        <StatusBar title="Grocery List" />

        <ListView 
          dataSource={this.state.dataSource} 
          renderRow={this._renderItem.bind(this)} 
          enableEmptySections={true}
          style={styles.listview} />

        <ActionButton title="Add" onPress={ () => this.setState({ promptVisible: true }) } />

        <Prompt
              title="Todo"
              defaultValue="Hello"
              visible={this.state.promptVisible}
              onCancel={() => this.setState({ promptVisible: false })}
              onSubmit={ (value) => this._addItem(value) } />
      </View>

    );
  }

  _renderItem(item) {

    const munculinAlert = () => {
      Alert.alert( 
        'Hapus Data', 'Hapus data ini?', 
        [
          {
            text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'
          }, 
          {
            text: 'OK', onPress: () => this.itemsRef.child(item._key).remove()
          }
        ] 
      )
    }

    return (
      <ListItem item={item} onPress={munculinAlert} />
    );
  }
}


AppRegistry.registerComponent('rn_project', () => GroceryApp);

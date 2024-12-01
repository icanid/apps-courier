import React from 'react';
import { StyleSheet, Text} from 'react-native';
import { Header as HeaderRNE, Dialog } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { router, Link } from "expo-router";
import * as SecureStore from 'expo-secure-store';

const Header = (props) => {

  const [title, setTitle] = useState((props.title) ? props.title : 'Ican Express'  );
  const [name, setName] = useState('Loading ...');
  const [token, setToken] = useState('');


  useEffect(() => {
    async function getValueFor(key) {
      await SecureStore.getItemAsync(key).then((result) => {
        if(!result){
          router.replace('/');
        }else{
          if(key == 'secured_name'){
            setName(result);
          }
          if(key == 'secured_token'){
            setToken(result);
          }
        }
      });
    }
    getValueFor('secured_name');
    getValueFor('secured_token');
  }, []);

return (
  <SafeAreaProvider>
    <HeaderRNE
      leftComponent={{ text : title, style: styles.subheaderText }}
      rightComponent={
        // { text: 'kurir_pickup_'+name, style: styles.heading }
        <Text style={styles.heading}>{name}</Text> 
      }
      centerComponent={{}}
      backgroundColor = '#ff0000'
      placement = 'left'
      containerStyle={{ flex:1, marginBottom:5 }}
    />
    
  </SafeAreaProvider>
);
};

const styles = StyleSheet.create({
heading: {
  color: 'white',
  fontSize: 15,
//   fontWeight: 'bold',
  paddingTop:5,
  // paddingBottom:5,
},
subheaderText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
  paddingTop:5,
  paddingBottom:5,
},
});

export default Header;
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, Image, ScrollView, useWindowDimensions } from 'react-native';
import { Link, router } from "expo-router";
import Header from './_components/Header';
import Footer from './_components/Footer';
import { useEffect, useState} from 'react';
import { HomeMenu } from './_components/RolesHome';
import * as SecureStore from 'expo-secure-store';
//icons 
// import mobil from '../assets/mobil.png';
// import mobilb from '../assets/mobil2.png';
// import motor from '../assets/motor.png';
// import box from '../assets/box.png';
// import boxgagal from '../assets/boxgagal.png';
// import dikirimkurir from '../assets/dikirimkurir.png';
// import scan from '../assets/scan.png';
// import sirine from '../assets/sirine.png';
// import pending from '../assets/pending.png';

export default function home() {

  const windowHeight = useWindowDimensions().height
  const [role, setRole] = useState();
  const [list, setList] = useState([]);

  useEffect(() => {
    async function getValueFor(key) {
      await SecureStore.getItemAsync(key).then((result) => {
        if(result){
          setRole(result);
            setList(HomeMenu(result));
        }
      });
    }
    getValueFor('secured_role');
  }, []);

  return (
    <SafeAreaView style={[styles.container, { minHeight: Math.round(windowHeight) }] }>
    
      <View style={styles.headerContainer}>
        <Header />
      </View>
      <View style={styles.searchContainer }>
        <TextInput
          style={styles.input}
          // onChangeText={onChangeNumber}
          // value={number}
          placeholder="Cari Paket"
        />
      </View>

      <ScrollView style={styles.contentBackground }>
        <View style={styles.contentList}>
      {  
        
        list.map((l, i) => (
          <Link href={l.ref} asChild key={i}>
            <TouchableOpacity style={styles.contentItem}>
              <Image source={l.src} style={styles.iconImage}/>
              <Text style={styles.contentText}>{l.text}</Text>
            </TouchableOpacity>
          </Link>
      ))
    }

        </View>
        
      </ScrollView>
    <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBE3D5',
    flexDirection:'column',
  },
  headerContainer : {
    height:'10%',
  },
  searchContainer : {
    backgroundColor:'#FAF8ED',
    borderRadius:10,
    marginHorizontal : 10,
    height:'10%',
    justifyContent:'space-around'
  },
  input: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor:'#FF8080',
    borderRadius:5
  },
  contentBackground : {
    height:'70%',
    padding:10, 
    margin:15,
    borderRadius:20,
    backgroundColor:'#FAF8ED', 
  },
  contentList  : {
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-start',
    flexWrap : 'wrap'
  },
  contentItem : {
    padding:10, 
    margin:5, 
    borderColor:'#FF8080', 
    borderWidth:1, 
    borderRadius:10,
    alignItems:'center',
    justifyContent:'space-evenly',
    width:'30%'
  },
  iconImage:{
    resizeMode : 'contain'
  },
  contentText : {
    fontSize:12,
    marginTop:5,
    width:90,
    textAlign:'center'
  },
});

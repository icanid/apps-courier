import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import { ListItem, Divider, Skeleton } from '@rneui/themed';
import { Link, router } from "expo-router";
import Header from './_components/Header';
import Footer from './_components/Footer';
import {SelectList} from 'react-native-dropdown-select-list';
import { useState, useEffect } from 'react';
import { HostUri } from './_components/HostUri';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export default function listPickup() {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [err, setErr] = useState('Disconnected Please Check your Connection !');

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingmore, setLoadingmore]= useState(false);
  
  const urut = [
    // {key:'1', value:'Seller', disabled:true},
    {key:'1', value:'Seller'},
    {key:'2', value:'Kelurahan'},
  ];
  
  useEffect(() => {
    getData();
  }, []);

  const getMore = () => {
    if(currentPage < lastPage){
      setLoadingmore(true);
      setCurrentPage(currentPage+1);
      getData()
    }
  }

  const getData = async () => {
    await SecureStore.getItemAsync('secured_token').then((token) => {
      axios({
        method: "get",
        url: HostUri+'delivery/seller?page='+currentPage,
        headers: {
          "Content-Type": 'application/json',
          "Authorization" : `Bearer ${token}`,
        },
      }).then(function (response) {
           // berhasil
           setLoading(false);
           setLoadingmore(false);
           // setData(response.data.data.data);
           // console.log(response.data.data.data)
           if(currentPage == 1){
             setData(response.data.data.data)
           }else{
             setData([...data, ...response.data.data.data]);
           }
           setLastPage(response.data.data.last_page);
           setTotal(response.data.data.total)
        }).catch(function (error) {
          // masuk ke server tapi return error (unautorized dll)
          if (error.response) {
           setLoadingmore(false);
           setLoading(false);
          //gagal login
          if(error.response.data.message == 'Unauthenticated.' || error.response.data.message == 'Unauthorized')
            {
              SecureStore.deleteItemAsync('secured_token');
              SecureStore.deleteItemAsync('secured_name');
              router.replace('/');
            }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
          } else if (error.request) {
           setLoadingmore(false);
           setLoading(false);
          // ga konek ke server
            alert('Check Koneksi anda !')
            console.error(error.request);
          } else {
           setLoadingmore(false);
           setLoading(false);
            // error yang ga di sangka2
            console.error("Error", error.message);
          }
      });
    });
  }


    return (
        <SafeAreaView style={styles.container}>

          <View style={styles.headerContainer}>
            <Header title='List Delivery'/>
          </View>

          <View style={styles.headerChild}>
            <Text style={styles.tanggal}>{ new Date().toLocaleDateString('id-ID', {weekday: 'long',  month: 'long', day:'2-digit', year :'numeric' }) }</Text>
            <View style={styles.dropdownContainer}>
              <SelectList 
                setSelected={(val) => setSelected(val)} 
                data={urut} 
                save="value"
                placeholder='Urutkan'
                dropdownStyles={{ zIndex:999, minHeight:100, backgroundColor : 'white' }}
                boxStyles={{ margin:10, borderColor:'red' }}
              />
            </View>
          </View>

          <View style={styles.totalContainer}><Text style={styles.totalText}>Total : {total} Seller</Text></View>
          
          <View style={styles.listContainer}>
          <FlatList               
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>  
          <ListItem bottomDivider Component={TouchableOpacity} >
          <ListItem.Content>
          <ListItem.Title>{item.name} {item.total > 1 && "("+item.total+")"}</ListItem.Title>
          <ListItem.Subtitle>{item.subdistrict_name}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content right>
            <ListItem.Subtitle ><Link href={"/detailDelivery/"+item.user_id} asChild><Text style={{ color:'blue' }}>Detail</Text></Link></ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        }
        initialNumToRender={15}   // how many item to display first
        onEndReachedThreshold={0.5} // so when you are at 5 pixel from the bottom react run onEndReached function
        ListHeaderComponent ={
          <Divider
              style={{margin: 5 }}
              color="red"
              width={2}
              orientation="horizontal"
            />
          }
          stickyHeaderIndices={[0]}
          onEndReached={() => {
            getMore();
          }}
          ListFooterComponent={
            <View>
            {
            loadingmore &&
            [{}].map((l, i) => (
              <Skeleton
              // LinearGradientComponent={LinearGradient}
              animation="pulse"
              width={'100%'}
              height={60}
              style={{ marginBottom:5 }}
              key={i}
            />
              ))} 
            {
              data.length == 0 && !loading &&
              <View style={{ backgroundColor:'white' }}>
                  <Text>No Data Found</Text>
              </View>
            }
            {
              loading &&
              <View style={{ flex:1, flexDirection:'column' }}>
                {
                  [{},{},{},{},{},{}].map((l, i) => (
                    <Skeleton
                    // LinearGradientComponent={LinearGradient}
                    animation="pulse"
                    width={'100%'}
                    height={60}
                    style={{ marginBottom:5 }}
                    key={i}
                  />
                    ))
                }
              </View>
              
            }
            </View>
          }
      />
          </View>
          <Footer  />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection:'column',
  },
  headerContainer : {
    // flex:2,
    height:'10%'
  },
  headerChild : {
    flex: 1,
    flexDirection : 'row'
  },
  tanggal : {
    flex : 2,
    color:'grey',
    margin: 10
  },
  dropdownContainer : {
    flex:1
  },
  totalContainer : {
    flex:1,
    margin:10
  },
  totalText : {
    fontSize:16, 
    fontWeight:'bold'
  },
  listContainer : {
    flex : 13,
  }
});
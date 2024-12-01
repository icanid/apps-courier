import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import { ListItem, Divider, Skeleton } from '@rneui/themed';
import Header from './_components/Header';
import Footer from './_components/Footer';
import CustomDatePick from './_components/CustomDatePick';
import { useState, useEffect } from 'react';
import { HostUri } from './_components/HostUri';
import AccordionDelivery from './_components/AccordionDelivery'
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import axios from 'axios';

export default function listDeliveryFail() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [err, setErr] = useState('Disconnected Please Check your Connection !');

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingmore, setLoadingmore]= useState(false);

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
            url: HostUri+'delivery/fail?page='+currentPage,
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
              setLoadingmore(false);
              setLoading(false);
              if (error.response) {
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
                // ga konek ke server
              setLoadingmore(false);
              setLoading(false);
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
      
    return(
      <SafeAreaView style={styles.container}>

        <View style={styles.headerContainer}>
          <Header title='Delivery Gagal'/>
        </View>

        <View style={styles.datepickContainer}>
          <View>
            <CustomDatePick />
          </View>
          <View>
            <CustomDatePick />
          </View>
        </View>
        
        <View style={styles.listContainer}>
        <FlatList               
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>  <AccordionDelivery data={ item } />}
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
  datepickContainer : { 
    height:'10%',
    flexDirection : 'row', 
    alignItems: "center", 
    justifyContent: "space-evenly" 
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
    // height:'74%'
    flex:12
  },
  tableHead :{
    fontSize:12,
    color : 'grey'
  }
});

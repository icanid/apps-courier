import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import { ListItem, Divider, Skeleton } from '@rneui/themed';
import Header from './_components/Header';
import Footer from './_components/Footer';
import CustomDatePick from './_components/CustomDatePick';
import { HostUri } from './_components/HostUri';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AccordionPickUp from './_components/AccordionPickUp';
import AccordionPickUpCorporate from './_components/AccordionPickUpCorporate';
import { router } from "expo-router";
import  axios  from 'axios';

export default function listPickUpSuccess() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [err, setErr] = useState('Disconnected Please Check your Connection !');

  const [loadingCorporate, setLoadingCorporate] = useState(true);
  const [dataCorporate, setDataCorporate] = useState([]);
  const [errCorporate, setErrCorporate] = useState('Disconnected Please Check your Connection !');

  const [loadingMoreSeller, setLoadingMoreSeller] = useState(false);
  const [currentPageSeller, setCurrentPageSeller] = useState(1);
  const [lastPageSeller, setLastPageSeller] = useState(1);
  const [totalSeller, setTotalSeller] = useState(0);

  const [loadingMoreCorp, setLoadingMoreCorp] = useState(false);
  const [currentPageCorp, setCurrentPageCorp] = useState(1);
  const [lastPageCorp, setLastPageCorp] = useState(1);
  const [totalCorp, setTotalCorp] = useState(0);


  useEffect(() => {
    getData();
    getCorporate();
  }, []);


  const getData = async () => {
    await SecureStore.getItemAsync('secured_token').then((token) => {
      axios({
        method: "get",
        url: HostUri+'pickup/success?page='+currentPageSeller,
        headers: {
          "Content-Type": 'application/json',
          "Authorization" : `Bearer ${token}`,
        },
      }).then(function (response) {
          // berhasil
          setLoading(false);
          setLoadingMoreSeller(false);
          // console.log(response.data.data.data)
          if(currentPageSeller == 1){
            setData(response.data.data.data)
          }else{
            setData([...data, ...response.data.data.data]);
          }
          setLastPageSeller(response.data.data.last_page);
          setTotalSeller(response.data.data.total)

        }).catch(function (error) {
          // masuk ke server tapi return error (unautorized dll)
          if (error.response) {
          setLoading(false);
          setLoadingMoreSeller(false);
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
          setLoadingMoreSeller(false);
          setLoading(false);
          // ga konek ke server
            alert('Check Koneksi anda !')
            console.error(error.request);
          } else {
          setLoading(false);
          setLoadingMoreSeller(false);
          // error yang ga di sangka2
            console.error("Error", error.message);
          }
      });
    });
  }

  const getCorporate = async () => {
    await SecureStore.getItemAsync('secured_token').then((token) => {
      axios({
        method: "get",
        url: HostUri+'pickup/corporate/success?page='+currentPageCorp,
        headers: {
          "Content-Type": 'application/json',
          "Authorization" : `Bearer ${token}`,
        },
      }).then(function (response) {
          // berhasil
          // berhasil
          setLoadingCorporate(false);
          setLoadingMoreCorp(false);
          // console.log(response.data.data.data)
          if(currentPageCorp == 1){
            setDataCorporate(response.data.data.data)
          }else{
            setDataCorporate([...dataCorporate, ...response.data.data.data]);
          }
          setLastPageCorp(response.data.data.last_page);
          setTotalCorp(response.data.data.total)

          // setLoadingCorporate(false);
          // setDataCorporate(response.data.data.data);
        }).catch(function (error) {
          // masuk ke server tapi return error (unautorized dll)
          if (error.response) {
          setLoadingMoreCorp(false);
          setLoadingCorporate(false);
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
          setLoadingMoreCorp(false);
          setLoadingCorporate(false);
          // ga konek ke server
            alert('Check Koneksi anda !')
            console.error(error.request);
          } else {
          setLoadingCorporate(false);
          // error yang ga di sangka2
          setLoadingMoreCorp(false);
            console.error("Error", error.message);
          }
      });
    });
  }

  
  const moreDataHandler = () => {
    if(currentPageSeller < lastPageSeller){
      setLoadingMoreSeller(true);
      setCurrentPageSeller(currentPageSeller+1);
      getData()
    }
  }

  const moreDataCorpHandler = () => {
    if(currentPageCorp < lastPageCorp){
      setLoadingMoreCorp(true);
      setCurrentPageCorp(currentPageCorp+1);
      // getData()
    }
  }
  
    return(
        <SafeAreaView style={styles.container}>

          <View style={styles.headerContainer}>
            <Header title='Pickup Sukses'/>
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
            <View style={{ flex:1 }}>
            { loading &&
              [{},{},{},{},{},{},].map((l, i) => (
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
              <FlatList               
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>  <AccordionPickUp data={ item } />}
                initialNumToRender={15}   // how many item to display first
                onEndReachedThreshold={0.5} // so when you are at 5 pixel from the bottom react run onEndReached function
                ListHeaderComponent ={
                  <View style={{ backgroundColor:'white' }}>
                    <Text style={{marginHorizontal: 5, fontWeight:'bold' }}>Seller ({totalSeller})</Text>
                    <Divider
                      style={{margin: 5 }}
                      color="red"
                      width={2}
                      orientation="horizontal"
                    />
                  </View>}
                  stickyHeaderIndices={[0]}
                onEndReached={() => {
                  moreDataHandler();
                }}
                ListFooterComponent={
                  <View>
                  {
                  loadingMoreSeller &&
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
                      <Text>No Data Found</Text>
                    }
                  </View>
                }
              />
            </View>
            <View style={{ flex:1 }}>
              { loadingCorporate &&
                [{},{},{},{},{},{},].map((l, i) => (
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
              <FlatList               
                data={dataCorporate}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>  <AccordionPickUpCorporate data={ item } />}
                initialNumToRender={15}   // how many item to display first
                onEndReachedThreshold={0.5} // so when you are at 5 pixel from the bottom react run onEndReached function
                ListHeaderComponent ={
                  <View style={{ backgroundColor:'white' }}>
                    <Text style={{marginHorizontal: 5, fontWeight:'bold' }}>Corporate ({totalCorp})</Text>
                    <Divider
                      style={{margin: 5 }}
                      color="red"
                      width={2}
                      orientation="horizontal"
                    />
                  </View>}
                  stickyHeaderIndices={[0]}
                onEndReached={() => {
                  moreDataCorpHandler();
                }}
                ListFooterComponent={
                  <View>
                  {
                  loadingMoreCorp &&
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
                      dataCorporate.length == 0 && !loadingCorporate &&
                      <Text>No Data Found</Text>
                    }
                  </View>
                }
              />
            </View>
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
    flex:2,
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
    flex : 13,
  },
  tableHead :{
    fontSize:12,
    color : 'grey'
  }
});

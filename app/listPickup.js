import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import { ListItem, Divider, Skeleton } from '@rneui/themed';
import { Link, router } from "expo-router";
import Header from './_components/Header';
import Footer from './_components/Footer';
import {SelectList} from 'react-native-dropdown-select-list';
import { HostUri } from './_components/HostUri';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';


export default function listPickup() {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingCorporate, setLoadingCorporate] = useState(true);
  const [data, setData] = useState([]);
  const [dataCorporate, setDataCorporate] = useState([]);
  const [err, setErr] = useState('Disconnected Please Check your Connection !');

  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore]= useState(false);

  
  const [currentPageCorp, setCurrentPageCorp] = useState(1);
  const [lastPageCorp, setLastPageCorp] = useState(1);
  const [totalCorp, setTotalCorp] = useState(0);
  const [loadingMoreCorp, setLoadingMoreCorp]= useState(false);

  const getMore = () => {
    if(currentPage < lastPage){
      setLoadingMore(true);
      setCurrentPage(currentPage+1);
      getData()
    }
  }

  const getMoreCorp = () => {
    if(currentPageCorp < lastPageCorp){
      setLoadingMoreCorp(true);
      setCurrentPageCorp(currentPage+1);
      getDataCorporate()
    }
  }


  const urut = [
    // {key:'1', value:'Seller', disabled:true},
    {key:'1', value:'Seller'},
    {key:'2', value:'Kelurahan'},
  ];

  useEffect(() => {
    getData();
    getDataCorporate();
  }, []);

  const getDataCorporate = async () => {
    await SecureStore.getItemAsync('secured_token').then((token) => {
      axios({
        method: "get",
        url: HostUri+'pickup/corporate?page='+currentPageCorp,
        headers: {
          "Content-Type": 'application/json',
          "Authorization" : `Bearer ${token}`,
        },
      }).then(function (response) {
          /// berhasil
          setLoadingCorporate(false);
          setLoadingMoreCorp(false);
          // setData(response.data.data.data);
          // console.log(response.data.data.data)
          if(currentPage == 1){
            setDataCorporate(response.data.data.data)
          }else{
            setDataCorporate([...data, ...response.data.data.data]);
          }
          // setData([...data, ...response.data.data]);
          setLastPageCorp(response.data.data.last_page);
          setTotalCorp(response.data.data.total)
        }).catch(function (error) {
          setLoadingMoreCorp(false);
          setLoadingCorporate(false);
          // masuk ke server tapi return error (unautorized dll)
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
          setLoadingMoreCorp(false);
          setLoadingCorporate(false);
            alert('Check Koneksi anda !')
            console.error(error.request);
          } else {
          setLoadingMoreCorp(false);
          setLoadingCorporate(false); 
            // error yang ga di sangka2
            console.error("Error", error.message);
          }
      });
      
    });
  }

  const getData = async () => {
    await SecureStore.getItemAsync('secured_token').then((token) => {
      axios({
        method: "get",
        url: HostUri+'pickup/seller?page='+currentPage,
        headers: {
          "Content-Type": 'application/json',
          "Authorization" : `Bearer ${token}`,
        },
      }).then(function (response) {
          /// berhasil
          setLoading(false);
          setLoadingMore(false);
          // setData(response.data.data.data);
          if(currentPage == 1){
            setData(response.data.data.data)
          }else{
            setData([...data, ...response.data.data.data]);
          }
          // setData([...data, ...response.data.data]);
          setLastPage(response.data.data.last_page);
          setTotal(response.data.data.total)
        }).catch(function (error) {
          // masuk ke server tapi return error (unautorized dll)
          setLoadingMore(false);
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
          setLoadingMore(false);
          setLoading(false);
            alert('Check Koneksi anda !')
            console.error(error.request);
          } else {
            // error yang ga di sangka2
          setLoadingMore(false);
          setLoading(false);
            console.error("Error", error.message);
          }
      });
      
    });
  }

    return (
        <SafeAreaView style={styles.container}>

          <View style={styles.headerContainer}>
            <Header />
          </View>

          <View style={styles.headerChild}>
            <Text style={styles.tanggal}>{ new Date().toLocaleDateString('id-ID', {weekday: 'long',  month: 'long', day:'2-digit', year :'numeric' }) }</Text>
            <View style={styles.dropdownContainer}>
              <SelectList 
                setSelected={(val) => setSelected(val)} 
                data={urut} 
                save="value"
                placeholder='Urutkan'
                dropdownStyles={{ zIndex:999, minHeight:100, backgroundColor : 'white', borderColor:'red' }}
                boxStyles={{ padding:10, marginHorizontal:5, borderColor:'red' }}
              />
            </View>
          </View>

          <View style={styles.totalContainer}><Text style={styles.totalText}>Total : {total} Seller | {totalCorp} Corporate</Text></View>
          
            <View style={styles.listContainer}>
            <FlatList               
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(item) => 
                  <ListItem bottomDivider Component={TouchableOpacity} >
                  <ListItem.Content>
                    <ListItem.Title>{item.item.name} {item.item.total > 1 && "("+item.item.total+")"}</ListItem.Title>
                    <ListItem.Subtitle>{item.item.subdistrict_name}</ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Content right>
                    <ListItem.Subtitle ><Link href={"/detailPickup/"+item.item.user_id} asChild><Text style={{ color:'blue' }}>Detail</Text></Link></ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
                }
                initialNumToRender={15}   // how many item to display first
                onEndReachedThreshold={1} // so when you are at 5 pixel from the bottom react run onEndReached function
                ListHeaderComponent ={
                  <View style={{ backgroundColor:'white' }}>
                    <Text style={{marginHorizontal: 5, fontWeight:'bold' }}>Pickup Seller ({total})</Text>
                    <Divider
                      style={{margin: 5 }}
                      color="red"
                      width={2}
                      orientation="horizontal"
                    />
                  </View>
                  }
                  stickyHeaderIndices={[0]}
                  onEndReached={() => {
                    getMore();
                  }}
                  ListFooterComponent={
                    <View>
                    {
                    loadingMore &&
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

            <View style={styles.listContainer}>
            <FlatList               
              data={dataCorporate}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item) => 
                <ListItem bottomDivider Component={TouchableOpacity} >
                    <ListItem.Content>
                      <ListItem.Title>{item.item.company_name} {item.item.total > 1 && "("+item.item.total+")"}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Content>
                    <ListItem.Subtitle>{item.item.kelurahan}</ListItem.Subtitle>
                  </ListItem.Content>

                    <ListItem.Content right>
                      <ListItem.Subtitle ><Link href={"/detailPickupCorporate/"+item.item.user_id} asChild><Text style={{ color:'blue' }}>Detail</Text></Link></ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
              }
              initialNumToRender={15}   // how many item to display first
              onEndReachedThreshold={1} // so when you are at 5 pixel from the bottom react run onEndReached function
              ListHeaderComponent ={
                <View style={{ backgroundColor:'white' }}>
                  <Text style={{marginHorizontal: 5, fontWeight:'bold' }}>Pickup Corporate ({totalCorp})</Text>
                  <Divider
                    style={{margin: 5 }}
                    color="red"
                    width={2}
                    orientation="horizontal"
                  />
                </View>
                }
                stickyHeaderIndices={[0]}
                onEndReached={() => {
                  getMoreCorp();
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
                    <View style={{ backgroundColor:'white' }}>
                        <Text>No Data Found</Text>
                    </View>
                  }
                  {
                    loadingCorporate &&
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
    height:'10%',
  },
  headerChild : {
    height:'4%',
    // flex: 1,
    flexDirection : 'row',
    marginHorizontal:5,
  },
  tanggal : {
    flex : 2,
    color:'grey',
    marginHorizontal: 5
  },
  dropdownContainer : {
    flex:1
  },
  totalContainer : {
    height:'6%',
    marginHorizontal:10,

  },
  totalText : {
    fontSize:16, 
    fontWeight:'bold',
    marginTop:5
  },
  listContainer : {
    flex:1
  }
});
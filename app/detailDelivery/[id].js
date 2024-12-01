import { StyleSheet, Text, SafeAreaView, View, ScrollView, FlatList, ActivityIndicator} from 'react-native';
import Header from '../_components/Header';
import Footer from '../_components/Footer';
import { useState, useEffect } from 'react';
import AccordionDelivery from '../_components/AccordionDelivery';
import { Divider, Skeleton, Dialog } from '@rneui/themed';
import { useLocalSearchParams, router } from 'expo-router';
import CanvasCamera from '../_components/CanvasCamera';
import { HostUri } from '../_components/HostUri';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';


export default function detailListDelivery() {
    const { id } = useLocalSearchParams();
    const [bigdata, setBigData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('')
    const [startCamera, setStartCamera] = useState(false);
    const [loadingHttp, setLoadingHttp] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loadingmore, setLoadingmore]= useState(false);
    
    const [returnData, setReturnData] = useState({
      shipping_id : '',
      selected_choice : '',
      name : '',
      check : '',
      reason : '',
    });
   
    
    const choiceList = [9, 10, 13];
    const reasonList = ['Tidak ada orang', 'Invalid Address', 'Ditolak Penerima', 'Alasan Lain'];
  
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
        url: HostUri+`delivery/seller/${id}?page=`+currentPage,
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
             setBigData(response.data.data.data)
           }else{
             setBigData([...bigdata, ...response.data.data.data]);
           }
           setLastPage(response.data.data.last_page);
           setTotal(response.data.data.total)
        }).catch(function (error) {
          setLoading(false);
          setLoadingmore(false);
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
            alert('Check Koneksi anda !')
            console.error(error.request);
           setLoadingmore(false);
           setLoading(false);
          } else {
            // error yang ga di sangka2
            console.error("Error", error.message);
           setLoadingmore(false);
           setLoading(false);
          }
      });
    });
    }

    const onPressUpdate = (id_return, choice_return = '', name_return = '', check_return = '', reason_return = '') => {
      if(choice_return == 1){
        setReturnData({
          shipping_id : id_return,
          selected_choice : choice_return,
          name : name_return,
          check : check_return,
          reason : reason_return,
        });
        setStartCamera(true);
      }else{
        updateShipping(id_return, choice_return, name_return, check_return, reason_return);
      }
    }

    const returnImage = (uri) =>
    {
      setStartCamera(false);
      updateShipping(returnData.shipping_id, returnData.selected_choice, returnData.name, returnData.check, returnData.reason, uri.uri);
      // console.log(returnData);
    }
    const updateShipping = async (shipping_id, selected_choice, name, check, reason, img='') =>{
     // choice
      //   {key:'1', value:'Pickup Sukses'},
      //   {key:'2', value:'Pickup Gagal'},
      // ALL REQUEST shipping_id, selected_tracking, alasan
      let true_reason = (check == 4) ? reason : reasonList[check-1];
      let formData = new FormData();
      formData.append('shipping_id', shipping_id);
      formData.append('selected_tracking', choiceList[(selected_choice-1)]);
      formData.append('alasan', true_reason);
      if(img != ''){
        const manipResult = await ImageManipulator.manipulateAsync(
          img,
          [],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        ); 
        let filename = manipResult.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        formData.append('img', { uri: manipResult.uri, name: filename, type });
      }
      setLoadingHttp(true);
      await SecureStore.getItemAsync('secured_token').then((token) => {
        let optHeader = {"Content-Type": 'multipart/form-data', "Authorization" : `Bearer ${token}`};
      axios({
        method: "post",
        url: HostUri+'delivery/update',
        headers: optHeader,
        // data : {
        //   shipping_id: shipping_id,
        //   selected_tracking: choiceList[(selected_choice-1)],
        //   alasan : true_reason,
        //   img : { uri: img, name: filename, type:type }
        // }
        data : formData
      }).then(function (response) {
          // berhasil
          setLoadingHttp(false);
          setLoading(true);
          getData();
          setLoading(false);
        }).catch(function (error) {
          // masuk ke server tapi return error (unautorized dll)
          if (error.response) {
            //gagal login
            setLoadingHttp(false);
            if(error.response.data.message == 'Unauthenticated.' || error.response.data.message == 'Unauthorized')
            {
              SecureStore.deleteItemAsync('secured_token');
              SecureStore.deleteItemAsync('secured_name');
              router.replace('/');
            }else{
              alert('Gagal ('+error.response.data.message+')');
            }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
          } else if (error.request) {
            // ga konek ke server
            setLoadingHttp(false);
            alert('Check Koneksi anda !')
            // console.error(error.request);
          } else {
            setLoadingHttp(false);
            alert('Fatal Error Please Contact Admin');
            // error yang ga di sangka2
            // console.error("Error", error.message);
          }
      });
  });
    }

    return (
        <SafeAreaView style={styles.container}>

          <View style={styles.headerContainer}>
            <Header/>
          </View>

          <View style={styles.headerChild}>
            <Text style={styles.tanggal}>{ new Date().toLocaleDateString('id-ID', {weekday: 'long',  month: 'long', day:'2-digit', year :'numeric' }) }</Text>
            <Text style={styles.dropdownContainer}>Total {total} AWB</Text>
          </View>

          <View style={styles.listContainer}>
          {
            startCamera &&
            <CanvasCamera startCamera={startCamera} returnImage = {returnImage}/>
          }
          {!startCamera && 
            (
            <View>
            <FlatList               
            data={bigdata}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>  <AccordionDelivery data={ item } onPressUpdate ={onPressUpdate} reasonList ={reasonList}  />}
            initialNumToRender={15}   // how many item to display first
            onEndReachedThreshold={0.5} // so when you are at 5 pixel from the bottom react run onEndReached function
            ListHeaderComponent ={
              <View>
              <Text>Delivery List</Text>
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
                  bigdata.length == 0 && !loading &&
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
                {
                  loadingHttp && 
                  <Dialog isVisible={loadingHttp} overlayStyle={{backgroundColor:'rgba(52, 52, 52, 0.5)' }}>
                    <ActivityIndicator />
                  </Dialog>
                }
                </View>
              }
          />
            </View>
            )
            }
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
    flex:1,
    margin : 10,
    textAlign:'right',
    fontSize:16,
    fontWeight:'bold'
  },
  listContainer : {
    flex : 13,
    paddingLeft:10,
    paddingRight:10,
  }
});
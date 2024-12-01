import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import Header from './_components/Header';
import Footer from './_components/Footer';
// import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera, CameraView } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Icon, Dialog } from '@rneui/themed';
import { HostUri } from './_components/HostUri';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as ImageManipulator from 'expo-image-manipulator';

// import motormini from '../assets/motormini.png';

//images
// import scangagalpickup from '../assets/scangagalpickup.png';
// import scansuccesspickup from '../assets/scansuccesspickup.png';
// import terimadc from '../assets/terimadc.png';
// import dikirimkurir from '../assets/dikirimkurir.png';
// import selesai from '../assets/selesai.png';
// import pending from '../assets/pending.png';
// import motormini from '../assets/motormini.png';
// import gagal from '../assets/gagal.png';
// import refunddc from '../assets/refunddc.png';
// import kurirrefund from '../assets/kurirrefund.png';
// import refundfinish from '../assets/refundfinish.png';
// import refundtake from '../assets/refundtake.png';

import CanvasCamera from './_components/CanvasCamera';
import CanvasSignature from './_components/CanvasSignature';
import { ScanMenu } from './_components/RolesScan';
import { router } from 'expo-router';

export default function scanMenu() {
 
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [choice, setChoice] = useState(null);
    const [choiceName, setChoiceName] = useState('');
    const [openScanner, setOpenScanner] = useState(false);
    const [awb, setAwb] = useState('');
    const [alasan, setAlasan] = useState('');
    const [loading, setLoading] = useState(false);

    const [startCamera, setStartCamera] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [imgUri, setImgUri] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const [startSignature, setStartSignature] = useState(false);
    const [imgSign, setImgSign] = useState('');
    const [menuButton, setMenuButton] = useState([]);

    const resetAll = () =>{
      setScanned(false);
      setChoice(null);
      setChoiceName('');
      setOpenScanner(false);
      setAwb('');
      setAlasan('');
      setLoading(false);
      setStartCamera(false);
      setShowReceipt(false);
      setImgUri('');
      setName('');
    }

    // const menuButton = [
    //   { name : 'Gagal PickUp', code: '3', img : scangagalpickup},
    //   { name : 'Pickup Sukses', code: '4', img : scansuccesspickup},
    //   { name : 'Gagal Corporate', code: '13', img : scangagalpickup},
    //   { name : 'Sukses Corporate', code: '9', img : scansuccesspickup},
    //   { name : 'Diterima DC', code: '5', img : terimadc},
    //   { name : 'Keluar DC', code: '6', img : terimadc},
    //   { name : 'Sampai DC', code: '7', img : terimadc},
    //   { name : 'Dikirim Kurir', code: '8', img : dikirimkurir},
    //   { name : 'Selesai', code: '9', img : selesai},
    //   { name : 'Pending',code: '10', img : pending},
    //   { name : 'Call Attempt 2', code: '11', img : motormini},
    //   { name : 'Call Attempt 3', code: '12', img : motormini},
    //   { name : 'Gagal', code: '13', img : gagal},
    //   { name : 'Refund Diterima DC', code: '14', img : refunddc},
    //   { name : 'Refund Keluar DC',code: '15', img : refunddc},
    //   { name : 'Kurir Refund', code: '16', img : kurirrefund},
    //   { name : 'Refund Finish', code: '17', img : refundfinish},
    //   { name : 'Refund Diambil', code: '18', img : refundtake},
    // ];

    useEffect(() => {
      async function getValueFor(key) {
        await SecureStore.getItemAsync(key).then((result) => {
          if(result){
            // setRole(result);
            setMenuButton(ScanMenu(result));
          }
        });
      }
      getValueFor('secured_role');
        const getBarCodeScannerPermissions = async () => {
          // const { status } = await BarCodeScanner.requestPermissionsAsync();
          const { status } = await Camera.requestCameraPermissionsAsync();
          console.log(status);
          setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setOpenScanner(false);
        setAwb(data);
        let name = menuButton.find(x => x.code === choice).name;
        Alert.alert(
          'Jadikan '+name+' ?',
          'awb '+data,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text : 'Save',
              // onPress: () => updateAwb(data,choice, alasan),
              onPress: () => handlerUpdateAwb(data),
              style : 'default'
            }
          ],
          {
            cancelable: true,
          },
        );
        // alert(`AWB ${data} Ditandai ${metode[choice].name} !`);
    };

    const handlerChoice = (number, name) => {
      if(number == 'x'){
        if(name == 'Assign Pickup'){
          router.replace('/assignPickupCourier')
        }
        if(name == 'Assign Deliv'){
          router.replace('/assignDeliveryCourier')
        }
        if(name == 'Assign Refund'){
          router.replace('/assignReturCourier')
        }
      }else{
        setChoice(number);
        setChoiceName(name);
        setOpenScanner(true);
      }
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera, please give access to camera !</Text>;
    }

    const handlerUpdateAwb = (data) => {
      if(['9', '17', '18'].includes(choice)){
        setShowReceipt(true);
      }else{
        updateAwb(data);
      }
    }

    const returnImage = (uri) =>
    {
      setStartCamera(false);
      setImgUri(uri);
      if(choiceName == 'Sukses Corporate'){
        setStartSignature(true);
      }else{
        updateAwb(awb, uri.uri);
      }
    }

    const returnSign = (sign) => {
      setImgSign(sign);
      setStartSignature(false);
      updateAwb(awb, imgUri.uri, sign);
      // setShowReceipt(true);
     }

    const receiptHandler = () =>{
      setShowReceipt(false);
      setStartCamera(true);
    }

    const updateAwb = async(awb, img= '', sign = '')=>
    {
      setLoading(true);
       let formData = new FormData();
       formData.append('awb', awb);
       formData.append('selected_tracking', choice);
       formData.append('alasan', alasan);
       formData.append('name', name);
       formData.append('phone', phone);
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
       if(sign != ''){
        formData.append('sign', {
          uri: sign, // base64
          name: awb+'_sign.png',
          type: 'image/png',
        });
       }
       let url = (awb.substring(0,2) == 'PO') ? HostUri+'scanCorporate' : HostUri+'scan';
      await SecureStore.getItemAsync('secured_token').then((token) => {
        let optHeader = { "Content-Type": 'multipart/form-data', "Authorization" : `Bearer ${token}`} ;
        axios({
          method: "post",
          url: url,
          headers: optHeader,
          data :formData
        }).then(function (response) {
            // berhasil
            setLoading(false);
            Alert.alert(
              'Sukses',
              'Awb berhasil di '+choiceName,
              [
                {
                  text: 'Ok',
                  style: 'cancel',
                }
              ],
              {
                cancelable: true,
              },
            );
          }).catch(function (error) {
            // masuk ke server tapi return error (unautorized dll)
            if (error.response) {
              //gagal login
              setLoading(false);
              if(error.response.data.message == 'Unauthenticated.' || error.response.data.message == 'Unauthorized')
              {
                SecureStore.deleteItemAsync('secured_token');
                SecureStore.deleteItemAsync('secured_name');
                router.replace('/');
              }
              if(error.response.data.message == 'data not found')
              {
                Alert.alert(
                  'AWB Tidak Dikenal',
                  'AWB Tidak Ada Di Joblist Anda',
                  [
                    {
                      text: 'Ok',
                      style: 'cancel',
                    }
                  ],
                  {
                    cancelable: true,
                  },
                );
              }else{
                // alert('Gagal '+choiceName+'('+error.response.data.message+')')
                alert('Gagal '+choiceName+'(Not Allowed)')
              }
              // console.error(error.response.data);
              // console.error(error.response.status);
              // console.error(error.response.headers);
            } else if (error.request) {
              // ga konek ke server
              setLoading(false);
              alert('Check Koneksi anda !')
              console.error(error.request);
            } else {
              setLoading(false);
              // error yang ga di sangka2
              console.error("Error", error.message);
            }
        });
        
      });
    }

  return (
    <SafeAreaView style={styles.container}>
      {
        loading && 
        <Dialog isVisible={loading} overlayStyle={{backgroundColor:'rgba(52, 52, 52, 0.5)' }}>
          <ActivityIndicator />
        </Dialog>
      }
        <View style={styles.headerContainer}>
            <Header title="SCAN AWB"/>
        </View>
        {
          startSignature &&
          <CanvasSignature startSignature = {startSignature} returnSign = {returnSign}/>
        }
        
        <View style={{ flex:1 }}>
        {
          openScanner &&
          <CameraView style={StyleSheet.absoluteFillObject} facing={'back'}
              barcodeScannerSettings={{
                barcodeTypes: [ 
                  //  'code39',
                  'code128',
                  //  'upc_a',
                  //  'upc_e',
                ],
              }}
            onBarcodeScanned = {(val)=>{handleBarCodeScanned(val)}}
            animateShutter={false}
        >
         <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                alignItems: "center",
                justifyContent: "center",
              }}
            >
            {/* <Icon type='material-community' name="scan-helper" color="#fff" size={250}/>  */}
            <View style={{borderWidth:5, borderColor:'white' ,alignItems: "center", width:'80%', height:'50%',
                justifyContent: "center",}}>

            </View>
          </View>

      </CameraView>

       
      }
        
      {
          startCamera &&
          <CanvasCamera startCamera={startCamera} returnImage = {returnImage}/>
      }
        { !openScanner && !startCamera && !startSignature &&
          <ScrollView contentContainerStyle={{ flexDirection:'row', flexWrap:'wrap', justifyContent:'center', alignItems:'flex-start' }}>
            {  
              menuButton.map((l, i) => (
            <TouchableOpacity key={i} style={styles.contentItem} onPress={()=>{handlerChoice(l.code, l.name)}}>
                <Image source={l.img} style={styles.iconImage} />
                <Text style={styles.contentText}>{l.name}</Text>
            </TouchableOpacity>
              ))
            }
            {/* <TouchableOpacity key={'x'} style={styles.contentItem} onPress={()=>{router.replace('/assignPickupCourier')}}>
                <Image source={motormini} style={styles.iconImage} />
                <Text style={styles.contentText}>Assign Pickup</Text>
            </TouchableOpacity>
            <TouchableOpacity key={'xx'} style={styles.contentItem} onPress={()=>{router.replace('/assignDeliveryCourier')}}>
              <Image source={motormini} style={styles.iconImage} />
                <Text style={styles.contentText}>Assign Deliv</Text>
            </TouchableOpacity>
            <TouchableOpacity key={'xxx'} style={styles.contentItem} onPress={()=>{router.replace('/assignReturCourier')}}>
              <Image source={motormini} style={styles.iconImage} /> 
                <Text style={styles.contentText}>Assign Refund</Text>
            </TouchableOpacity> */}
        </ScrollView>
        }
        
        </View>
        <Dialog isVisible={showReceipt} onBackdropPress={()=> {resetAll();}}>
              <View style={{ padding:10 }}>
                <Text>Diterima Oleh :</Text>
                <View style={styles.inputView}>
                  <TextInput onChangeText={(val)=>setName(val)} style={styles.input}/>
                </View>
                {
                  awb.substr(0,2) == 'PO' &&
                <View>                 
                    <Text>Telp : </Text>
                <View style={styles.inputView}>
                  <TextInput onChangeText={(val)=>setPhone(val)} style={styles.input} keyboardType='numeric'/>
                </View>
                </View>
                }
                <TouchableOpacity onPress={()=>{ receiptHandler()}}>
                <View style={{ borderColor:'white', backgroundColor:'red', borderWidth:2, borderRadius : 10, padding:10, alignItems:'center'}}>
                  <Text style={{ color:"white", fontWeight:'bold' }}>Update dan Ambil Foto</Text>
                </View>
              </TouchableOpacity>
              </View>        
          </Dialog>
        <Footer  />
    </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAF8ED',
      flexDirection:'column',
    },
    headerContainer : {
      height:'10%'
    },
    contentItem : {
      padding:5, 
      margin:5, 
      borderColor:'#FF8080', 
      borderWidth:1, 
      borderRadius:10,
      alignItems:'center',
      justifyContent:'space-evenly',
      width: '20%',
      flexWrap:'wrap',
    },
    iconImage:{
      resizeMode : 'contain'
    },
    contentText : {
      fontSize:12,
      marginTop:3,
      height:45,
      textAlign:'center'
    },
    
    inputView: {
      backgroundColor: "white",
      borderRadius: 10,
      marginTop:5,
      marginBottom: 20,
      borderWidth:1,
      borderColor:'red',
      height:50,
    },
    input : {
      height:50,
      textAlign:'left',
      paddingLeft:10
    }
  });
  
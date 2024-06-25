import { ActivityIndicator, Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Chip, Dialog, Divider, Header as HeaderRNE, Icon, Input, ListItem} from '@rneui/themed';
import { router } from "expo-router";
import { useState } from "react";

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { HostUri, Host } from "./_components/HostUri";
import { ScrollView } from "react-native";
import { useRef } from "react";
import CanvasBarcodeScanner from "./_components/CanvasBarcodeScanner";

export default function assignDeliveryCourier(){

    const [popUp, setPopUp]  =  useState(false);
    const [courierSelected, setCourierSelected] = useState(null);
    const [courierList, SetCourierList] = useState([]);
    const [city, setCity] = useState('');
    const [citySelected, setCitySelected] = useState(null);
    const [cityList, setCityList] = useState([]);
    const [vehicleSelected, setVehicleSelected] = useState(null);
    const [vehicleList, SetVehicleList] = useState([]);
    const [vehicleType, setVehicleType] = useState('motor');

    const [popLoading, setPopLoading] = useState(false);
    const [cityLoading, setCityLoading] = useState(false);

    const [popCity, setPopCity] = useState(false);
    const [popCityLoading, setPopCityLoading] = useState(false);

    const [popVehicle, setPopVehicle] = useState(false);
    const [popVehicleLoading, setPopVehicleLoading] = useState(false);

    const [openCamera, setOpenCamera] = useState(false);

    const [shippings, setShippings] = useState([]);
    const [awbSuccess, setAwbSuccess] = useState([]);
    const [awbFail, setAwbFail] = useState([]);

    const [loading, setLoading] = useState(false);

    const timeout = useRef(null);

    const popUpHandler = () => {
        setPopUp(!popUp);
    }
    const popUpCityHandler = () => {
        setPopCity(!popCity);
    }
    const popUpVehicleHandler = () => {
        setPopVehicle(!popVehicle);
    }

    const areaChangeHandler = (val) => {
        console.log(val);
        clearTimeout(timeout.current);
        setCity(val);
        if(city != ''){
            setCityLoading(true);
        }
        timeout.current = setTimeout(()=>{
            setPopCity(true);
            getCityList(val);
        }, 2000);
    }

    const handleDelete = (num) =>{
        Alert.alert('Konfirmasi Delete', 'Delete '+shippings[num]+' ?', [
        {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
        },
        {text: 'YES', onPress: () => {
            let arr = [...shippings];
            arr.splice(num, 1);
            setShippings(arr);
        }},
        ]);
       
    }

    const getCityList = async(value) => {
        setPopCityLoading(true);
      await axios({
        method: "get",
        url: Host+'CityTarifDestination?name='+value,
        headers: {
          "Content-Type": 'application/json',
        //   "Authorization" : `Bearer ${token}`,
        },
      }).then(function(result){
        setCityList(result.data);
      }).catch(function(error){
        console.log(error);
        // console.error(error.response.data);
        // console.error(error.response.status);
        // console.error(error.response.headers);
      }).finally(function(){
        setPopCityLoading(false);
      });
    }

    const getCourierList = async()=>{
        if(shippings.length < 1){
            alert('Scan Awb Terlebih dahulu !');
            return false;
        }
        setPopLoading(true);
        await SecureStore.getItemAsync('secured_token').then((token) => {
            let optHeader = { 
                "Content-Type": 'application/json', 
                "Authorization" : `Bearer ${token}`
            };
            let data = {
                shipping_id : shippings,
                tipe : 'delivery',
            }
            // console.log(citySelected);
            axios({
              method: "post",
              url: HostUri+`deliverykurirBulk`,
              headers: optHeader,
              data :data
            }).then(function (result) {
                SetCourierList(result.data.data);
            }).catch(function (error) {
                // masuk ke server tapi return error (unautorized dll)
            if (error.response) {
                //gagal login
                if(error.response.data.message == 'Unauthenticated.' || error.response.data.message == 'Unauthorized')
                {
                    SecureStore.deleteItemAsync('secured_token');
                    SecureStore.deleteItemAsync('secured_name');
                    router.replace('/');
                }
                  console.error(error.response.data);
                  console.error(error.response.status);
                  console.error(error.response.headers);
                } else if (error.request) {
                  // ga konek ke server
                  alert('Check Koneksi anda !')
                  console.error(error.request);
                } else {
                  // error yang ga di sangka2
                  console.error("Error", error.message);
                }
            }).finally(function(e){
                setPopLoading(false);
            });
            
          });
    }

    const getVehicleList = async() => {
        setPopVehicleLoading(true);
        await SecureStore.getItemAsync('secured_token').then((token) => {
            let optHeader = { 
                "Content-Type": 'application/json',
                "Authorization" : `Bearer ${token}`
            };
            
            // console.log(citySelected);
            axios({
              method: "get",
              url: HostUri+`vehicleTypeGet?tipe_kendaraan=${vehicleType}`,
              headers: optHeader,
            //   data :formData
            }).then(function (result) {
                SetVehicleList(result.data.data);
            }).catch(function (error) {
                // masuk ke server tapi return error (unautorized dll)
            if (error.response) {
                //gagal login
                if(error.response.data.message == 'Unauthenticated.' || error.response.data.message == 'Unauthorized')
                {
                    SecureStore.deleteItemAsync('secured_token');
                    SecureStore.deleteItemAsync('secured_name');
                    router.replace('/');
                }
                  console.error(error.response.data);
                  console.error(error.response.status);
                  console.error(error.response.headers);
                } else if (error.request) {
                  // ga konek ke server
                  alert('Check Koneksi anda !')
                  console.error(error.request);
                } else {
                  // error yang ga di sangka2
                  console.error("Error", error.message);
                }
            }).finally(function(e){
                setPopVehicleLoading(false);
            });
            
          });
    } 

    const returnValue = (val) => {
        if(shippings.length > 0){
            let arrFiltered = [];
            for (let i = 0; i < val.length; i++) {
                if(!shippings.includes(val[i])){
                   arrFiltered[i] = val[i];
                }
            }
            if(arrFiltered.length > 0){
                setShippings([
                    ...shippings, arrFiltered
                ]);
            }
        }else{
            setShippings(val);
        }
    }

    const assignHandler = async() =>{
        
        if(shippings.length > 20){
            alert('Batas maximum 20 AWB');
            return false;
        }
        if(shippings.length < 1){
            alert('Batas Minimum 1 AWB');
            return false;
        }
        if(courierSelected == null){
            alert('Pilih Kurir Dahulu');
            return false;
        }
        if(vehicleSelected == null){
            alert('Pilih Kendaraan Dahulu');
            return false;
        }
        let data = {
            shipping_id : shippings,
            // shipping_awb : shippings,
            courier_id : courierSelected.id,
            vehicle_id : vehicleSelected.vehicle_id,
            type : 'delivery',
        }
        setLoading(true);
        await SecureStore.getItemAsync('secured_token').then((token) => {
            axios({
              method: "POST",
              url: HostUri+`selectCourier`,
              headers: {
                "Content-Type": 'application/json',
                "Authorization" : `Bearer ${token}`,
              },
              data:data
            }).then(function (response) {
                // console.log(response.data.data);
                // console.log(response.data.data);
                setAwbSuccess(response.data.data.success);
                setAwbFail(response.data.data.fail);
                // console.log(response.data);
                // alert(response.data.message);
                // setData(response.data.data.data);
              }).catch(function (error) {
                // masuk ke server tapi return error (unautorized dll)
                if (error.response) {
                //gagal login
                if(error.response.data.message == 'Unauthenticated.' || error.response.data.message == 'Unauthorized')
                  {
                    SecureStore.deleteItemAsync('secured_token');
                    SecureStore.deleteItemAsync('secured_name');
                    router.replace('/');
                  }
                  console.error(error.response.data);
                  console.error(error.response.status);
                  console.error(error.response.headers);
                } else if (error.request) {
                  // ga konek ke server
                  alert('Check Koneksi anda !')
                  console.error(error.request);
                } else {
                  // error yang ga di sangka2
                  console.error("Error", error.message);
                }
            }).finally(function(){
              setLoading(false);
            });
          });
    }

    return(
        <View style={{flex:1}}>
            {
                openCamera &&
                <CanvasBarcodeScanner openCamera = {openCamera} setOpenCamera= {setOpenCamera} returnValue = {returnValue} />
            }
            
            {
                !openCamera &&
                <HeaderRNE
                leftComponent={
                    <TouchableOpacity 
                        style={{ marginLeft: 10 }} 
                        onPress={()=>{router.replace('/scanMenu')}}
                    >
                        <Icon type="antdesign" name="arrowleft" color='white' />
                    </TouchableOpacity>
                }
                rightComponent={{  }}
                centerComponent={{ text: 'Assign Delivery', style:{ color:'white', fontSize:20, fontWeight: "bold", }} }
                containerStyle={{ backgroundColor:'#ed1e24' }}
                statusBarProps={{ backgroundColor:'#ed1e24' }}
            />
            }
            {
                !openCamera && 
                <View style={{flexWrap:'wrap', margin:15}}>
                <View style={{flexDirection:'row'}}>
                    <View style={{flex:1}}>
                    <Text style={{fontWeight:'bold'}}>Area</Text>
                        {
                            !citySelected &&
                            
                            <Input
                                onChangeText={(val)=>{areaChangeHandler(val)}}
                                defaultValue={city}
                                rightIcon={ 
                                cityLoading &&
                                <ActivityIndicator color={'#ed1e24'} />
                            }
                            />
                        }
                        { citySelected && 
                            <Chip 
                                title={citySelected.subdistrict_name+', '+citySelected.city_name+', '+citySelected.province_name}
                                icon={<TouchableOpacity onPress={() => {setCitySelected(null); setCity(''); setCourierSelected(null); SetCourierList([]);setCityList([]); setCityLoading(false); }}><Icon  name='close' type='font-awesome' size={20}/></TouchableOpacity>}
                                iconPosition="right"
                                iconContainerStyle={{}}
                                type="outline"
                                titleStyle={{fontSize:10, color:'#ed1e24'}}
                                containerStyle={{margin:10}}
                            />
                        }
                    </View>
                    <View style={{flex:1}}>
                            <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                                <Text style={{fontWeight:'bold'}}>Kurir</Text>
                                {
                                    vehicleSelected == null &&
                                    <TouchableOpacity style={{ justifyContent:'center' }} onPress={()=>{
                                        setPopVehicle(true)
                                    }}>
                                        <Text style={{ fontSize:10 }}>Pilih Kendaraan</Text>
                                    </TouchableOpacity>
                                }
                                {
                                    vehicleSelected &&
                                    <TouchableOpacity style={{ justifyContent:'center' }} onPress={()=>{
                                        setPopVehicle(true)
                                    }}>
                                        <Text style={{ fontSize:10, color:'#ed1e24' }}>{vehicleSelected.vehicle_name} ({vehicleSelected.vehicle_number})</Text>
                                    </TouchableOpacity>
                                }

                            </View>
                            {
                                courierSelected &&
                                <TouchableOpacity onPress={()=>{
                                    if(courierList.length > 0){
                                        setPopUp(true);
                                    }else{
                                        setPopUp(true); getCourierList();
                                    }
                                }}>
                                    <Text style={{fontSize:14, fontWeight:'bold', color:'#ed1e24'}}>{courierSelected.fullname}</Text>
                                </TouchableOpacity>
                            }
                            {
                                courierSelected == null &&
                                <TouchableOpacity onPress={()=>{
                                    if(citySelected == null){
                                        alert('Pilih Area Dahulu !');
                                    }else{
                                        setPopUp(true); getCourierList();
                                    }
                                
                                }} style={{
                                    flexWrap:'wrap',
                                    borderWidth:1, borderColor:'#ed1e24', borderRadius:5, width:'100%', height:40,justifyContent:'center', marginVertical:10
                                }}>
                                    <Text style={{textAlign:'center', fontWeight:'bold', color:'#ed1e24', marginLeft:5}}>Pilih Kurir</Text>
                                </TouchableOpacity>
                            }
                        </View>

                </View>
                        
                        <TouchableOpacity onPress={()=>{setOpenCamera(true)}} style={{
                            borderWidth:1, borderColor:'#ed1e24', borderRadius:5, width:'100%', height:50,justifyContent:'center', backgroundColor:'#ed1e24'
                        }}>
                            <Text style={{textAlign:'center', fontWeight:'bold', color:'white'}}>Scan</Text>
                        </TouchableOpacity>
                        {
                            shippings.length > 20 &&
                            <Text style={{fontSize:12, color:'#ed1e24'}}>Batas Awb sekali Assign adalah 20</Text>
                        }
            </View>
            }
            {
                !openCamera && 
                <ScrollView>
                {
                    shippings.map((l, i) => (
                        <ListItem bottomDivider key={i}> 
                        {
                            awbSuccess.includes(l) &&
                            <TouchableOpacity onPress={{  }}>
                                <Icon type="antdesign" name="checkcircleo" color={'green'} />
                            </TouchableOpacity>
                        }
                        {
                            (awbFail.includes(l) || (!awbSuccess.includes(l) && awbSuccess.length > 0)) && 
                            <TouchableOpacity onPress={{  }}>
                                <Icon type="antdesign" name="closecircleo" color={'#ed1e24'} />
                            </TouchableOpacity>
                        }
                        {
                            awbSuccess.length < 1 &&
                            <TouchableOpacity onPress={{  }}>
                                <Icon type="entypo" name="circle" color={'#ed1e24'} />
                            </TouchableOpacity>
                        }
                    <ListItem.Content>
                        <ListItem.Title>{l}</ListItem.Title>
                    </ListItem.Content>
                    <TouchableOpacity onPress={()=>handleDelete(i)}>
                        <Icon type="antdesign" name="delete" color={'#ed1e24'} />
                    </TouchableOpacity>
                 </ListItem>
                    ))
                }
                {
                    shippings.length < 1 &&
                    <Text style={{margin:15}}>Scan untuk menambah Awb</Text>
                }
           
            </ScrollView>
            }
            {
                !openCamera && 
                <TouchableOpacity disabled={loading} onPress={()=>{assignHandler()}} style={{
                    borderWidth:1, borderColor:'#ed1e24', width:'100%', height:50,justifyContent:'center', backgroundColor:'#ed1e24'
                }}>
                {
                    loading &&
                    <ActivityIndicator color={'white'}/>
                }
                {
                    !loading && 
                    <Text style={{textAlign:'center', fontWeight:'bold', color:'white'}}>Assign</Text>
                }
                </TouchableOpacity>
            }
           
            
            
            
        <Dialog
            isVisible={popUp}
            onBackdropPress={()=>{popUpHandler()}}
            style={{ maxHeight : '90%'}}
            >
            <Dialog.Title title="List Kurir"/>
            {
                popLoading &&
                <ActivityIndicator size={'large'} />
            }
            {
                !popLoading && courierList.length < 1 &&
                <Text>Kurir Tidak ditemukan</Text>
            }
            <ScrollView>
            {
                courierList.map((l, i) => (
                    <TouchableOpacity onPress={()=>{setCourierSelected(l); setPopUp(false)}}  key={l.id}>
                    <ListItem
                      // key={l.subdistrict_id}
                      // onPress={l.onPress}
                      bottomDivider
                    >
                      <ListItem.Content>
                        <ListItem.Title >{l.fullname}</ListItem.Title>
                      </ListItem.Content>
                    </ListItem>
                    </TouchableOpacity>
                ))
            }
            </ScrollView>
        </Dialog>

        <Dialog
            isVisible={popCity}
            onBackdropPress={()=>{popUpCityHandler()}}
            style={{ maxHeight : '90%'}}
            >
            <Dialog.Title title="List Area"/>
            {
                popCityLoading &&
                <ActivityIndicator size={'large'} />
            }
            {
                !popCity && cityList.length < 1 &&
                <Text>Area Tidak ditemukan</Text>
            }
            <ScrollView>
            {
                cityList.map((l, i) => (
                    <TouchableOpacity onPress={()=>{setCitySelected(l); setPopCity(false)}}  key={l.subdistrict_id}>
                    <ListItem
                      // key={l.subdistrict_id}
                      // onPress={l.onPress}
                      bottomDivider
                    >
                      <ListItem.Content>
                        <ListItem.Title >{l.subdistrict_name}, {l.city_name}, {l.province_name}</ListItem.Title>
                      </ListItem.Content>
                    </ListItem>
                    </TouchableOpacity>
                ))
            }
            </ScrollView>
        </Dialog>

        <Dialog
            isVisible={popVehicle}
            onBackdropPress={()=>{popUpVehicleHandler()}}
            style={{ maxHeight : '90%'}}
            >
            <Dialog.Title title={"List "+vehicleType.charAt(0).toUpperCase()+vehicleType.slice(1)}/>
            <View style={{ flexDirection:'row', }}>
                <TouchableOpacity style={{ borderWidth:1, borderColor:'#ed1e24', margin:1, padding:5, flex:2 }} onPress={()=> {
                    setVehicleType(vehicleType == 'motor' ? 'mobil' : 'motor')
                }}>
                    <Text style={{ color:'#ed1e24', fontWeight:'bold' }}>{vehicleType.charAt(0).toUpperCase()+vehicleType.slice(1)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{getVehicleList()}} style={{ justifyContent:'center', flex:1, backgroundColor:'#ed1e24' }} disabled={popVehicleLoading }>
                    <Text style={{ textAlign:'right', alignSelf:'center', color:'white' }}>Cari</Text>
                </TouchableOpacity>
            </View>
            {
                popVehicleLoading &&
                <ActivityIndicator size={'large'} />
            }
            {
                !popVehicle && vehicleList.length < 1 &&
                <Text>Kendaraan Tidak ditemukan</Text>
            }
            <ScrollView>
            {
                vehicleList.map((l, i) => (
                    <ListItem
                      key={l.vehicle_id}
                      onPress={() => {setVehicleSelected(l); popUpVehicleHandler()}}
                      bottomDivider
                    >
                      <ListItem.Content>
                        <ListItem.Title >{l.vehicle_name} ({l.vehicle_number})</ListItem.Title>
                      </ListItem.Content>
                    </ListItem>
                ))
            }
            </ScrollView>
        </Dialog>



        </View>
    )

}
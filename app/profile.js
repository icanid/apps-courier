import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, TextInput, Button, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Icon, ListItem, Divider, Skeleton, Dialog } from '@rneui/themed';
import { HostUri, HostRef } from './_components/HostUri';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Footer from './_components/Footer';
import Header from './_components/Header';
import * as Clipboard from 'expo-clipboard';
import {expo} from '../app.json';
import { router } from 'expo-router';

export default profile = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popupLogout, setPopupLogout] = useState(false);
    const [httpLoading, setHttpLoading] = useState(false);
    

    const copyHandler = async (referal) => {
        await Clipboard.setStringAsync(referal).then(()=>{
            // alert('copied !')
        });
    }

    useEffect(() => {
        getData();
      }, []);

    const getData = async () => {
        await SecureStore.getItemAsync('secured_token').then((token) => {
          axios({
            method: "get",
            url: HostUri+`profile`,
            headers: {
              "Content-Type": 'application/json',
              "Authorization" : `Bearer ${token}`,
            },
          }).then(function (response) {
              // berhasil
              setLoading(false);
              setData(response.data.data);
            }).catch(function (error) {
              // masuk ke server tapi return error (unautorized dll)
              if (error.response) {
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
                // ga konek ke server
                setLoading(false);
                alert('Check Koneksi anda !')
                console.error(error.request);
              } else {
                // error yang ga di sangka2
                setLoading(false);
                console.error("Error", error.message);
              }
          });
        });
    }
    toggleLogout = () =>
    {
      setPopupLogout(!popupLogout);
    }
  
    async function del(key) {
      await SecureStore.deleteItemAsync(key);
    }
  
    const logoutHandler = async () =>
    {
        setHttpLoading(true);
        await SecureStore.getItemAsync('secured_token').then((token) => {
      axios({
        method: "get",
        url: HostUri+'logout',
        headers: {
          "Content-Type": 'application/json',
          "Authorization" : `Bearer ${token}`,
        },
      }).then(function (response) {
        setHttpLoading(false);
        // berhasil
          del('secured_token');
          del('secured_name');
          router.replace('/');
        }).catch(function (error) {
          // masuk ke server tapi return error (unautorized dll)
          if (error.response) {
            //gagal login
        setHttpLoading(false);

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
        setHttpLoading(false);

            alert('Check Koneksi anda !')
            console.error(error.request);
          } else {
        setHttpLoading(false);

            // error yang ga di sangka2
            console.error("Error", error.message);
          }
      });
    });
    }


    return(
        <SafeAreaView style={styles.container}>
        {
            httpLoading &&
            <Dialog isVisible={httpLoading} overlayStyle={{backgroundColor:'rgba(52, 52, 52, 0.5)' }}>
                <ActivityIndicator />
            </Dialog>
        }
            <View style={styles.headerContainer}>
                <Header title={'Ican Express v'+expo.version}/>
            </View>
            {
                loading &&
                <View style={styles.accountTitle}>
                <View style={{ flex:1, flexDirection:'row' }}>
                    <View style={{ flex:1 }}>
                        <Skeleton circle width={80} height={80} />
                    </View>
                    <View style={{ flex: 3 }}>
                        <Skeleton width={200} height={70} />
                    </View>
                </View>
            </View>
            }
            { !loading && 
            <View style={styles.accountTitle}>
                <View style={{ flex:1, flexDirection:'row' }}>
                    <View style={{ flex:1 }}>
                    <TouchableOpacity
                    style = {{
                      borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                      width: Dimensions.get('window').width * 0.2,
                      height: Dimensions.get('window').width * 0.2,
                      backgroundColor:'#f00',
                      justifyContent: 'center',
                      alignItems: 'center',
                      verticalAlign:'middle'
                    }}
                    underlayColor = '#ccc'
                    // onPress = { () => alert('Yaay!') }
                  >
                    <Text style={{ fontSize:26, color:'white' }}>{data.fullname?.charAt(0)}</Text>
                  </TouchableOpacity>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text style={{ fontSize:18, fontWeight:'bold' }}>{data.fullname}</Text>
                        <Text>{data.email}</Text>
                        <Text>{data.telp}</Text>
                        { data.company &&  <Text>{data.company.company_name}</Text> }
                    </View>
                </View>
            </View>
            }
            { !loading && data.user_referral &&
            <TouchableOpacity style={styles.inputView} onPress={()=>{copyHandler(HostRef+data.user_referral)}}>
                <Text style={{ fontSize:12 }}>Link Referral</Text>
                <TextInput
                style={styles.TextInput}
                value={HostRef+data.user_referral}
                editable={false} selectTextOnFocus={false}
                />
                <Icon type="entypo" name='copy' color="grey" size={20} style={{ marginRight:20 }}/>
            </TouchableOpacity>
            }
            <Button title='Logout' onPress={toggleLogout} color='red'/>            
            
            <TouchableOpacity style={{  margin: 15, width:'30%' }}>
            <Text style={{ fontSize:12, color:'red' }} onPress={() => {router.push('/changePassword')}}>Change Password</Text>
            </TouchableOpacity>

            <ScrollView style={styles.accountInfo}>
            <Text style={{ fontWeight:'bold', fontSize:16, marginHorizontal:20, marginVertical:10, color:'red' }}>Profile</Text>
            {
                loading &&
                <View>
                <Skeleton style={{ height:60, marginBottom:10 }} />
                <Skeleton style={{ height:60, marginBottom:10 }} />
                <Skeleton style={{ height:60, marginBottom:10 }} />
                <Skeleton style={{ height:60, marginBottom:10 }} />
                <Skeleton style={{ height:60, marginBottom:10 }} />
                <Skeleton style={{ height:60, marginBottom:10 }} />
                <Skeleton style={{ height:60, marginBottom:10 }} />
                </View>
            }
            {
                !loading && (
                <View>
            <ListItem>
                <ListItem.Content>
                    <ListItem.Subtitle style={{ color:'grey', fontSize:12 }}>Name</ListItem.Subtitle>
                    <ListItem.Title style={{ fontWeight:'bold', fontSize:18 }}>{data.name}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
            <Text style={{ fontWeight:'bold', fontSize:16, marginHorizontal:20, marginVertical:10, color:'red' }}>Address</Text>
            <ListItem>
                <ListItem.Content>
                    <ListItem.Subtitle style={{ color:'grey', fontSize:12 }}>Street</ListItem.Subtitle>
                    <ListItem.Title style={{ fontWeight:'bold', fontSize:16 }}>{data.complete_address}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
            <ListItem>
                <ListItem.Content>
                    <ListItem.Subtitle style={{ color:'grey', fontSize:12 }}>Sub District</ListItem.Subtitle>
                    <ListItem.Title style={{ fontWeight:'bold', fontSize:16 }}>{data.subdistrict_name}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
            <ListItem>
                <ListItem.Content>
                    <ListItem.Subtitle style={{ color:'grey', fontSize:12 }}>District</ListItem.Subtitle>
                    <ListItem.Title style={{ fontWeight:'bold', fontSize:16 }}>{data.kelurahan}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
            <ListItem>
                <ListItem.Content>
                    <ListItem.Subtitle style={{ color:'grey', fontSize:12 }}>City</ListItem.Subtitle>
                    <ListItem.Title style={{ fontWeight:'bold', fontSize:16 }}>{data.city_name}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
            <ListItem>
                <ListItem.Content>
                    <ListItem.Subtitle style={{ color:'grey', fontSize:12 }}>Province</ListItem.Subtitle>
                    <ListItem.Title style={{ fontWeight:'bold', fontSize:16 }}>{data.province_name}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
            </View>)
            }
            </ScrollView>
            <Footer/>
            <Dialog
      isVisible={popupLogout}
      onBackdropPress={toggleLogout}
    >
      <Dialog.Title title="Logout"/>
      <Text>anda ingin logout?</Text>
      <Dialog.Actions>
        <Dialog.Button title="Logout" onPress={() => logoutHandler()}/>
        <Dialog.Button title="Cancel" onPress={toggleLogout}/>
      </Dialog.Actions>
    </Dialog>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container : {
        flex: 1,
        // backgroundColor: '#EBE3D5',
        flexDirection:'column',
    },
    headerContainer : {
        // flex : 0.5,
        height:'10%',
    },
    accountTitle : {
        // flex : 1,
        height:'15%',
        padding:10,
        marginTop:10,

    },
    inputView: {
        // flex: 1,
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        width: "90%",
        height: 20,
        marginBottom: 10,
        alignItems: "center",
        alignSelf:'center'
      },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
        color:'blue',
        fontSize:10
      }
});
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking } from 'react-native';
import { ListItem, Dialog, CheckBox, Overlay } from '@rneui/themed';
import {SelectList} from 'react-native-dropdown-select-list';
import ShowPickUpReceipt from './ShowPickUpReceipt';

const AccordionPickUpCorporate = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [checked, setChecked] = useState(1);
    const [selected, setSelected] = useState(1);
    const [reasonText, setReasonText] = useState('');
    const [showRecept, setShowRecept] = useState(false);
   
    const onPressUpdate = props.onPressUpdate;
    const reasonList = props.reasonList;
    const choice = [
      {key:'1', value:'Pickup Sukses'},
      {key:'2', value:'Pickup Gagal'},
    ];

    let data = props.data;

    const toggleModal = () => {
      setShowModal(!showModal);
    };

    const toggleReceipt = () => {
      setShowRecept(!showRecept);
    }

    const updateHandler = (order_corporate_id, name, count, weight) => {
      onPressUpdate(order_corporate_id, selected, '', checked, reasonText, name, count, weight );
      setShowModal(!showModal);
      resetChoice();
    }

    const resetChecked = () => {
      setReasonText('');
      setChecked(1);
    }

    const resetChoice = () =>{
      setChecked(1);
      setSelected(1);
      setReasonText('');
    }

    return(
        <ListItem.Accordion
        content={
          <ListItem.Content>
            <ListItem.Title><Text style={{ color:'white' }}>{data.order_corporate_trx_id}</Text></ListItem.Title>
          </ListItem.Content>
        }
        isExpanded={expanded}
        onPress={() => {
            setExpanded(!expanded);
        }}
        key={data.id}
        containerStyle={styles.host}
      >
        <ListItem key={data.id} containerStyle={styles.guest}>
          <ListItem.Content>
            <View style={{ flexDirection:'row' }}>
                <View style={{ flex:1 }}>
                    <Text>{data.company_name}</Text>
                    <Text>{data.complete_address}</Text>
                    {
                      // data.kelurahan && <Text>Kel. {data.kelurahan}{data.city_name && <Text> Kota. {data.city_name}</Text>}</Text>
                    }
                    {
                      // data.province_name && <Text>Prov. {data.province_name} {data.zipcode && <Text>{data.zipcode} </Text>}</Text>
                    }
                    {
                      data.order_corporate_count && <Text>Jumlah Paket : {data.order_corporate_count}</Text>
                    }
                    {
                      data.order_corporate_weight && <Text>Estimasi Berat : {data.order_corporate_weight} gram</Text>
                    }
                    {data.telp && <Text>Telp. {data.telp}</Text>}
                    {data.order_corporate_status == 'picked up' && <Text>Status : Pickup Success</Text>}
                    {data.order_corporate_status == 'cancel' && <Text>Status : {data.order_corporate_reason}</Text>}
                 </View>
                {( data.order_corporate_status != 'picked up')  && (<View><TouchableOpacity><Text onPress={toggleModal} style={{ color:'blue',  fontWeight:'bold' }}>Update</Text></TouchableOpacity></View>)}
                
           <Dialog
              isVisible={showModal}
              // onBackdropPress={toggleModal}
            >
          <Dialog.Title title=""/>
          <SelectList 
                setSelected={(val) => {resetChecked;setSelected(val)}} 
                data={choice} 
                save="key"
                placeholder='Pickup Sukses'
                dropdownStyles={{ zIndex:999, minHeight:100, backgroundColor : 'white' }}
                boxStyles={{ margin:10, borderColor:'red' }}
            />
            {
              selected == 1 && <Text style={{ backgroundColor:'red', color:'white', padding:2, alignSelf:'center' }}>Pastikan Jumlah Paket sudah sesuai</Text>
            }
            { 
              selected == 1 
              && 
              <Dialog.Actions>
          <Dialog.Button
            title="Update dan Ambil Foto"
            onPress={() => {updateHandler(data.order_corporate_id, data.company_name, data.order_corporate_count, data.order_corporate_weight);}}
            titleStyle={{ color:'red' }}
          />
          <Dialog.Button title="CANCEL" onPress={()=>{resetChoice();toggleModal();}} titleStyle={{ color:'red' }}/>
        </Dialog.Actions>
            }
            { 
              selected == 2 
              && 
              reasonList.map((l, i) => (
                <CheckBox
                  key={i}
                  title={l}
                  containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={checked === i + 1}
                  onPress={() => setChecked(i + 1)}
                  checkedColor='red'
                />
              ))
            }
            {
              checked == 5
              &&
              <View style={styles.inputView}>
              <TextInput onChangeText={(val)=>setReasonText(val)} style={styles.input}/>
              </View>
            }
            { 
              selected == 2 
              && 
              <Dialog.Actions>
          <Dialog.Button
            title="UPDATE"
            // onPress={() => {
            //   console.log(`Option ${checked} was selected! and ${reasonText}`);
            //   toggleModal();
            // }}
            onPress={() => {updateHandler(data.order_corporate_id);}}
            titleStyle={{ color:'red' }}
          />
          <Dialog.Button title="CANCEL" onPress={()=>{resetChoice();toggleModal();}} titleStyle={{ color:'red' }}/>
        </Dialog.Actions>
            }
         
          </Dialog>
            </View>
            { (data.order_corporate_status != 'picked up') &&
              (
            <View style={styles.buttongroup}>
                <TouchableOpacity style={styles.button}><Text style={{ color:'white', textAlign : 'center' }}>WA Call</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button}><Text style={{ color:'white', textAlign : 'center' }} onPress={()=>{Linking.openURL(`http://api.whatsapp.com/send?phone=${data.telp.replace(data.telp[0], '+62')}`)}}>WA Chat</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button}><Text style={{ color:'white', textAlign : 'center' }}>Navigasi</Text></TouchableOpacity>
            </View>
            )
          }
          { (data.order_corporate_status == 'picked up') &&
              (
            <View style={styles.buttongroup}>
                <TouchableOpacity style={styles.button} onPress={()=>{toggleReceipt()}}><Text style={{ color:'white', textAlign : 'center' }}>Lihat Tanda Terima</Text></TouchableOpacity>
            </View>
            )
          }
          <Overlay isVisible={showRecept} onBackdropPress={()=>{toggleReceipt()}}>
          <ShowPickUpReceipt 
          sender = {data.company_name}
          total = {data.order_corporate_count}
          weight = {data.order_corporate_weight}
          img = {data.order_corporate_img}
          name = {data.order_corporate_submiter}
          hp = {data.order_corporate_submiter_phone}
          />
        </Overlay>
          </ListItem.Content>
        </ListItem>
      </ListItem.Accordion>
    );
}

const styles = StyleSheet.create({
    host : {
        backgroundColor : '#ff0000',
        marginBottom : 5,
    },
    guest : {
        backgroundColor : '#F3EEEA',
        padding: 10,
    },
    button : {
        flex : 1,
        borderColor : 'white',
        borderWidth : 2,
        borderRadius : 10,
        padding : 10,
        backgroundColor : '#ff0000',
        margin : 5
    },
    buttongroup : {
        flexDirection : 'row',
        margin : 10,
    },
    inputView: {
      backgroundColor: "white",
      borderRadius: 10,
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
    
export default AccordionPickUpCorporate;
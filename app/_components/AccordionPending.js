import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking } from 'react-native';
import { ListItem, Dialog, CheckBox } from '@rneui/themed';
import {SelectList} from 'react-native-dropdown-select-list';

const AccordionPending = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [checked, setChecked] = useState(1);
    const [selected, setSelected] = useState(1);
    const [name, setName] = useState('');
    const [reasonText, setReasonText] = useState('');

    const choice = [
      {key:'1', value:'Delivery Sukses'},
      {key:'2', value:'Delivery Pending'},
      {key:'3', value:'Delivery Gagal'},
    ];

    const onPressUpdate = props.onPressUpdate;
    const reasonList = props.reasonList;

    const resetChoice = () => {
      setChecked(1);
      setSelected(1);
      setName('');
      setReasonText('');
    }

   
    let data = props.data;

    const toggleModal = () => {
      setShowModal(!showModal);
    };
    
    const updateHandler = (shipping_id) => {
      onPressUpdate(shipping_id, selected, name, checked, reasonText );
      setShowModal(!showModal);
      resetChoice();
    }

    return(
      <View>
        <ListItem.Accordion
        content={
          <ListItem.Content>
            <ListItem.Title>
              <Text style={{ color:'white' }}>
                {data.shipping_awb} 
                {data.shipping_cod != 'no' && (<Text>COD</Text>)} 
                {data.tracking_status_id == 10 && (<Text>- Call 01</Text>)}
                {data.tracking_status_id == 11 && (<Text>- Call 02</Text>)}
                {data.tracking_status_id == 12 && (<Text>- Call 03</Text>)}
              </Text>
            </ListItem.Title>
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
                    <Text>{data.transaction_address_name}</Text>
                    <Text>{data.transaction_address_detail}</Text>
                    {data.kelurahan && <Text>Kel. {data.kelurahan}{data.city_name && <Text> Kota. {data.city_name}</Text>}</Text>}
                    {data.province_name && <Text>Prov. {data.province_name} {data.zipcode && <Text>{data.zipcode} </Text>}</Text>}
                    {data.telp && <Text>Telp. {data.telp}</Text>}
                    {data.shipping_product_weight && <Text>Berat {data.shipping_product_weight} gram</Text>}
                    {data.service && <Text>Service {data.service}</Text>}
                    {data.shipping_cod != 'no' && <Text>{data.shipping_total_cost}</Text>}
                    {[10, 11, 12].includes(data.tracking_status_id)  && data.reason &&<Text>Delivery Pending | alasan : {data.reason.shipping_history_desc.split(".")[1]}</Text>}
                    {data.tracking_status_id == '9' && <Text>Status Delivery Sukses</Text>}
                </View>
                <View>
                  { data.tracking_status_id != '13' && data.tracking_status_id != '9' &&
                  <TouchableOpacity><Text onPress={toggleModal} style={{ color:'blue',  fontWeight:'bold' }}>Update</Text></TouchableOpacity>
                  }
                </View>
            </View>
            <View style={styles.buttongroup}>
                <TouchableOpacity style={styles.button}><Text style={{ color:'white', textAlign : 'center' }}>WA Call</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button}><Text style={{ color:'white', textAlign : 'center' }} onPress={()=>{Linking.openURL(`http://api.whatsapp.com/send?phone=${data.telp.replace(data.telp[0], '+62')}`)}}>WA Chat</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button}><Text style={{ color:'white', textAlign : 'center' }}>Navigasi</Text></TouchableOpacity>
            </View>
          </ListItem.Content>
        </ListItem>
      </ListItem.Accordion>

      <Dialog isVisible={showModal} onBackdropPress={()=> {toggleModal(); resetChoice();}}>

          <Dialog.Title title=""/>
          <SelectList 
                setSelected={(val) => {setSelected(val)}} 
                data={choice} 
                save="key"
                placeholder='Delivery Sukses'
                dropdownStyles={{ zIndex:999, minHeight:100, backgroundColor : 'white' }}
                boxStyles={{ margin:10, borderColor:'red' }}
            />
            {
              selected == 1
              && 
              <View style={{ padding:10 }}>
                <Text>Diterima Oleh :</Text>
                <View style={styles.inputView}>
              <TextInput onChangeText={(val)=>setName(val)} style={styles.input}/>
              </View>
                <TouchableOpacity onPress={()=>{ updateHandler(data.shipping_id)}}>
                <View style={{ borderColor:'white', backgroundColor:'red', borderWidth:2, borderRadius : 10, padding:10, alignItems:'center'}}>
                  <Text style={{ color:"white", fontWeight:'bold' }}>Update dan Ambil Foto</Text>
                </View>
              </TouchableOpacity>
              </View>              
            }

            { 
              selected == 2 
              && 
              <View>
                {
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
                
                <View style={styles.inputView}>
                  <TextInput onChangeText={(val)=>setReasonText(val)} style={styles.input} editable={checked == 4}/>
                </View>
                <Dialog.Actions>
                <Dialog.Button
                  title={data.tracking_status_id == 10 && ("Call Attempt 01") || data.tracking_status_id == 11 && ("Call Attempt 02") || data.tracking_status_id == 12 && ("Call Attempt 03")}
                  onPress={() => {
                    updateHandler(data.shipping_id);
                  }}
                  titleStyle={{ color:'red' }}
                />
                <Dialog.Button title="CANCEL" onPress={()=>{toggleModal(); resetChoice();}} titleStyle={{ color:'red' }}/>
              </Dialog.Actions>
              </View>
            }
            { 
              selected == 3 
              && 
              <View>
                {
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
                <View style={styles.inputView}>
                <TextInput onChangeText={(val)=>setReasonText(val)} style={styles.input} editable={checked == 4}/>
              </View>
                <Dialog.Actions>
                <Dialog.Button
                  title="UPDATE"
                  onPress={() => {
                    updateHandler(data.shipping_id);
                  }}
                  titleStyle={{ color:'red' }}
                />
                <Dialog.Button title="CANCEL" onPress={()=>{toggleModal(); resetChoice();}} titleStyle={{ color:'red' }}/>
              </Dialog.Actions>
              </View>
            }         
          </Dialog>
        </View>
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
    
export default AccordionPending;
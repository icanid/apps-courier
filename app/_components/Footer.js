import { Tab, Icon} from '@rneui/themed';
import React, { useState } from 'react';
import {
StyleSheet, Text
} from 'react-native';
import { router, usePathname } from 'expo-router';

export default function Footer (props) {

    const [index, setIndex] = useState(usePathname() == '/home' ? 0 : (usePathname() == '/scanMenu' ? 1 : (usePathname() == '/profile' ? 2:3)));
    const changeHandler = (number) => {
        setIndex(number)
        if(number == 0){
            router.push('/home')
        } else if(number == 1){
            router.push('/scanMenu')
        } else if(number == 2){
            router.push('/profile')
        }
    }

    return(
    <Tab value={index} onChange={changeHandler} dense style={styles.tabstyle}>
        <Tab.Item><Icon type="antdesign" name="home" color="grey" size={30}/></Tab.Item>
        <Tab.Item ><Icon type="MaterialIcons" name="qr-code-scanner" color="grey" size={30} /></Tab.Item>
        <Tab.Item><Icon type="antdesign" name="user" color="grey" size={30}/></Tab.Item>
    </Tab>
    );
}

const styles = StyleSheet.create({
    tabstyle : {
        backgroundColor: '#FAF8ED',
    }
});
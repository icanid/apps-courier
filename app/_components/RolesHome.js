import mobil from '../../assets/mobil.png';
import mobilb from '../../assets/mobil2.png';
import motor from '../../assets/motor.png';
import box from '../../assets/box.png';
import boxgagal from '../../assets/boxgagal.png';
import dikirimkurir from '../../assets/dikirimkurir.png';
import scan from '../../assets/scan.png';
import sirine from '../../assets/sirine.png';
import pending from '../../assets/pending.png';

export const HomeMenu = (roles) =>{
    let allHomeMenu = [
        {ref : "/listPickup", src:mobil, text:'List Pickup'},
        {ref : "/listPickUpSuccess", src:motor, text:'Pickup Sukses'},
        {ref : "/listPickUpFail", src:box, text:'Gagal Pickup'},
        {ref : "/listDelivery", src:mobilb, text:'List Delivery'},
        {ref : "/listDeliverySuccess", src:dikirimkurir, text:'Delivery Sukses'},
        {ref : "/listDeliveryFail", src:boxgagal, text:'Delivery Gagal'},
        {ref : "/listDeliveryPending", src:pending, text:'Paket Pending'},
        {ref : "/scanMenu", src:scan, text:'Scan AWB'},
        {ref : "/home", src:sirine, text:'Emergency'},
    ]
    let homeMenu = [];
    switch (roles) {
        case 'admin' :
            homeMenu = allHomeMenu;
        break;
        case 'staff processing' :
            homeMenu = allHomeMenu;
        break;
        case 'staff monitoring' :
            homeMenu = allHomeMenu;
        break;
        case 'staff finance' :
        break;
        case 'district center' :
            homeMenu = allHomeMenu;
        break;
        case 'sales' :
        break;
        case 'kurir' :
            homeMenu = allHomeMenu
        break;
        case 'seller' :
        break;
        case 'seller staff' :
        break;
        case 'corporate' :
        break;
        case 'corporate staff' :
        break;
        case 'corporate staff' :
        break;
        default:
        break;
    }
    return homeMenu;
}
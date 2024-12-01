import scangagalpickup from '../../assets/scangagalpickup.png';
import scansuccesspickup from '../../assets/scansuccesspickup.png';
import terimadc from '../../assets/terimadc.png';
import dikirimkurir from '../../assets/dikirimkurir.png';
import selesai from '../../assets/selesai.png';
import pending from '../../assets/pending.png';
import motormini from '../../assets/motormini.png';
import gagal from '../../assets/gagal.png';
import refunddc from '../../assets/refunddc.png';
import kurirrefund from '../../assets/kurirrefund.png';
import refundfinish from '../../assets/refundfinish.png';
import refundtake from '../../assets/refundtake.png';

export const ScanMenu = (roles) =>{
    let AllScanMenu = [
        { name : 'Gagal PickUp', code: '3', img : scangagalpickup},
        { name : 'Pickup Sukses', code: '4', img : scansuccesspickup},
        { name : 'Gagal Corporate', code: '13', img : scangagalpickup},
        { name : 'Sukses Corporate', code: '9', img : scansuccesspickup},
        { name : 'Diterima DC', code: '5', img : terimadc},
        { name : 'Keluar DC', code: '6', img : terimadc},
        { name : 'Sampai DC', code: '7', img : terimadc},
        { name : 'Dikirim Kurir', code: '8', img : dikirimkurir},
        { name : 'Selesai', code: '9', img : selesai},
        { name : 'Pending',code: '10', img : pending},
        { name : 'Call Attempt 2', code: '11', img : motormini},
        { name : 'Call Attempt 3', code: '12', img : motormini},
        { name : 'Gagal', code: '13', img : gagal},
        { name : 'Refund Diterima DC', code: '14', img : refunddc},
        { name : 'Refund Keluar DC',code: '15', img : refunddc},
        { name : 'Kurir Refund', code: '16', img : kurirrefund},
        { name : 'Refund Finish', code: '17', img : refundfinish},
        { name : 'Refund Diambil', code: '18', img : refundtake},
        { name : 'Assign Pickup', code: 'x', img : motormini},
        { name : 'Assign Deliv', code: 'x', img : motormini},
        { name : 'Assign Refund', code: 'x', img : motormini},
      ];

    let menu = [];
    switch (roles) {
        case 'admin' :
            menu = AllScanMenu;
        break;
        case 'staff processing' :
            menu = [
                { name : 'Diterima DC', code: '5', img : terimadc},
                { name : 'Keluar DC', code: '6', img : terimadc},
                { name : 'Sampai DC', code: '7', img : terimadc},
                { name : 'Refund Diterima DC', code: '14', img : refunddc},
                { name : 'Refund Keluar DC',code: '15', img : refunddc},
                { name : 'Refund Diambil', code: '18', img : refundtake},
                { name : 'Assign Pickup', code: 'x', img : motormini},
                { name : 'Assign Deliv', code: 'x', img : motormini},
                { name : 'Assign Refund', code: 'x', img : motormini},
            ];
        break;
        case 'staff monitoring' :
            menu = [
                { name : 'Diterima DC', code: '5', img : terimadc},
                { name : 'Keluar DC', code: '6', img : terimadc},
                { name : 'Sampai DC', code: '7', img : terimadc},
                { name : 'Refund Diterima DC', code: '14', img : refunddc},
                { name : 'Refund Keluar DC',code: '15', img : refunddc},
                { name : 'Refund Diambil', code: '18', img : refundtake},
            ];
        break;
        case 'staff finance' :
        break;
        case 'district center' :
            menu = AllScanMenu;
        break;
        case 'sales' :
        break;
        case 'kurir' :
            menu = [
                { name : 'Gagal PickUp', code: '3', img : scangagalpickup},
                { name : 'Pickup Sukses', code: '4', img : scansuccesspickup},
                { name : 'Pending',code: '10', img : pending},
                { name : 'Dikirim Kurir', code: '8', img : dikirimkurir},
                { name : 'Selesai', code: '9', img : selesai},
                { name : 'Pending',code: '10', img : pending},
                { name : 'Call Attempt 2', code: '11', img : motormini},
                { name : 'Call Attempt 3', code: '12', img : motormini},
                { name : 'Gagal', code: '13', img : gagal},
                { name : 'Kurir Refund', code: '16', img : kurirrefund},
                { name : 'Refund Finish', code: '17', img : refundfinish},
            ];
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
        case 'merchant' :
            menu = [
                { name : 'Assign Pickup', code: 'x', img : motormini},
                { name : 'Assign Deliv', code: 'x', img : motormini},
                { name : 'Assign Refund', code: 'x', img : motormini},
            ];
        break;
        case 'merchant data entry' :
            menu = [
                { name : 'Assign Pickup', code: 'x', img : motormini},
                { name : 'Assign Deliv', code: 'x', img : motormini},
                { name : 'Assign Refund', code: 'x', img : motormini},
            ];
        break;
        default:
        break;
    }
    return menu;
}
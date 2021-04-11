import React, { useState } from "react";
import PermissionRequest from './PermissionRequest';
import DeniedComponent from './DeniedComponent';
import QR from './QRComponent';


const QRScanner = () => {
    const [permission, setPermisson] = useState('prompt');
    const [permissionWasUpdated, setPermissonWasUpdated] = useState(false);

    navigator.permissions.query({name: 'camera'}).then((result) => {
        if (result.state === 'granted') {
            setPermisson('granted');
        } else if (result.state == 'prompt') {
            setPermisson('prompt');
        } else {
            setPermisson('denied');
        }
    }).catch((err) => console.log("Error happens....", err));

    switch(permission) {
        case 'granted':
            return <QR />
        case 'prompt':
            return <PermissionRequest permissonWasUpdated={setPermissonWasUpdated}/>
        case 'denied':
            return <DeniedComponent />
    }
}

export default QRScanner;
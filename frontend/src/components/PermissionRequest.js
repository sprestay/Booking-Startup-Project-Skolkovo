import React from 'react';
import { Button } from 'react-bootstrap';

const PermissionRequest = (props) => {
    const getPermissions = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            await navigator.mediaDevices.getUserMedia({ video: true })
            .then((res) => console.log("Successfully get video permission!"))
            .catch((err) => console.log("User doent let us permission"));
        } else {
            console.log("This user is shit");
        }
        props.permissonWasUpdated(true);
    }

    return (
        <div style={{textAlign: 'center'}}>
            <p>Во время использования приложения необходимо будет сканировать QR-коды.</p>
            <p>Просим предоставить доступ к камере устройства</p>
            <Button onClick={getPermissions}>Я согласен</Button>
        </div>
    );
}

export default PermissionRequest;

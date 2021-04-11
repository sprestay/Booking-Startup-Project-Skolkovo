import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import React, { useState, useEffect } from 'react';
import 'react-html5-camera-photo/build/css/index.css';

const CameraComponent = (props) => {

    useEffect(() => {
        let cleanupFunction = false;
        // функция очистки useEffect
        return () => cleanupFunction = true;
      }, []);

    return <Camera
        idealFacingMode = {FACING_MODES.ENVIRONMENT}
        isFullscreen = {false}
        idealResolution = {{width: "300px", height: '400px'}}
        isImageMirror = {false}
        onTakePhoto = { (dataUri) => { props.getShoot(dataUri); } }
    />
}

export default CameraComponent;
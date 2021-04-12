import React from 'react';
import Header from './Header';
import QRScanner from './QRScanner';


const Main = (props) => {
    return (
        <div>
            <Header />
            <QRScanner {...props}/>
        </div>
    )
}

export default Main;
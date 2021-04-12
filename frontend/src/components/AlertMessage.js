import React from 'react';
import { AiFillWarning, AiFillFire, AiFillExclamationCircle } from 'react-icons/ai';

const AlertMessage = (props) => {
    const {type, message} = props;
    let color = '';
    let icon = null;
    switch(type) {
        case('success'): {
            color = 'green';
            icon = <AiFillFire size={40} color={color} />;
            break;
        }
        case("error"): {
            color = "red";
            icon = <AiFillExclamationCircle size={40} color={color} />;
            break;
        }
        case("warning"): {
            color = "#FFD90F";
            icon = <AiFillWarning size={40} color={color} />;
            break;
        }
    }

    return (
        <div id={"alert_message_id"} className={"external_message_box_on_create_page"}>
            <div className={"message_box_on_create_page"}>
                <div style={{display: 'inline-flex', alignItems: 'center'}}>
                    {icon}
                </div>
                <div style={{ marginTop: '10px'}}>
                    <p style={{color: color, fontWeight: 'bold', marginLeft: '25px', fontSize: '13px', fontFamily: 'Montserrat Bold'}}>{message}</p> 
                </div>
            </div>

        </div>
    )
}

export default AlertMessage;
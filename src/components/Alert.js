import React from 'react'

export default function Alert(props) {

    const capitalize=(word)=>{
        if(word==='danger') word="Error"
        let temp=word.toLowerCase();
        return temp.charAt(0).toUpperCase() + temp.slice(1);
    }

    return (

        <div style={{height: '50px'}}>

        {props.alert && <div>
            <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
                <strong>{capitalize(props.alert.type)}</strong> : {props.alert.msg}
            </div>
        </div>}
        </div>
    )
}

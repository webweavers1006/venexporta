import React from 'react'


const Options=({data})=>{
    if (data) {
        let ar = []
        for (const key in data) {
            ar.push(<div className='mb-4'>{data[key]}</div>)
        }
    return ar 
    }else{
        return null
    }
}

export default Options
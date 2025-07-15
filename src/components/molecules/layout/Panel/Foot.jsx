import React from 'react'

const LevelItem=({foot})=>{
    let ar = []
    for (const key in foot) {
        ar.push(<div className="level-item has-text-centered"><div><p className="heading mb-0">{foot[key].title}</p><p className="title has-text-white">{foot[key].value}</p></div></div>)
    }
    return ar
}

const Foot=({foot})=>{

    return(
        <React.Fragment>
            {foot?
            <div className="hero-foot">
                <nav className="level">
                    <LevelItem foot={foot}/>                       
                </nav>
            </div>
            :null}
        </React.Fragment>
    )
}
export default Foot
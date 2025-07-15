import React, {useState} from 'react'


const StepEmailP=({register})=>{

    const [clave, insertClave] = useState(register.clave)


    return (
            <React.Fragment>
                <div className='mb-5'>
                    <form className="field" >
                        <div className="field has-addons pb-4 mb-2">
                            <div className="control has-icons-right is-expanded">
                                <input className="input" type="password" placeholder="Contraseña" name="pass" value={clave} onChange={(e)=>(
                            insertClave(e.target.value)
                        )}/>
                                <span className="icon is-small is-right">
                                    <i className="fas fa-lock"></i>
                                </span>
                            </div>
                            <p className="control">
                                <span className="button is-static">
                                    <span className="d"></span>
                                </span>
                            </p>
                        </div>                 
                        <button className = "button is-fullwidth bg-primary text-white">Registrar</button>	
                    </form>
                </div>
            </React.Fragment>
        
    )
}
export default StepEmailP
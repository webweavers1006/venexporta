import { useState } from 'react';
import { postStepContact } from '../../lib/api/apiIndex';

const StepIdentificationP = ({ insertStep, insertRegister, register }) => {
    const [telefono, insertTelefono] = useState(register.telefono);
    const [correo, insertCorreo] = useState(register.correo);
    const [nombre, insertNombre] = useState(register.nombre || '');
    const [cargo, insertCargo] = useState(register.cargo || '');
    const [idEmpresa, insertIdEmpresa] = useState(register.id_empresa || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await postStepContact({
                telefono,
                correo,
                nombre,
                cargo,
                id_empresa: idEmpresa,
            });

            setSuccess(true);
            setTimeout(() => {
                setLoading(false);
                insertStep(4);
                insertRegister({
                    ...register,
                    telefono,
                    correo,
                    nombre,
                    cargo,
                    id_empresa: idEmpresa,
                });
            }, 2000);
        } catch (error) {
            setLoading(false);
            alert('Error al enviar los datos');
        }
    };

    return (
        <div className='mb-5'>
            <form className="field" onSubmit={handleSubmit}>
                <div className="columns is-multiline">
                    <div className="column is-half">
                        <div className="control has-icons-right pb-4">
                            <input className="input" type="email" placeholder="Correo" value={correo} name="correo" required onChange={(e) => (
                                insertCorreo(e.target.value)
                            )} />
                            <span className="icon is-small is-right">
                                <i className="fas fa-envelope"></i>
                            </span>
                        </div>
                    </div>

                    <div className="column is-half">
                        <div className="control has-icons-right pb-4">
                            <input className="input" type="number" placeholder="Celular" value={telefono} required onChange={(e) => (
                                insertTelefono(e.target.value)
                            )} name="phone" />
                            <span className="icon is-small is-right">
                                <i className="fas fa-phone"></i>
                            </span>
                        </div>
                    </div>

                    <div className="column is-half">
                        <div className="control has-icons-right pb-4">
                            <input className="input" type="text" placeholder="Nombre" value={nombre} required onChange={(e) => (
                                insertNombre(e.target.value)
                            )} name="nombre" />
                            <span className="icon is-small is-right">
                                <i className="fas fa-user"></i>
                            </span>
                        </div>
                    </div>

                    <div className="column is-half">
                        <div className="control has-icons-right pb-4">
                            <input className="input" type="text" placeholder="Cargo" value={cargo} required onChange={(e) => (
                                insertCargo(e.target.value)
                            )} name="cargo" />
                            <span className="icon is-small is-right">
                                <i className="fas fa-briefcase"></i>
                            </span>
                        </div>
                    </div>

                </div>

                <button className="button is-fullwidth bg-primary text-white" type="submit">Siguiente</button>
            </form>

            {loading && (
                <div className="modal is-active">
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <div className="box has-text-centered">
                            {!success ? (
                                <>
                                    <div className="loader"></div>
                                    <p>Enviando datos...</p>
                                </>
                            ) : (
                                <>
                                    <span className="icon is-large has-text-success">
                                        <i className="fas fa-check-circle fa-3x"></i>
                                    </span>
                                    <p>Datos enviados correctamente</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StepIdentificationP;
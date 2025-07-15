import { useState } from 'react';
import { postStepIdentification } from '../../lib/api/apiUser';

const StepNameL = ({ insertStep, insertRegister, register, insertBufetes, bufetes }) => {
    const [name, insertName] = useState(register.name || '');
    const [email, insertEmail] = useState(register.email || '');
    const [identification, insertIdentification] = useState(register.identification || '');
    const [pass, insertPass] = useState(register.pass || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await postStepIdentification({
                name,
                email,
                id_role: 12,
                identification,
                pass,
            });

            setSuccess(true);
            setTimeout(() => {
                setLoading(false);
                insertStep(2);
                insertRegister({
                    ...register,
                    name,
                    email,
                    id_role: 11,
                    identification,
                    pass,
                });
                insertBufetes({
                    ...bufetes,
                    id_user: response.user_data,

                });
            }, 2000);
        } catch (error) {
            setLoading(false);
            alert('Error al enviar los datos');
        }
    };

    return (
        <div className='mb-5'>
            <form className="field max-w-6xl" onSubmit={handleSubmit}>
                <div className="columns is-multiline">
                    <div className="column is-half">
                        <div className="control has-icons-right pb-4">
                            <input className="input" type="text" placeholder="Nombre" value={name} name="name" required onChange={(e) => (
                                insertName(e.target.value)
                            )} />
                            <span className="icon is-small is-right">
                                <i className="fas fa-user"></i>
                            </span>
                        </div>
                    </div>

                    <div className="column is-half">
                        <div className="control has-icons-right pb-4">
                            <input className="input" type="email" placeholder="Correo" value={email} name="email" required onChange={(e) => (
                                insertEmail(e.target.value)
                            )} />
                            <span className="icon is-small is-right">
                                <i className="fas fa-envelope"></i>
                            </span>
                        </div>
                    </div>

                    <div className="column is-half">
                        <div className="control has-icons-right pb-4">
                            <input className="input" type="text" placeholder="Identificación" value={identification} name="identification" required onChange={(e) => (
                                insertIdentification(e.target.value)
                            )} />
                            <span className="icon is-small is-right">
                                <i className="fas fa-passport"></i>
                            </span>
                        </div>
                    </div>

                    <div className="column is-half">
                        <div className="control has-icons-right pb-4">
                            <input className="input" type="password" placeholder="Contraseña" value={pass} name="pass" required onChange={(e) => (
                                insertPass(e.target.value)
                            )} />
                            <span className="icon is-small is-right">
                                <i className="fas fa-lock"></i>
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

export default StepNameL;
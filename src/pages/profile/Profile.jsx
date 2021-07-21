import { useContext, useEffect, useState } from 'react';
import md5 from 'md5';
import ApplicationContext from '../../context/ApplicationContext';
import { GetUserById, UpdateUser } from '../../services/AuthenticatedService';
import Modal from '../../components/Modal/Modal';
import { validateEmail, validateText } from '../../utils/RegexValidations';
import AlertMessage from '../../components/AlertMessage/AlertMessage';

const Profile = () => {
  const { modalIsOpen, refreshModalIsOpen, refreshShowAlertMessage, showAlertMessage} = useContext(ApplicationContext);
  const [userData, setUserData] = useState(undefined);
  const loadDataCurrentUser = async () => {
    const currentUserId = localStorage.getItem('USER_ID');
    const currentUser = await GetUserById(currentUserId);
    setUserData(currentUser);
  };

  const handleChangeInput = (e) => {

    const nameInput = e.target.name;
    const valueInput = e.target.value;

    const isValid =
      nameInput === 'email'
        ? validateEmail(valueInput)
        : validateText(valueInput);

    const messageValidation =
      nameInput === 'email'
        ? 'Debe ingresar un correo válido.'
        : 'Debe ingresar mas de 6 caracteres.';

    if (! isValid && valueInput) {
      refreshShowAlertMessage({
        visibility: true,
        message: messageValidation,
      });
    } else {
      refreshShowAlertMessage({
        visibility: false,
        message: '',
      });
    }

    if (e.target.name === 'email') {
      setUserData({
        ...userData,
        photoUrl: `https://www.gravatar.com/avatar/${md5(e.target.value)}`,
        [e.target.name]: e.target.value,
      });
    } else {
      setUserData({
        ...userData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSaveUserData = async () => {
    const currentUserId = localStorage.getItem('USER_ID');
    const resultUpdate = await UpdateUser(currentUserId, userData);
    if (resultUpdate) {
      refreshModalIsOpen({
        visibility: true,
        title: 'Mensaje',
        subTitle: 'Información actualizada correctamente.😎',
        callback: () => refreshModalIsOpen({ visibility: false }),
      });
    }
  };

  useEffect(() => {
    refreshShowAlertMessage({ visibility: false });
    loadDataCurrentUser();
  }, []);

  return (
    <>
      {modalIsOpen.visibility ? (
        <Modal
          title={modalIsOpen.title}
          subTitle={modalIsOpen.subTitle}
          callback={modalIsOpen.callback}
        />
      ) : null}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Perfil</h1>
      </div>
      {userData ? (
        <div className="main-body">
          <div className="row">
            <div className="col-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <img
                      src={userData.photoUrl}
                      alt="gravatar"
                      className="rounded-circle p-1"
                      width="110"
                    />
                    <div className="mt-3">
                      <h4>{`${userData.firstName} ${userData.lastName}`}</h4>
                      <p className="text-secondary mb-1">{userData.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Información:</h6>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Nombres</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={userData.firstName}
                        onChange={handleChangeInput}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Apellidos</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={userData.lastName}
                        onChange={handleChangeInput}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Correo</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={userData.email}
                        onChange={handleChangeInput}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Contraseña</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={userData.password}
                        onChange={handleChangeInput}
                      />
                    </div>
                  </div>
                  {showAlertMessage.visibility ? (
                    <AlertMessage message={showAlertMessage.message} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col">
              <button
                className="btn btn-lg btn-success float-end"
                onClick={handleSaveUserData}
                disabled={showAlertMessage.visibility}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <h5>Cargando...</h5>
      )}
    </>
  );
};

export default Profile;

import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, setMe } from '../../redux/action/auth.action';

export default function Settings() {
    const [password, setOldPassword] = useState('');
    const [oldPassword, setOldPassword1] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword1, setNewPassword1] = useState('');
    const [Newdemail, setNewdemail] = useState('');
    const jwt_access = localStorage.getItem('jwt_access');
    const location = useLocation();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState(null);
    const [show, setShow] = useState(false);

    const handleChangeEmail = async (e) => {
        e.preventDefault();
        setLoader(true);
        setErrors(null);

        await axios.post(`http://localhost:5000/api/v1/change-email`, { email: Newdemail, password: oldPassword }, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + jwt_access
            }
        })
        .then(({ data }) => {
            dispatch(setMe(data));
            setShow(false);
            setOldPassword("");
        })
        .catch(err => {
            if (err.response.status === 401) {
                dispatch(logout(location.pathname + location.search));
            } else {
                setErrors(err.response && err.response.data && err.response.data.errors ? err.response.data.errors : { global: err.response.message });
            }
        })
        .finally(() => {
            setLoader(false);
        });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoader(true);
        setErrors(null);

        await axios.post(`http://localhost:5000/api/v1/change-password`, { password: password, newpassword: newPassword }, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + jwt_access
            }
        })
        .then(({ data }) => {
            dispatch(setMe(data));
            setShow(false);
            setOldPassword("");
        })
        .catch(err => {
            if (err.response.status === 401) {
                dispatch(logout(location.pathname + location.search));
            } else {
                setErrors(err.response && err.response.data && err.response.data.errors ? err.response.data.errors : { global: err.response.message });
            }
        })
        .finally(() => {
            setLoader(false);
        });
    };

    return (
        <HelmetProvider>
            <Helmet>
                <title>Paramètres - D&amp;I Pointing</title>
            </Helmet>

            <section className="py-10">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Paramètres de votre compte</h2>

                    <form className="mb-6" onSubmit={handleChangeEmail}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Adresse email</label>
                            <input
                                type="text"
                                placeholder="Entrez l'adresse email"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={Newdemail}
                                onChange={(e) => setNewdemail(e.target.value)}
                            />
                            {errors && errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Mot de passe</label>
                            <input
                                type="password"
                                placeholder="Entrez le mot de passe"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={oldPassword}
                                onChange={(e) => setOldPassword1(e.target.value)}
                            />
                            {errors && errors.currentPassword && <div className="text-red-500 text-sm mt-1">{errors.currentPassword}</div>}
                        </div>

                        <div>
                            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition" type="submit">
                                Enregistrer l'adresse email
                            </button>
                        </div>
                    </form>

                    <form onSubmit={handleChangePassword}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Ancien Mot de passe</label>
                            <input
                                type="password"
                                placeholder="Entrez l'ancien mot de passe"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Nouveau Mot de passe</label>
                            <input
                                type="password"
                                placeholder="Entrez le nouveau mot de passe"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Confirmer Mot de passe</label>
                            <input
                                type="password"
                                placeholder="Confirmez le nouveau mot de passe"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newPassword1}
                                onChange={(e) => setNewPassword1(e.target.value)}
                            />
                        </div>

                        <div>
                            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition" type="submit"
                                disabled={loader || newPassword !== newPassword1 || newPassword.length < 8}>
                                Enregistrer le mot de passe
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </HelmetProvider>
    );
}

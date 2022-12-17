import React, { useEffect, useState } from 'react';
import { Alert, Avatar, Button, Modal, Snackbar } from '@mui/material';
import { Box } from '@mui/system';
import { Link, useNavigate } from 'react-router-dom';
import perfil from '../../Assets/perfil.png'

import BoxStyle from '../../styles/BoxModal';
import './SignBox.css';

export default function SignBox() {
    const navigate = useNavigate();

    const [isLogged, setLogged] = useState(false);
    const [user, setUser] = useState();

    const [loginInfos, setLoginInfos] = useState();
    const [registerInfos, setRegisterInfos] = useState();

    const [loginIncorreto, setLoginIncorreto] = useState(false);
    const [registerIncorreto, setRegisterIncorreto] = useState(false);

    const [error, setError] = useState(false);

    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);

    const vertical = "center";
    const horizontal = "center";

    //Verifica se o user ja estava logado
    useEffect(() => {

        if(localStorage.getItem('user')) {
            const requestOption = {
                method: "GET",
                headers: { 'Content-Type': 'application/json', 'Authorization':  `Bearer ${localStorage.getItem('user')}`}
            }
    
            fetch(`http://localhost:3001/clientes/loginAuto/${localStorage.getItem('userID')}`, requestOption)
                .then(async (response) => {
                    const data = await response.json();
                    if (data.status == "invalid") setLoginIncorreto(true);
                    else {
                        setUser(data);
                        setLogged(true);
                    }
                })
                .catch(err => {
                    setError(true);
                })
        }
    }, [])

    //Função de Registro 
    const handleRegister = (event) => {
        event.preventDefault();

        const requestOption = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: registerInfos.nome,
                endereco: registerInfos.endereco,
                telefone: registerInfos.telefone,
                email: registerInfos.email,
                nascimento: registerInfos.nascimento,
                login: registerInfos.login,
                senha: registerInfos.senha,
                foto: 'a'
            })
        }

        fetch('http://localhost:3001/clientes/createClient', requestOption)
            .then(async (response) => {
                const data = await response.json();
                if (data.status == "invalid") setRegisterIncorreto(true);
                else {
                    setUser(data);
                    setLogged(true);
                }
            })
            .catch(err => {
                setError(true);
            })
    }

    //Função de login
    const handleLogin = (event) => {
        event.preventDefault();

        const requestOption = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                login: loginInfos.login,
                senha: loginInfos.senha
            })
        }

        fetch('http://localhost:3001/clientes/login', requestOption)
            .then(async (response) => {
                const data = await response.json();
                if (data.status == "invalid") setLoginIncorreto(true);
                else {
                    setUser(data.user);
                    localStorage.setItem('user', data.token);
                    localStorage.setItem('userID', data.user.id);
                    setLogged(true);
                }
            })
            .catch(err => {
                setError(true);
            })
    }

    const deslogado = () => {
        return (
            <div>
                <Button onClick={() => setOpenRegister(true)} variant="contained" color="info">Register</Button>
                <Modal open={openRegister} className="flexCenter">
                    <Box sx={BoxStyle}>
                        <Button onClick={() => setOpenRegister(false)} variant="contained" color="info" className='closeButton'>X</Button>
                        <div className='mainDiv'>
                            <h1 className='formText'>Bem-vindo/a, faça login para acessar sua conta!</h1>
                            <form onSubmit={event => handleRegister(event)} className='mainForm'>
                                <label htmlFor="">Nome</label>
                                <input required type="text" onChange={event => setRegisterInfos({ ...registerInfos, nome: event.target.value })} />
                                <label htmlFor="">Endereço</label>
                                <input required type="text" onChange={event => setRegisterInfos({ ...registerInfos, endereco: event.target.value })} />
                                <label htmlFor="">Login</label>
                                <input required type="text" onChange={event => setRegisterInfos({ ...registerInfos, login: event.target.value })} />
                                <label htmlFor="">Senha</label>
                                <input required type="password" onChange={event => setRegisterInfos({ ...registerInfos, senha: event.target.value })} />
                                <label htmlFor="">telefone</label>
                                <input required type="phone" onChange={event => setRegisterInfos({ ...registerInfos, telefone: event.target.value })} />
                                <label htmlFor="">email</label>
                                <input required type="email" onChange={event => setRegisterInfos({ ...registerInfos, email: event.target.value })} />
                                <label htmlFor="">Data de nascimento</label>
                                <input required type="date" onChange={event => setRegisterInfos({ ...registerInfos, nascimento: event.target.value })} />
                                <input type="submit" className="submitButton" />
                                <Snackbar open={registerIncorreto} anchorOrigin={{ vertical: 'center', horizontal: 'center' }} autoHideDuration={4000} onClose={() => setRegisterIncorreto(false)}>
                                    <Alert severity="warning">Login ou Senha incorreta!</Alert>
                                </Snackbar>
                            </form>
                        </div>
                    </Box>
                </Modal>



                <Button onClick={() => setOpenLogin(true)} variant="text" color="info">Login</Button>
                <Modal open={openLogin} className="flexCenter">
                    <Box sx={BoxStyle}>
                        <Button onClick={() => setOpenLogin(false)} variant="contained" color="info" className='closeButton'>X</Button>
                        <div className='mainDiv'>
                            <h1 className='formText'>Bem-vindo/a, faça login para acessar sua conta!</h1>
                            <form onSubmit={event => handleLogin(event)} className='mainForm'>
                                <label htmlFor="">Login</label>
                                <input required type="text" onChange={event => setLoginInfos({ ...loginInfos, login: event.target.value })} />
                                <label htmlFor="">Senha</label>
                                <input required type="password" onChange={event => setLoginInfos({ ...loginInfos, senha: event.target.value })} />
                                <input type="submit" className="submitButton defaultButton" />
                                <Snackbar open={loginIncorreto} anchorOrigin={{ vertical: 'center', horizontal: 'center' }} autoHideDuration={4000} onClose={() => setLoginIncorreto(false)}>
                                    <Alert severity="warning">Login ou Senha incorreta!</Alert>
                                </Snackbar>
                            </form>
                        </div>
                    </Box>
                </Modal>

                <Snackbar open={error} anchorOrigin={{ vertical, horizontal }} autoHideDuration={4000} onClose={() => setError(false)}>
                    <Alert severity="error">Houve um erro inesperado , tente novamente em alguns minutos!</Alert>
                </Snackbar>
            </div>
        )
    }

    const logado = () => {
        return (
            <div className='menu'>
                <Avatar src={user.foto ? user.foto : perfil} alt="foto do usuário" className='avatarIMG'/>
                <div className='flexCenter'>
                    <Link to='/account' state={user} className="myAccountLink">
                        <Button variant="text" color="info">Minha conta</Button>
                    </Link>
                    <Button variant="contained" color="info" onClick={() => logout()}>Logout</Button>
                </div>
            </div>
        )
    }

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userID');
        setUser();
        setLogged(false);
        navigate(-1);
        
    }

    return (
        <div>
            {isLogged ? logado() : deslogado()}
        </div>
    )

}
import React, {useContext, useState} from 'react';
import {Container, Form, Card, Button} from "react-bootstrap";
import {NavLink, useLocation, useHistory} from "react-router-dom";
import {LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import jwt_decode from "jwt-decode";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {login, registration, update} from "../http/user_api";

const Auth = observer(() => {
    const location = useLocation()
   // const isLogin = location.pathname === LOGIN_ROUTE
    const history = useHistory()
    const {user} = useContext(Context)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nickname, setNickname] = useState('')

    const [errors, setErrors] = useState([])
    const [isLogin, setIsLogin] = useState(true)
    if ((location.pathname === LOGIN_ROUTE) !== isLogin){
        setIsLogin(location.pathname === LOGIN_ROUTE);
    }
    const storedToken = localStorage.getItem("token");
    if (storedToken){
        let decodedData = jwt_decode(storedToken, { header: true });
        let expirationDate = decodedData.exp;
        let current_time = Date.now();
        if(expirationDate < current_time)
        {
            localStorage.removeItem("token");
        }
    }

    const click = async () => {
        let errors = []
        try {
            let data;
            if (email==='' || email == null) {
                errors.push('Пропущено поле email.')
            }else{
                if(!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))
                    errors.push("Поле email не валидно.")
            }
            if (password==='' || password == null)
                errors.push('Пропущено поле пароля.')
            if (isLogin && errors.length===0) {
                data = await login(email, password);
            } else {
                if (!isLogin && (nickname==='' || nickname == null))
                    errors.push('Пропущено поле имени.')
                if (errors.length===0)
                    data = await registration(email, nickname, password);
            }
            if(data && errors.length===0) {
                user.setIsAuth(true)
                user.setUser(data)
                history.push(MAIN_ROUTE)
            }
            if (errors.length!==0)
                throw new Error('ValidationError')
            window.location.reload();
        } catch (e) {
           // history.push(LOGIN_ROUTE)
            if (e.message === 'ValidationError') {
            }else{
                errors = ["Нет соответствия в паре логин-пароль."]
            }
            setErrors(errors)
            //return alert(e)
        }

    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center containerMain"
            style={{height:window.innerHeight - 54, backgroundColor: "white"}}
        >
            <Card style={{width: 600, backgroundColor:'black', color:'white'}} style={{border: "4px solid black", backgroundColor:"white"}} className="p-5">
                <h2 className="m-auto">{!isLogin ?  "Регистрация": "Авторизация"}</h2>
                <div className='formErrors' style={{display:"flex", flexDirection:"column", marginTop:"10px"}}>
                    {(errors).map((fieldName) => {
                       return <div style={{fontSize:"16pt", marginBottom:"10px", whiteSpace: "break-spaces"}} className="badge badge-pill badge-danger"> {fieldName}</div>
                    })}
                </div>
                <Form className="d-flex flex-column" >
                    {!isLogin ? <Form.Control
                        className="mt-3"
                        placeholder="Введите ваше имя/псевдоним..."
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
                    />: <div></div> }
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email..."
                        type="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    <Button
                        onClick={click}
                        className="d-flex mt-3 justify-content-center"
                        variant={"dark"}
                        style={{backgroundColor:"#6C5B7B", textAlign:"center"}}
                    >
                        {!isLogin ? "Зарегистрироваться": "Войти"}
                    </Button>
                    {!isLogin ?
                        <div className="align-self-center">
                            Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войти</NavLink>
                        </div>
                        :
                        <div className="align-self-center">
                        Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрироваться</NavLink>
                        </div>
                    }
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;

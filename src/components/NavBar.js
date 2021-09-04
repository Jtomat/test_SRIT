import React, {useContext} from 'react';
import {Context} from "../index";
import {Button, Navbar, Container} from "react-bootstrap";
import {Nav} from "react-bootstrap";
import {NavLink, useHistory} from "react-router-dom";
import {LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import ArchiveMenu from "./ArchiveMenu";
import LanguageMenu from "./LanguageMenu";
import AdditionalMenu from "./AdditionalMenu";
import "../styles.css"

const phantom = {
    display: 'block',
    padding: '20px',
    height: '60px',
    width: '100%',
}



const NavBar = observer(() => {
    const {user} = useContext(Context)
    const history = useHistory()

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.clear();
        window.location.reload();
    }
    if(!(user.isAuth) && (!(window.location.href === '/' || window.location.href===''
        ||window.location.href===LOGIN_ROUTE ||window.location.href===REGISTRATION_ROUTE)))
            history.push('/');

    return (
        <div>
        <Navbar variant="dark" className="mb-3" style={{backgroundColor:'black', position:'fixed', zIndex:'3', height: "60px", width: "100%",}}>
            <Container>
              <NavLink className="ico" to={MAIN_ROUTE}>UnSleepingEye</NavLink>

                {user.isAuth ?
                <ArchiveMenu />:""}
                {user.isAuth ? <AdditionalMenu/>:""}
            {user.isAuth ?
                <Nav className="ml-auto" style={{color: 'white'}}>
                    <Button variant={"outline-light"} style={{border:"unset"}} onClick={() => logOut()}>Выйти</Button>
                </Nav> :
                <Nav className="ml-auto" style={{color: 'white'}}>
                    <Button variant={"outline-light"} style={{border:"unset"}} onClick={() => history.push(LOGIN_ROUTE)}>Авторизация</Button>
                </Nav>
            }
            </Container>
        </Navbar>
            <div style={phantom} />
        </div>
    );
});

export default NavBar;

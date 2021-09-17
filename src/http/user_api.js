import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";
import {set} from "mobx";


export const registration = async (email, nickname, password) => {
    const {data} = await $host.post(`/au/registration`, {email: email, password:password, name:nickname})
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('unid', data.name)
    localStorage.setItem('u', email)
    localStorage.setItem('p', password)
    return jwt_decode(data.access_token)
}

export const login = async (email, password) => {
    const {data} = await $host.post(`/au/login`, {email: email, password:password})
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('unid', data.name)
    localStorage.setItem('u', email)
    localStorage.setItem('p', password)
    return jwt_decode(localStorage.getItem('token'))
}

export const update = async () =>{
    const uName = localStorage.getItem('u')
    const pass = localStorage.getItem('p')
    return login(uName, pass)
}

export const check = async () => {
    const {data} = await $authHost.get('/au/auth' )
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

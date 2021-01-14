import axios from 'axios';
import {useRef, useState} from 'react'
import {Redirect} from 'react-router';

let style = {
    backgroundLogin: {
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100vh',
        maxHeight: '100vh',
        backgroundColor: 'red',
        display: 'grid',
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    insideLogin: {
        borderRadius: "6px",
        minHeight: "500px",
        maxHeight: "500px",
        minWidth: "360px",
        maxWidth: "500px",
        boxShadow: "2px 2px 2px 0px rgb(70, 70, 70), 5px 5px 6px 0px #000000",
        backgroundColor: "white",
        display: "grid"
    },
    button: {
        flex: '1',
        cursor: 'pointer',
        boxShadow: "2px 2px 2px 0px rgb(70, 70, 70), 5px 5px 6px 0px #000000",
        transition: "0.5s ease-in-out",
        width: "25%",
        height: "30px",
        display: "grid",
        position: "relative",
        alignContent: "center",
        left: "37.5%",
        color: "black",
        textShadow: "0 0 0 transparent, 0 0 0 transparent",
        overflow: "visible",
        background: "darkorange",
        fontSize: "80%",
        fontWeight: "bold",
        margin: "0"
    }
}

const Login = () => {
    let input = useRef(null);
    let password = useRef(null);
    let [displayMessage,
        setMessage] = useState("");
    let [signIn,
        setSignIn] = useState(false);
    async function signUp() {
        axios.post('http://localhost:8080/signup', {
            username: input.current.value,
            password: password.current.value
        }, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        }).then(res => {
            setMessage(res.data);
            setSignIn(true);
        }).catch(error => {
            setMessage(error.response.data.message);
        })
    }
    async function login() {
        axios.post('http://localhost:8080/signin', {
            username: input.current.value,
            password: password.current.value
        }, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
              }
        }).then(res => {
            console.log(res);
            //GET USERNAME AND TOKEN, USERNAME IN ONE AND TOKEN IN SECOND
            let [user, token] = JSON.stringify(res.data).split("/n")
            localStorage.setItem('user', token.slice(0, -1));
            setMessage("Login succesful!");
            window
                .location
                .replace("http://localhost:3000");
        }).catch(error => {
            console.log(error)
            //setMessage(error.response.data.message);
        })
    }
    let signInButton = useRef(0);
    let underlineSignIn = useRef(0);
    let signUpButton = useRef(0);
    let underlineSignUp = useRef(0);
    let switchButton = useRef(0);
    let underlineSwitch = useRef(0);
    return (
        <div style={style.backgroundLogin}>
            <div style={style.insideLogin}>
                <div
                    style={{
                    display: "grid",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold"
                }}>Welcome back!</div>
                <div>
                    <div style={{
                        fontWeight: "bold"
                    }}>Email</div>
                    <input
                        ref={input}
                        type="email"
                        autoComplete="email"
                        spellCheck="false"
                        autoCapitalize="none"
                        style={{
                        paddingLeft: "2%",
                        paddingRight: "2%",
                        height: "50%",
                        width: "94%",
                        border: "none",
                        margin: "1%",
                        boxShadow: "2px 2px 2px 0px rgb(70, 70, 70), 5px 5px 6px 0px #000000"
                    }}></input>
                </div>
                <div>
                    <div style={{
                        fontWeight: "bold"
                    }}>Password</div>
                    <input
                        ref={password}
                        type="password"
                        autoComplete="current-password"
                        spellCheck="false"
                        autoCapitalize="none"
                        style={{
                        paddingLeft: "2%",
                        paddingRight: "2%",
                        height: "50%",
                        width: "94%",
                        border: "none",
                        margin: "1%",
                        boxShadow: "2px 2px 2px 0px rgb(70, 70, 70), 5px 5px 6px 0px #000000"
                    }}></input>
                </div>
                <div
                    style={{
                    display: "grid",
                    alignItems: "center"
                }}>
                    {signIn
                        ? <div
                                style={style.button}
                                onClick={() => login()}
                                onMouseEnter={() => {
                                underlineSignIn.current.style.transform = "scaleX(1)";
                            }}
                                onMouseLeave={() => {
                                underlineSignIn.current.style.transform = "scaleX(0)";
                            }}>
                                <h2
                                    style={{
                                    flex: '1',
                                    cursor: 'pointer',
                                    transition: "0.5s ease-in-out",
                                    color: "black",
                                    textShadow: "0 0 0 transparent, 0 0 0 transparent",
                                    overflow: "visible",
                                    textAlign: "center",
                                    margin: "0"
                                }}
                                    ref={signInButton}>Sign in</h2>
                                <div
                                    style={{
                                    height: "2px",
                                    position: "relative",
                                    width: "80%",
                                    left: "10%",
                                    background: "black",
                                    transform: "scaleX(0)",
                                    transition: "all 0.3s ease-out"
                                }}
                                    ref={underlineSignIn}></div>
                            </div>
                        : <div
                            style={style.button}
                            onClick={() => signUp()}
                            onMouseEnter={() => {
                            underlineSignUp.current.style.transform = "scaleX(1)";
                        }}
                            onMouseLeave={() => {
                            underlineSignUp.current.style.transform = "scaleX(0)";
                        }}>
                            <h2
                                style={{
                                flex: '1',
                                cursor: 'pointer',
                                transition: "0.5s ease-in-out",
                                color: "black",
                                textShadow: "0 0 0 transparent, 0 0 0 transparent",
                                overflow: "visible",
                                textAlign: "center",
                                margin: "0"
                            }}
                                ref={signUpButton}>Sign up</h2>
                            <div
                                style={{
                                height: "2px",
                                position: "relative",
                                width: "80%",
                                left: "10%",
                                background: "black",
                                transform: "scaleX(0)",
                                transition: "all 0.3s ease-out"
                            }}
                                ref={underlineSignUp}></div>
                        </div>}
                </div>
                <div
                    style={{
                    height: "20px",
                    margin: "2%",
                    textAlign: "center"
                }}>{displayMessage}</div>
                <div
                    style={{
                    margin: "2%",
                    fontWeight: "bold"
                }}>{signIn ? "If you don't have an account sign up here:" : "If you already have an account login here:"}</div>
                <div
                    style={style.button}
                    onClick={() => signIn ? setSignIn(false) : setSignIn(true)}
                    onMouseEnter={() => {
                    underlineSwitch.current.style.transform = "scaleX(1)";
                }}
                    onMouseLeave={() => {
                    underlineSwitch.current.style.transform = "scaleX(0)";
                }}>
                    <h2
                        style={{
                        flex: '1',
                        cursor: 'pointer',
                        transition: "0.5s ease-in-out",
                        color: "black",
                        textShadow: "0 0 0 transparent, 0 0 0 transparent",
                        overflow: "visible",
                        textAlign: "center",
                        margin: "0"
                    }}
                        ref={switchButton}>{signIn ? "Sign up" : "Sign in"}</h2>
                    <div
                        style={{
                        height: "2px",
                        position: "relative",
                        width: "80%",
                        left: "10%",
                        background: "black",
                        transform: "scaleX(0)",
                        transition: "all 0.3s ease-out"
                    }}
                        ref={underlineSwitch}></div>
                </div>
            </div>
        </div>
    )
}
export default Login
import {useEffect, useRef, useState} from 'react'
import axios from 'axios';
import BackgroundAccount from './three_scenes/background_account.js';

let style = {
    container: {
        display: "grid",
        height: "100vh",
        minWidth: "100vw",
        maxWidth: "100vw",
        top: "6.5rem",
        fontWeigth: "bold",
        position: "relative"
    },
    leaderboard: {
        width: "600px",
        height: "600px",
        position: "relative",
        top: "50%",
        left: "50%",
        color: "white",
        overflow: "scroll",
        overflowX: "hidden",
        marginLeft: "-300px",
        background: "black",
        opacity: "0.8",
        marginTop: "-300px",
        boxShadow: "7px 7px 10px 0px rgba(50, 50, 50, 0.75)"
    },
    row: {
        display: "flex",
        width: "100%",
        height: "50px",
        textAlign: "center"
    },
    pages: {
        display: "flex",
        height: "50px",
        textAlign: "center"
    },
}

const Leaderboard = () => {
    const [dataReady,
        setDataReady] = useState(false);
    const arrayData = useRef(0);
    const leaderboard = useRef(0);
    const loading_screen = useRef(false);
    useEffect(() => {
        axios.post('https://xentaserver.herokuapp.com/leaderboard', { // GETS SCORE
            authorization: `Bearer ${localStorage.getItem('user')}`
        }, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('user')}`
            }
        }).then(res => {
            arrayData.current = res
                .data
                .slice(1, -1)
                .split(",");
            addRows();
        }).catch(error => {
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addRows = () => {
        let newArr = [];
        for (let i = 0; i < arrayData.current.length; i += 2) {
            newArr.push([
                arrayData.current[i],
                arrayData.current[i + 1]
            ]);
        }
        sortRow(newArr);
    }
    const sortRow = (newArr) => {
        for (let i = 0; i < newArr.length; i++) {
            for (let j = 0; j < newArr.length - 1; j++) {
                if (parseInt(newArr[j][1]) > parseInt(newArr[j + 1][1])) {
                    let tempElement = newArr[j];
                    newArr.splice(j, 1, newArr[j + 1]);
                    newArr.splice(j + 1, 1, tempElement);
                }
            }
        }
        arrayData.current = newArr;
        setDataReady(true);
    }
    const rowComponents = () => {
        let arrayComponents = [];
        let component = (number, user, score) => {
            return (
                <div style={style.row}>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}>{number}</div>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}
                        onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "inset 200px 0px 0px #2F3B47"
                    }}
                        onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = ""
                    }}>{user}</div>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}
                        onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "inset 200px 0px 0px #2F3B47"
                    }}
                        onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = ""
                    }}>{score}</div>
                </div>
            )
        }
        if (arrayData.current.length > 30) {
            for (let i = 30; i >= 0; i--) {
                arrayComponents.push(component(arrayData.current[i][0], arrayData.current[i][1]));
            }
        } else {
            let num = 0;
            for (let i = arrayData.current.length - 1; i >= 0; i--) {
                arrayComponents.push(component(num += 1, arrayData.current[i][0], arrayData.current[i][1]));
            }
        }
        return arrayComponents;
    }

    /*const browsePages = ()=>{ WILL BE ADDED SOON
        let pages = Math.ceil(arrayData.current.length / 10);
        let arrayComponents = [];
        let component = (pageNumber)=>{
        return(
        <div style={style.pages} onClick={}>
            <div style={{width: "50px", border: "2px solid black", display: "grid", alignItems: "center"}}>{pageNumber}</div>
        </div>)
        }
        for(let i = 0; i < pages; i++){
            arrayComponents.push(component(i));
        }
        return arrayComponents;
    }*/
        //TRACK MOUSE MOVEMENT AND ROTATE FORM AND SHIELD


    return (
        <div style={style.container}>
            <BackgroundAccount loading_screen = {loading_screen} />
            <div ref={leaderboard} style={style.leaderboard}>
                <div style={style.row}>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}>Nº</div>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}
                        onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "inset 200px 0px 0px #2F3B47"
                    }}
                        onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = ""
                    }}>User name</div>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}
                        onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "inset 200px 0px 0px #2F3B47"
                    }}
                        onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = ""
                    }}>Score</div>
                </div>
                <div>
                    {dataReady
                        ? rowComponents()
                        : ""}
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;
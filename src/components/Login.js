import React, { useState, useEffect } from "react"
import facade from "./apiFacade";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import AddUser from "./AddUser";


function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
  }

  return (
    <div>

      <Container>
        <Row>
          <Col>
          </Col>
          <Col>
            <h2 className="ca3White">Login</h2>
            <Form onChange={onChange} className="mt-4">
              <Form.Group controlId="username">
                <Form.Label className="ca3White">Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label className="ca3White">Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" />
              </Form.Group>
              <Button onClick={performLogin} variant="primary" type="submit">
                Login
                </Button>
            </Form>
          </Col>
          <Col>
          </Col>
        </Row>
      </Container>
    </div>
  )

}

function LoggedIn() {

  function parseJwt(token) {
    let tokenDecoded = JSON.parse(atob(token.split('.')[1]));
    return tokenDecoded.roles.split(',')[0];
  }

  const [dataFromServer, setDataFromServer] = useState("Loading...")
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let role = parseJwt(facade.getToken());
    facade.fetchData(role).then(data => setDataFromServer(data.msg))
      .catch((error) => {
        error.fullError.then((err) => {
          setErrorMessage(err.message);
          console.log("error: ", err);
        })
      }
      )
  }, [])

  return (
    <div>
      <h2  className="display-4 text-muted">Data Received from server</h2>
      <h3 className="ca3White">{dataFromServer}</h3>
      <p className="mt-4 text-danger">{errorMessage}</p>
    </div>
  )

}

function Login({ setLoginStatus, isLoggedIn, setAdminStatus }) {

  let header = document.getElementById("header");

  const parseJwt = (token) => {
    let tokenDecoded = JSON.parse(atob(token.split('.')[1]));
    return tokenDecoded.roles.split(',')[0];
  }

  function parseJwtName(name) {
    let tokenName = JSON.parse(atob(name.split('.')[1]));
    return tokenName.username;
  }

  const [errorMessage, setErrorMessage] = useState('')

  const logout = () => {
    facade.logout()
    setLoginStatus(false)
    setAdminStatus(false)
    header.classList.remove("adminStyle")
  }
  const login = (user, pass) => {
    facade.login(user, pass)
      .then((res) => {
        setErrorMessage('')
        let name = parseJwtName(facade.getToken());
        setLoginStatus(true, name)

        if (parseJwt(facade.getToken()) === "admin") {
          setAdminStatus(true)
          header.classList.add("adminStyle");
        }

      }).catch((error) => {
        error.fullError.then((err) => {
          setErrorMessage(err.message)
          console.log("error: ", err)
        })
      });
  };

  console.log("logIn: " + isLoggedIn);

  return (
    <div className="pageContent">
      {!isLoggedIn ? (
        <>
          <LogIn login={login} />
          <p className="mt-4 text-danger">{errorMessage}</p>
          <br />
          <AddUser />
        </>
      ) :
        (<div>
          <LoggedIn />
          <button onClick={logout} className="btn btn-secondary">Logout</button>
        </div>)}

    </div>
  )

}

export default Login;


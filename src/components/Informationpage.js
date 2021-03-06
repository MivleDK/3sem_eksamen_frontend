import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, Container, Row, Col } from "react-bootstrap";
import rocketlaunchlogo from "../assets/rocketlaunch_logo_orange_dark_1500.png";
import { useLocation, useHistory } from "react-router-dom";
import { URL } from "../settings";
import Countdown from "./Countdown";
import Comments from "./Comments";

function InformationPage({ isLoggedIn, isAdmin }) {
  const [nextlaunch, setNextlaunch] = useState({});
  const [launchprovider, setLaunchprovider] = useState({});
  let location = useLocation();
  let history = useHistory();
  let index =
    location.launchProp !== undefined
      ? location.launchProp.index
      : history.push("/");
  
  const fetchNextlaunch = () => {
    fetch(`${URL}/api/nextlaunch/upcoming`)
      .then((res) => res.json())
      .then((data) => {
        setNextlaunch(data);
  
        let i = index !== undefined ? index : 0;

        fetch(data.results[i].launch_service_provider.url)
          .then((result) => result.json())
          .then((data2) => {
            setLaunchprovider(data2);
            });
      });
  };

  useEffect(() => {
    fetchNextlaunch();
  }, []);

  const dateBuilder = (timestamp) => {
    let d = new Date(timestamp);
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
  };

  const timeBuilder = (timestamp) => {
    let d = new Date(timestamp);

    let hours = (d.getHours() < 10 ? "0" : "") + d.getHours();
    let minutes = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    let seconds = (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      {typeof nextlaunch.results != "undefined" ? (
        <div>
          <div>
            <img src={rocketlaunchlogo} className="imgLogo" alt="" />
            <br />
            <div className="ca3LaunchBig ca3White">Launch information</div>
            <div className="ca3CDBig">
              <Countdown date={nextlaunch.results[index].net} />
            </div>
            <div className="ca3LaunchinfoBig ca3White">
              {nextlaunch.results[index].launch_service_provider.name}
            </div>
            <div className="ca3LaunchinfoBig ca3White">
              {nextlaunch.results[index].pad.location.name}
            </div>
            <div className="ca3LaunchinfoBig ca3White">
              {nextlaunch.results[index].pad.location.country_code}
            </div>

            <div>
              <Navbar variant="dark">
                <Nav className="ca3NavbarBig m-auto">
                  <NavLink
                    className="nav-link ca3NavbarBig ca3Orange"
                    exact
                    activeClassName="selected"
                    href="/"
                    to="/"
                  >
                    Home
                  </NavLink>
                  <NavLink
                    className="nav-link ca3NavbarBig ca3Orange"
                    activeClassName="selected"
                    to={{
                      pathname: "/information",
                      launchProp: { index: index }
                    }}
                  >
                    Information
                  </NavLink>
                  <NavLink
                    className="nav-link ca3NavbarBig ca3Orange"
                    activeClassName="selected"
                    to={{
                      pathname: "/location",
                      launchProp: {
                        index: index,
                        lat: nextlaunch.results[index].pad.latitude,
                        lon: nextlaunch.results[index].pad.longitude
                      }
                    }}
                  >
                    Location
                  </NavLink>
                  <NavLink
                    className="nav-link ca3NavbarBig ca3Orange"
                    activeClassName="selected"
                    to={{
                      pathname: "/weather",
                      launchProp: {
                        index: index,
                        lat: nextlaunch.results[index].pad.latitude,
                        lon: nextlaunch.results[index].pad.longitude
                      }
                    }}
                  >
                    Weather
                  </NavLink>
                </Nav>
              </Navbar>
            </div>
          </div>
          <div>
            <Container>
              <Row>
                <Col sm={4}>
                  <div className="ca3P">&nbsp;</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">&nbsp;</div>
                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <div className="ca3h1 ca3Orange">Date:</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">
                    {dateBuilder(nextlaunch.results[index].net)}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <div className="ca3h1 ca3Orange">Estimated Launch:</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">
                    {timeBuilder(nextlaunch.results[index].net)}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <div className="ca3h1 ca3Orange">Location:</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">
                    {nextlaunch.results[index].pad.location.name}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <div className="ca3h1 ca3Orange">Status:</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">
                    {nextlaunch.results[index].status.name}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <br />
                  <img src={launchprovider.logo_url} className="img"></img>
                  <br />
                  <br />
                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <div className="ca3h1 ca3Orange">Launch Provider:</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">
                    {nextlaunch.results[index].launch_service_provider.name}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <div className="ca3h1 ca3Orange">Provider Type:</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">
                    {nextlaunch.results[index].launch_service_provider.type}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <div className="ca3P">&nbsp;</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">&nbsp;</div>
                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <div className="ca3h1 ca3Orange">Mission Name:</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">
                    {nextlaunch.results[index].mission !== null
                      ? nextlaunch.results[index].mission.name
                      : "Not available"}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <div className="ca3h1 ca3Orange">Mission Type:</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">
                    {nextlaunch.results[index].mission !== null
                      ? nextlaunch.results[index].mission.type
                      : "Not available"}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <div className="ca3h1 ca3Orange">Mission Details:</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">
                    {nextlaunch.results[index].mission !== null
                      ? nextlaunch.results[index].mission.description
                      : "Not available"}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <div className="ca3P">&nbsp;</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">&nbsp;</div>
                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <div className="ca3h1 ca3Orange">Rocket:</div>
                </Col>
                <Col sm={8}>
                  <div className="ca3P ca3White">
                    {nextlaunch.results[index].rocket.configuration.full_name}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <br />
                  <img
                    src={nextlaunch.results[index].image}
                    className="imgRocket"
                  ></img>
                  <br />
                  <br />
                </Col>
              </Row>
            </Container>
            <Container>
              <Comments
                rocketID={nextlaunch.results[index].id}
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
              />
            </Container>
          </div>
        </div>
      ) : ("")}
    </div>
  );
}

export default InformationPage;

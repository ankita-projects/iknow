import React, { useState, useEffect } from "react";
import axios from "axios";
import BeachTempratureCard from "./BeachTempratureCard";
import CityWeatherCard from "./CityWeatherCard";
import { Container, Row } from "react-bootstrap";
import Search from "../Search";
import logo from "./images/bicker.svg";
let masterListOfBeaches;
const Beaches = () => {
  const [beaches, setBeaches] = useState([]);
  const [cities, setCities] = useState([]);
  function searchBeach(event) {
    if (event.target.value != "") {
      setBeaches(
        masterListOfBeaches.filter((x) =>
          x.beachName.toLocaleLowerCase().startsWith(event.target.value)
        )
      );
    } else {
      setBeaches(masterListOfBeaches);
    }
  }
  const fetchData = async () => {
    const beachesResponse = await axios(
      "http://localhost:8080/beachTemp"
    );
    const citiesResponse = await axios(
      "https://iknow-backend.herokuapp.com/weather/"
    );
    console.log(citiesResponse.data);
    masterListOfBeaches = beachesResponse.data;
    setBeaches(beachesResponse.data);
    setCities(citiesResponse.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const renderedResult = (
    <div className="beachContainer">
      <Row className="cityWeatherCards">
        <img src={logo} />
        {cities.map((cityWeather) => (
          <CityWeatherCard key={cityWeather.id} cityWeather={cityWeather} />
        ))}
      </Row>
      <Row className="searchBar">
        <Search search={searchBeach} />
      </Row>
      <Row>
        {beaches.map((beachTemp) => (
          <BeachTempratureCard key={beachTemp.id} beachTemprature={beachTemp} />
        ))}
      </Row>
    </div>
  );
  return renderedResult;
};

export default Beaches;

import React, { Component } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./searchbox.css";

export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      city: "",
    };

    this.autoCompleteCity = this.autoCompleteCity.bind(this);
  }

  // onChange Function
  autoCompleteCity(city) {
    this.setState({ city: city });
    const autocompleteURL =
      "https://autocomplete.search.hereapi.com/v1/autocomplete?";

    if (city !== "") {
      // Calling the autocomplete API with max 4 results, looking for cities and using the API Key
      var query = `q=${city}&limit=4&types=city&apiKey=${process.env.REACT_APP_HEREAPI}`;
      fetch(`${autocompleteURL}${query}`)
        .then((res) => res.json())
        .then((result) => {
          // Here are the 0 - 6 results from the API given any input

          const set = result?.items?.map((item) => item.address.city);
          const uniqueCities = [...new Set(set)];

          var filterdCities = uniqueCities.filter(function (x) {
            return x !== undefined;
          });
          let newitems = [];
          var count = 0;
          filterdCities.forEach((city) => {
            newitems.push({ id: count, name: city });
            count += 1;
          });

          this.setState({ items: newitems });
          console.log(this.state.items);
        });
    }
  }

  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.props.setCity(this.state.city);
    }
  };

  render() {
    var currentCity = this.props.city;
    return (
      <>
        <div className="search-box" onKeyDown={this._handleKeyDown}>
          <header className="box-header">
            <ReactSearchAutocomplete
              items={this.state.items}
              onSearch={(record) => this.autoCompleteCity(record)}
              onSelect={(city) => this.props.setCity(city.name)}
              autoFocus
              styling={{
                borderRadius: "12px",
              }}
              placeholder="Search for a city"
            />
          </header>
        </div>
      </>
    );
  }
}

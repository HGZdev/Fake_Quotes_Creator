import React from 'react';
import ReactDOM from 'react-dom';
import PrintTemplate from 'react-print';

import {topics} from "./modules/topics.js";
import {quotes} from "./modules/quotes.js";
import {authors} from "./modules/authors.js";
import {themes} from "./modules/themes.js";

class FakeQuotesCreator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // Lists of values
      topicsList: this.props.topics,
      quotesList: this.props.quotes,
      authorsList: this.props.authors,
      themesList: this.props.themes,

      // Form settings
      topicsSelected: 0,
      quotesSelected: 0,
      authorsSelected: 0,
      themesSelected: 0,

      // Display settings
      quotesDisplay: "[Wybierz cytat...]",
      authorsDisplay: "[Wybierz autora...]",
      themesDisplay: {
        name: "",
        color: "black",
        backgroundColor: "white"
      }
    }
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleRandomClick = this.handleRandomClick.bind(this);
  }

  render() {
    return (
      <div>
        <section className="dashboard" id="react-no-print">
          <div className="container">
            <div className="row outer">

              <Header className="col-12 title" title={this.props.title} size="h1"/>
              <Header className="col-12 subtitle" title={this.props.subtitle} size="h2"/>

              <form className="col-12" action="index.html" method="post" onSubmit={this.state.handleSubmit}>
                <div className="row inner">
                  <Select className="topics" label="Kategoria:" value={this.state.topicsSelected} list={this.state.topicsList} onChange={this.handleSelectChange}/>
                  <Select className="quotes" label="Cytaty:" value={this.state.quotesSelected} list={this.state.quotesList} onChange={this.handleSelectChange}/>
                  <Select className="authors" label="Autorzy:" value={this.state.authorsSelected} list={this.state.authorsList} onChange={this.handleSelectChange}/>
                  <Select className="themes" label="Szablony:" value={this.state.themesSelected} list={this.state.themesList} onChange={this.handleSelectChange}/>
                  <RandomBtn className="randomBtn" onClick={this.handleRandomClick}/>
                </div>
              </form>

            </div>
          </div>
        </section>
        <Board quotesDisplay={this.state.quotesDisplay} authorsDisplay={this.state.authorsDisplay} themesDisplay={this.state.themesDisplay}/>
      </div>
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  handleSelectChange = (event) => {
    let value = event.target.value;
    let className = event.target.className;
    let newState = {};
    let quotesListNew;

    // Quotes filtered by topics
    if (className === "topics") {
      if (value === "0") {
        quotesListNew = this.props.quotes;
      } else {
        quotesListNew = [this.props.quotes[0]];
        for (var i = 0; i < this.props.quotes.length; i++) {
          if (this.props.quotes[i].t === this.state.topicsList[value]) {
            quotesListNew.push(this.props.quotes[i]);
          }
        }
      }
      newState = {
        quotesSelected: 0,
        quotesList: quotesListNew,
        topicsSelected: value,
        topicsDisplay: this.state.topicsList[value]
      }
    } else {
      newState = {
        [className + "Selected"]: value,
        [className + "Display"]: this.state[className + "List"][value].q || this.state[className + "List"][value]
      }
    }
    // console.log(value, className, setState);
    this.setState(newState);
  }

  handleRandomClick = (event) => {
    let className = ["quotes", "authors", "themes"];
    let newState = {};
    let max,
      random;

    for (var i = 0; i < className.length; i++) {
      max = this.state[className[i] + "List"].length - 1;
      random = Math.floor(Math.random() * max + 1);

      newState["topicsSelected"] = 0;
      newState["quotesList"] = this.props.quotes;
      newState[className[i] + "Selected"] = random;

      (className[i] === "quotes")
        ? newState["quotesDisplay"] = this.state.quotesList[random].q
        : newState[
          [className[i] + "Display"]
        ] = this.state[className[i] + "List"][random];
    }
    // console.log(newState);
    this.setState(newState);
  }
}

class Select extends React.Component {
  render() {
    let list = this.props.list.map((el, idx) => {
      if (this.props.className == "quotes") {
        return <option key={idx} value={idx}>{el.q}</option>
      } else if (this.props.className == "themes") {
        return <option key={idx} value={idx}>{el.name}</option>
      } else {
        return <option key={idx} value={idx}>{el}</option>
      }
    });

    return (
      <div className="col-2">
        <span>{this.props.label}</span>
        <select className={this.props.className} name={this.props.className} value={this.props.value} onChange={this.props.onChange}>
          {list}
        </select>
      </div>
    );
  }
}

class Board extends React.Component {
  render() {
    return (
      <section className="board">
        <div className="container">
          <div className="row outer" style={this.props.themesDisplay}>
            <div className="col-12 quote">
              <p>
                <span>"</span>
                {this.props.quotesDisplay}
                <span>"</span>
              </p>
            </div>
            <div className="col-12 author">
              <h3>{this.props.authorsDisplay}</h3>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

class RandomBtn extends React.Component {
  render() {
    return (
      <div className="col-2">
        <span>Losowy cytat:</span>
        <button type="button" name="button" className={this.props.className} onClick={this.props.onClick}>Losuj
        </button>
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <this.props.size>{this.props.title}</this.props.size>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', function () {

  const title = "Kreator Zmyślonych Cytatów";
  const subtitle = "Przypisywanie dowolnych słów wielkim osobistościom jeszcze nigdy nie było tak proste!";

  ReactDOM.render(
    <FakeQuotesCreator title={title} subtitle={subtitle} topics={topics} quotes={quotes} authors={authors} themes={themes}/>, document.getElementById('app'));
});

import React from 'react';
import ReactDOM from 'react-dom';

class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      today: this.props.today,
      currentFirstDay: this.props.today.clone().startOf('M'),
      DaysNames: this.setDaysNames(),
      daysArray: "",
      selectedArray: []
    }
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleArrowClick = this.handleArrowClick.bind(this);
  }

  componentWillMount() {
    let newState = {
      daysArray: this.setDays(this.props.today.clone().startOf('M'))
    }
    return this.setState(newState);
  }

  render() {
    return (
      <div>
        <Header/>
        <Navbar currentFirstDay={this.state.currentFirstDay.format('MMMM YYYY')} onClick={this.handleArrowClick}/>
        <DaysNames DaysNames={this.state.DaysNames}/>
        <MainPanel daysArray={this.state.daysArray} onClick={this.handleDayClick}/>
        <DatesSelected selectedArray={this.state.selectedArray.join(", ")}/>
      </div>
    )
  }

  setDaysNames() {
    let firstDay = this.props.today.clone().startOf('w').add(-1, 'd');
    let daysNames = [];
    for (var i = 0; i < 7; i++) {
      daysNames.push(firstDay.clone().add(i + 1, 'd').format('ddd'))
    }
    let daysNamesMap = daysNames.map((el, i) => {
      return <div key={i} className="col-1">{el}</div>
    })
    return daysNamesMap;
  }

  setDays(currentFirstDay) {
    let currentDay = currentFirstDay.clone().startOf('w');

    let startOfMonthWeek = (currentFirstDay.clone().week() === 52 || currentFirstDay.clone().week() === 53)
      ? 0
      : currentFirstDay.clone().week();
    let endOfMonthWeek = (currentFirstDay.clone().endOf('M').week() === 1)
      ? 53
      : currentFirstDay.clone().endOf('M').week();

    let daysArray = [];
    for (var i = 0; i < (endOfMonthWeek - startOfMonthWeek + 1); i++) {
      for (var j = 0; j < 7; j++) {
        let isToday = (currentDay.format('L') == this.props.today.clone().format('L'))
          ? "today"
          : "";
        let isother_month = (currentDay.month() !== currentFirstDay.month())
          ? "other_month"
          : "";
        let isSelected = (this.state.selectedArray.indexOf(currentDay.format('L')) > -1)
          ? "selected"
          : "";

        let featuresArray = {
          date: currentDay.clone(),
          isToday: isToday,
          isSelected: isSelected,
          isother_month: isother_month
        };
        daysArray.push(featuresArray);
        currentDay = currentDay.add(1, 'd');
      }
    }

    return daysArray;
  }

  handleDayClick = (e) => {
    console.log('Clicked day!');
    let daysArrayCopy = this.state.daysArray;
    let selectedArrayCopy = this.state.selectedArray;

    for (var i = 0; i < daysArrayCopy.length; i++) {
      if (daysArrayCopy[i].date.format('L') === e.target.id) {
        // console.log(daysArrayCopy[i].date.format('L'));
        if (e.target.classList.contains('selected')) {
          daysArrayCopy[i].isSelected = "";
          var index = selectedArrayCopy.indexOf(e.target.id);
          selectedArrayCopy.splice(index, 1);
        } else {
          daysArrayCopy[i].isSelected = "selected";
          selectedArrayCopy.push(e.target.id);
        }
      }
    }
    selectedArrayCopy.sort();
    let newState = {
      daysArray: daysArrayCopy,
      selectedArray: selectedArrayCopy
    }
    return this.setState(newState);
  }

  handleArrowClick = (e) => {
    console.log('Clicked arrow!');
    let newDate = this.state.currentFirstDay.clone().add(e.target.dataset.step, "M");
    let newState = {
      currentFirstDay: newDate,
      daysArray: this.setDays(newDate)
    }
    return this.setState(newState);
  }
}

class SevenDays extends React.Component {
  render() {
    let daysArray = this.props.daysArray;
    let sevenDaysMap = daysArray.map((el, i) => {
      if (el.date.week() === this.props.week_number) {
        return <div key={el.date.format('L')} id={el.date.format('L')} className={"col-1 day " + el.isToday + " " + el.isother_month + " " + el.isSelected} onClick={this.props.onClick}>{el.date.date()}</div>;
      }
    }).filter((el) => {
      return el
    });
    return (
      <div key={this.props.week_number} className="week flex">
        <div className="col-1 week_number">{this.props.week_number}</div>
        {sevenDaysMap}
      </div>
    );
  }
}

class Week extends React.Component {
  render() {
    return <SevenDays week_number={this.props.week_number} daysArray={this.props.daysArray} onClick={this.props.onClick}/>
  }
}

class MainPanel extends React.Component {
  render() {
    let daysArray = this.props.daysArray;
    let weeksNumbers = [];

    for (var i = 0; i < daysArray.length / 7; i++) {
      weeksNumbers.push(daysArray[i * 7].date.week());
    }

    let weeksMap = weeksNumbers.map((el, i) => {
      return <Week key={el} week_number={el} daysArray={this.props.daysArray} onClick={this.props.onClick}/>;
    })
    return (
      <section className="main_panel">
        <div className="container">
          {weeksMap}
        </div>
      </section>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <header>
        <div className="container flex">
          <div className="col-8">
            <h1>React Calendar</h1>
          </div>
        </div>
      </header>
    );
  }
}

class Navbar extends React.Component {
  render() {
    return (
      <section className="navbar">
        <div className="container flex">
          <div className="col-1 prev" data-step="-1" onClick={this.props.onClick}>&laquo;</div>
          <div className="col-6 month_name">{this.props.currentFirstDay}</div>
          <div className="col-1 next" data-step="1" onClick={this.props.onClick}>&raquo;</div>
        </div>
      </section>
    );
  }
}

class DaysNames extends React.Component {
  render() {
    return (
      <section className="days_names">
        <div className="container flex">
          <div className="col-1"></div>
          {this.props.DaysNames}
        </div>
      </section>
    );
  }
}

class DatesSelected extends React.Component {
  render() {
    return (
      <section className="dates_selected">
        <div className="container flex">
          <div className="col-8 title">
            Wybrane daty:
          </div>
          <div className="col-8 board">
            {this.props.selectedArray}
          </div>
        </div>
      </section>
    );
  }
}

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    <Calendar today={moment().locale('pl')}/>, document.getElementById('app'));
});

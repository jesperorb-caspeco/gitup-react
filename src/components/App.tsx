import * as React from "react";
import { Format } from "../services/formatService";
import "./App.css";

interface IAppState {
  eventData: any,
  totalAdditions: number;
  totalDeletions: number;
}

class App extends React.Component<{}, IAppState> {

  constructor(props: {}){
    super(props);
    this.state = {
      eventData: "",
      totalAdditions: 0,
      totalDeletions: 0
    }
  }

  public componentDidMount(){
    window.addEventListener("message", ({ data }) => {
      const { totalAdditions, totalDeletions } = Format.statResult(data);
      this.setState({ eventData: data, totalAdditions, totalDeletions })
    });
  }

  public render() {
    const { totalAdditions, totalDeletions } = this.state;
    return (
      <div>
        <h2>Stats for last week</h2>
        <h3>Additions</h3>
        <p>{totalAdditions}</p>
        <h3>Deletions</h3>
        <p>{totalDeletions}</p>
      </div>
    );
  }
}

export default App;

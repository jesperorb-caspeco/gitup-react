import * as React from "react";
import { Cell, Pie, PieChart } from "recharts";
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
      <div className="app">
        <h2>Stats for the last seven days</h2>
        <PieChart width={200} height={300}>
          <Pie
            data={[
              { name: "additions", amt: totalAdditions },
              { name: "deletions", amt: totalDeletions }
            ]}
            dataKey="amt"
            label={true}
            outerRadius={80} 
          >
            <Cell fill={"#ff8042"}/>
            <Cell fill={"#00c49f"}/>
          </Pie>
        </PieChart>
      </div>
    );
  }
}

export default App;

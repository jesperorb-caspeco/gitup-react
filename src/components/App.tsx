import * as React from "react";
import { Cell, Pie, PieChart  } from "recharts";
import { Format } from "../services/formatService";
import "./App.css";

interface IAppState {
  devTotalStats: any;
  devUserStats: any;
  totalStats: any;
  userStats: any;
  error: any;
}
interface IGitData {
  devTotalStats: string;
  devUserStats: string;
  totalStats: string;
  userStats: string;
}

class App extends React.Component<{}, IAppState> {

  constructor(props: {}){
    super(props);
    this.state = {
      devTotalStats: {
        totalAdditions: 0,
        totalDeletions: 0
      },
      devUserStats: {
        totalAdditions: 0,
        totalDeletions: 0
      },
      error: "",
      totalStats: {
        totalAdditions: 0,
        totalDeletions: 0
      },
      userStats: {
        totalAdditions: 0,
        totalDeletions: 0
      },
    }
  }

  public componentDidMount(){
    window.addEventListener("message", ({ data }) => {
      try {
        const parsed: IGitData = JSON.parse(data);
        const userStats = Format.stats(parsed.userStats)
        const totalStats = Format.stats(parsed.totalStats);
        const devTotalStats = Format.stats(parsed.devTotalStats)
        const devUserStats = Format.stats(parsed.devUserStats)
        this.setState({ userStats, totalStats, devTotalStats, devUserStats });
      } catch(error) {
        this.setState({ error: error.message });
      }
    });
  }

  public render() {
    const { userStats, totalStats, devTotalStats, devUserStats } = this.state;
    return (
      <div className="app">
        <h1>Additions/deletions for all branches</h1>
        <div className="pie-container" >
          <div className="pie-container__pie">
            <PieChart width={300} height={300}>
              <Pie
                data={[
                  { name: "additions", amt: userStats.totalAdditions },
                  { name: "deletions", amt: userStats.totalDeletions }
                ]}
                dataKey="amt"
                label={true}
                outerRadius={80} 
              >
                <Cell fill={"#ff8042"}/>
                <Cell fill={"#00c49f"}/>
              </Pie>
            </PieChart>
            <h2>You</h2>
          </div>
          <div className="pie-container__pie">
            <PieChart width={300} height={300}>
              <Pie
                data={[
                  { name: "additions", amt: totalStats.totalAdditions },
                  { name: "deletions", amt: totalStats.totalDeletions }
                ]}
                dataKey="amt"
                label={true}
                outerRadius={80}
              >
                <Cell fill={"#ff8042"}/>
                <Cell fill={"#00c49f"}/>
              </Pie>
            </PieChart>
            <h2>All contributors</h2>
          </div>
        </div>
        <h1>Additions/deletions for branch dev</h1>
        <div className="pie-container" >
          <div className="pie-container__pie">
            <PieChart width={300} height={300}>
              <Pie
                data={[
                  { name: "additions", amt: devUserStats.totalAdditions },
                  { name: "deletions", amt: devUserStats.totalDeletions }
                ]}
                dataKey="amt"
                label={true}
                outerRadius={80} 
              >
                <Cell fill={"#ff8042"}/>
                <Cell fill={"#00c49f"}/>
              </Pie>
            </PieChart>
            <h2>You</h2>
          </div>
          <div className="pie-container__pie">
            <PieChart width={300} height={300}>
              <Pie
                data={[
                  { name: "additions", amt: devTotalStats.totalAdditions },
                  { name: "deletions", amt: devTotalStats.totalDeletions }
                ]}
                dataKey="amt"
                label={true}
                outerRadius={80}
              >
                <Cell fill={"#ff8042"}/>
                <Cell fill={"#00c49f"}/>
              </Pie>
            </PieChart>
            <h2>All contributors</h2>
          </div>
        </div>
        {
          this.state.error && <p style={{ color: "crimson", fontWeight: "bold" }}>this.state.error</p>
        }
      </div>
    );
  }
}

export default App;

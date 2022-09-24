import React from "react";
import './flip.css';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: "",
            nader: "nader"
        };
        this.coinToss = this.coinToss.bind(this);
    }
    coinToss() {
        // const [play] = useSound(coin);

        this.setState({ nader: "" }, () => {
            this.props.play()
            if (Math.random() < 0.5) {
                this.setState({ result: "heads" });
                setTimeout(() => {
                    this.props.stop()
                    this.props.handle(2);
                }, 2100);
                console.log("AI");
            } else {
                this.setState({ result: "tails" });
                setTimeout(() => {
                    this.props.stop()
                    this.props.handle(1);
                }, 2100);

                console.log("you");
            }
        });
    }

    render() {
        return (
            <div className="App">
                <div id="coin" className={this.state.result} onClick={this.coinToss}>
                    <div className="side-a">
                        <h2>You</h2>
                    </div>
                    <div className="side-b">
                        <h2>AI</h2>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;

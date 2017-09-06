/*
Wrapper for the whole App
    main navigation
    Web3 & contracts initialisation
    Listeners and handlers to web3 events

TODO: consider moving connection, event listeners etc to separate modul (like exchangeProvider)
*/

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "semantic-ui-css/semantic.min.css";

import React from "react";
import { connect } from "react-redux";
import store from "modules/store";
import { setupWeb3 } from "modules/reducers/web3Connect";
import { Container, Menu, Segment } from "semantic-ui-react";
import { Route, NavLink, Link, Switch, withRouter } from "react-router-dom";
import Home from "containers/home";
import AccountHome from "containers/account";
import ExchangeHome from "containers/exchange";
import LoanMain from "containers/loan";
import TokenUcd from "containers/tokenUcd";
import About from "containers/about";
import UnderTheHood from "containers/underthehood";
import { PageNotFound } from "containers/PageNotFound";
import { EthereumState } from "./EthereumState";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        window.addEventListener("load", this.onLoad);
    }

    onLoad() {
        console.debug("App.onLoad() -  Dispatching setupWeb3()");
        store.dispatch(setupWeb3()); // we do it on load event to avoid timing issues with injected web3
    }

    render() {
        return (
            <div>
                <Segment inverted>
                    <Menu inverted pointing secondary stackable size="large">
                        <Container>
                            <Menu.Item
                                active={this.props.location.pathname === "/"}
                                as={Link}
                                to="/"
                            >
                                Home
                            </Menu.Item>
                            <Menu.Item as={NavLink} to="/account">
                                My Account
                            </Menu.Item>
                            <Menu.Item as={NavLink} to="/exchange">
                                Buy/Sell UCD
                            </Menu.Item>
                            <Menu.Item as={NavLink} to="/loan/new">
                                Get UCD Loan
                            </Menu.Item>
                            <Menu.Item as={NavLink} to="/tokenUcd">
                                TokenUcd
                            </Menu.Item>
                            <Menu.Menu position="right">
                                <Menu.Item as={NavLink} to="/about-us">
                                    About
                                </Menu.Item>
                                <Menu.Item as={NavLink} to="/under-the-hood">
                                    Under the hood
                                </Menu.Item>
                                <Menu.Item as="p">
                                    <small>on {this.props.network.name}</small>
                                </Menu.Item>
                            </Menu.Menu>
                        </Container>
                    </Menu>
                </Segment>

                <Segment basic>
                    <EthereumState />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/account" component={AccountHome} />
                        <Route
                            exact
                            path="/exchange"
                            component={ExchangeHome}
                        />
                        <Route exact path="/tokenUcd" component={TokenUcd} />
                        <Route path="/loan" component={LoanMain} />
                        <Route exact path="/about-us" component={About} />
                        <Route
                            exact
                            path="/under-the-hood"
                            component={UnderTheHood}
                        />
                        <Route component={PageNotFound} />
                    </Switch>
                </Segment>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    network: state.web3Connect.network,
    userAccount: state.web3Connect.userAccount,
    loanManager: state.loanManager.contract,
    tokenUcd: state.tokenUcd.contract,
    rates: state.rates.contract
});

export default (App = withRouter(connect(mapStateToProps)(App)));

/*  TODO: add syncing
    TODO: add if pendng transation is there and display confirmation count
*/
import React from "react";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { ErrorPanel, WarningPanel, LoadingPanel } from "components/MsgPanels";
import ErrorDetails from "components/ErrorDetails";
import { Tsegment } from "components/TextContent";
import { GitterButton } from "components/LinkButtons";

export class EthereumState extends React.Component {
    render() {
        let msg = null;
        const {
            web3Connect,
            loanManager,
            rates,
            tokenUcd,
            exchange,
            children = null
        } = this.props;
        const {
            isConnected,
            isLoading,
            network,
            error
        } = this.props.web3Connect;
        if (isLoading || document.readyState !== "complete") {
            msg = <LoadingPanel header="Connecting to Ethereum network..." />;
        } else if (!isConnected && !isLoading) {
            msg = (
                <WarningPanel header="Can't connect Ethereum network">
                    <p>
                        Please check our{" "}
                        <Link to="/tryit">connection guide</Link> about how to
                        connect to Ethereum network.
                    </p>

                    {web3Connect.error && (
                        <ErrorDetails header="Connection error details:">
                            {error.message}
                        </ErrorDetails>
                    )}
                </WarningPanel>
            );
        } else if (
            isConnected &&
            network.id !== 999 &&
            network.id !== 4 &&
            network.id !== 3 &&
            network.id !== 1976 &&
            network.id !== 4447
        ) {
            msg = (
                <div>
                    <WarningPanel header="Connected but not on Rinkeby" />
                    <p>Augmint only works on Rinkeby test network currently</p>
                    <p>
                        Your browser seems to be connected to{" "}
                        {web3Connect.network.name} network. (id:{" "}
                        {web3Connect.network.id}).
                    </p>

                    <p>Make sure you are connected to Rinkeby </p>
                    <GitterButton />
                    <p>
                        If you feel geeky you can{" "}
                        <Link
                            to="https://github.com/DecentLabs/dcm-poc/blob/master/docs/developmentEnvironment.md"
                            target="_blank"
                        >
                            install it locally
                        </Link>.
                    </p>
                </div>
            );
        } else if (
            loanManager.connectionError ||
            rates.connectionError ||
            tokenUcd.connectionError ||
            (exchange && rates.connectionError)
        ) {
            msg = (
                <ErrorPanel
                    header={<h3>Can't connect to Augmint contracts</h3>}
                >
                    <p>
                        You seem to be connected to {network.name} but can't
                        connect to Augmint contracts.
                    </p>
                    {(network.id === 4 || network.id === 3) && (
                        <p>
                            It's an issue with our deployement, because you are
                            on {network.name} and Augmint contracts should be
                            deployed.
                        </p>
                    )}
                    {network.id !== 4 &&
                        network.id !== 3 && (
                            <div>
                                <p>Do you have all the contracts deployed?</p>
                                <pre>
                                    {"truffle migrate --reset" +
                                        "\ncp ./build/contracts/* ./src/contractsBuild"}
                                </pre>
                                <p>
                                    See more on our{" "}
                                    <Link
                                        to="https://github.com/DecentLabs/dcm-poc/blob/master/docs/developmentEnvironment.md"
                                        target="_blank"
                                    >
                                        Github page
                                    </Link>
                                </p>
                            </div>
                        )}
                    <p>Error(s):</p>
                    <ErrorDetails>
                        {loanManager.connectionError
                            ? loanManager.connectionError.message + "\n"
                            : ""}
                        {rates.connectionError
                            ? rates.connectionError.message + "\n"
                            : ""}
                        {tokenUcd.connectionError
                            ? tokenUcd.connectionError.message + "\n"
                            : ""}
                        {exchange.connectionError
                            ? exchange.connectionError.message
                            : ""}
                    </ErrorDetails>
                </ErrorPanel>
            );
        }

        if (msg) {
            msg = (
                <Tsegment>
                    <Container text>{msg}</Container>
                </Tsegment>
            );
        } else {
            msg = children;
        }
        return msg;
    }
}

const mapStateToProps = state => ({
    web3Connect: state.web3Connect,
    loanManager: state.loanManager,
    rates: state.rates,
    tokenUcd: state.tokenUcd,
    exchange: state.exchange
});

export default (EthereumState = connect(mapStateToProps)(EthereumState));

import React from "react";
import store from "modules/store";
import { Pblock } from "components/PageLayout";
import { ContractBaseInfo } from "./ContractBaseInfo";
import { refreshTokenUcd } from "modules/reducers/tokenUcd";

export function TokenUcdInfo(props) {
    let { contract } = props;

    const handleRefreshClick = e => {
        e.preventDefault();
        store.dispatch(refreshTokenUcd());
    };

    return (
        <Pblock header="TokenUcd contract">
            <p>Total token supply: {contract.info.totalSupply} ACD</p>
            <p>ETH Reserve: {contract.info.ethBalance} ETH</p>
            <p>ACD Reserve: {contract.info.ucdBalance} ACD </p>
            <ContractBaseInfo
                contract={contract}
                refreshCb={handleRefreshClick}
            />
        </Pblock>
    );
}

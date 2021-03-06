import React, { useEffect } from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/esm/Button";
import { Line } from "react-chartjs-2";
import useFetchActivityWithTotal from "./useFetchWithTotal";
import { fetchInstrumentHistory } from "../actionCreators/instrumentActionCreators";

const TIME_LAPSE = {
    ALL: "ALL",
    YR: "YR",
    MTH: "MTH",
    WEEK: "WEEK",
    THREE_MTH: "THREE_MTH",
}

/**
 * @TODO: Clean this up 
 * @param {*} setData 
 * @param {*} portfolioData 
 * @param {*} instrumentHistory 
 * @param {*} timePeriod 
 * @param {*} portfolio 
 * @param {*} setTotalValue 
 */
const useDisplayHistoricalExchangeRate = (setData, portfolioData, instrumentHistory, timePeriod, portfolio, setTotalValue, color) => {
    // console.log('portfolio ', portfolio);
    const sumMultiplePurchasesInSameDay = (activity) => {
        // return portfolio
        //     .filter(folio => folio.timestamp === activity.Date)
        //     .map(folio => folio.amount)
        //     .reduce((first, second) => +first + +second, 0);
        // return portfolio?.filter(folio => folio.Date.replace('/(00):(00):(00)/g') === activity.Date.replace('/(00):(00):(00)/g'))
        return portfolio?.filter(folio => folio.Date === activity.Date)
            .map(folio => {
                console.log('amoutn', folio.Amount)
                return folio.Amount
            })
            // .map(folio => folio.Amount)
            .reduce((first, second) => +first + +second, 0);
    }

    React.useEffect(() => {
        let accumulatedFractionsOfAsset = 0;
        const getMarketValueForSatoshis = (fractionUnitOfAsset, rate) => {
            // console.log('satoshis', satoshis)
            // console.log('rate', rate)
            accumulatedFractionsOfAsset = isNaN(accumulatedFractionsOfAsset) ? 0 : accumulatedFractionsOfAsset
            accumulatedFractionsOfAsset = accumulatedFractionsOfAsset + +fractionUnitOfAsset;
            return (accumulatedFractionsOfAsset * rate);
        }

        let labels;
        let totalAmount;

        //@TODO: Could error out to the user saying that we did not get data back or something
        if (instrumentHistory !== undefined) {
            labels = instrumentHistory.map(asset => asset.Date);
            // console.log('labels', labels);
            totalAmount = instrumentHistory
                // .map(asset => {
                //     const assetQuantityForAGivenDay = sumMultiplePurchasesInSameDay(asset);
                //     // console.log('totalAmountOfSatoshisInTheSameDay', assetQuantityForAGivenDay)
                //     const marketValueForAssetQuantity = getMarketValueForSatoshis(assetQuantityForAGivenDay, asset.Close);
                //     // console.log('getMarketValueForSatoshis', marketValueForAssetQuantity);
                //     return marketValueForAssetQuantity;
                // });
                .map(asset => getMarketValueForSatoshis(sumMultiplePurchasesInSameDay(asset), asset.Close));

            // console.log('totalAmount', totalAmount)

            if (timePeriod === TIME_LAPSE.WEEK) {
                totalAmount = totalAmount.splice(totalAmount.length - 10, totalAmount.length - 1);
                labels = labels.splice(labels.length - 10, labels.length - 1);
            }

            if (timePeriod === TIME_LAPSE.MTH) {
                totalAmount = totalAmount.splice(totalAmount.length - 34, totalAmount.length - 1);
                labels = labels.splice(labels.length - 34, labels.length - 1);
            }

            if (timePeriod === TIME_LAPSE.THREE_MTH) {
                totalAmount = totalAmount.splice(totalAmount.length - 90, totalAmount.length - 1);
                labels = labels.splice(labels.length - 90, labels.length - 1);
            }

            if (timePeriod === TIME_LAPSE.YR) {
                totalAmount = totalAmount.splice(totalAmount.length - 150, totalAmount.length - 1);
                labels = labels.splice(labels.length - 150, labels.length - 1);
            }

            setTotalValue(totalAmount[totalAmount.length - 1]?.toFixed(2));
        } else {
            totalAmount = 0;
            setTotalValue(0);
            labels = [];
        }

        labels = labels?.map(d => d.replace(' 00:00:00', ''));


        const lineGraphData = {
            labels,
            datasets: [
                {
                    data: totalAmount,
                    label: 'Portfolio',
                    borderColor: color,
                    fill: false,
                },
            ],
        };
        setData(lineGraphData);
    }, [portfolioData, instrumentHistory, timePeriod]);
};

// Legacy HOC way of tieing into Redux Store. \\

const PortfolioPage = ({ portfolioOfAsset, instrumentHistory, fetchInstrumentHistory, dispatch }) => {
    const code = portfolioOfAsset.code;
    useEffect(() => {
        dispatch(fetchInstrumentHistory(code))
    }, []);

    const [timePeriod, setTimePeriod] = React.useState(TIME_LAPSE.MTH);
    const [data, setData] = React.useState({});
    const [activity, setActivity] = React.useState({});

    const [totalValue, setTotalValue] = React.useState(0);

    useFetchActivityWithTotal(portfolioOfAsset.code, setActivity);
    const { portfolio, fiatInvestment, totalAmountOfAsset } = activity;

    const totalV = instrumentHistory && (totalAmountOfAsset * instrumentHistory[instrumentHistory.length - 1]?.Close)?.toFixed(2);

    useDisplayHistoricalExchangeRate(setData, activity.portfolio, instrumentHistory, timePeriod, portfolio, setTotalValue, portfolioOfAsset.color);


    return (
        <div className="p-page">
            <div className="portfolio-page">
                <div className="title-container">
                    <div className="buttons">
                        <Button onClick={() => setTimePeriod(TIME_LAPSE.ALL)}>All</Button>
                        <Button onClick={() => setTimePeriod(TIME_LAPSE.YR)}>Year</Button>
                        <Button onClick={() => setTimePeriod(TIME_LAPSE.THREE_MTH)}>Three Month</Button>
                        <Button onClick={() => setTimePeriod(TIME_LAPSE.MTH)}>Month</Button>
                        <Button onClick={() => setTimePeriod(TIME_LAPSE.WEEK)}>Week</Button>
                    </div>
                    <div className="title">
                        <p>Invested: ${fiatInvestment?.toFixed(2)}</p>
                        <p>Valued at: ${totalV}</p>
                        <p>Total: {totalAmountOfAsset}</p>

                    </div>
                </div>
                <div className="portfolio-grid">
                    <Line data={data} />
                </div>
            </div>
        </div>
    );
}

export default connect(state => ({
    instrumentHistory: state.cryptoHistory.asset
}), dispatch => ({
    fetchInstrumentHistory: fetchInstrumentHistory, dispatch
}))(PortfolioPage);
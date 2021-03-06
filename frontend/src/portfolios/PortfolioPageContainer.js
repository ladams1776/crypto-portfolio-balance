import React from 'react';
import PortfolioPage from './PortfolioPage';
import ActivityByPricePanel from '../activityPanel/ActivityByPricePanel';
import HistoricRatesPage from '../historicRatesPages/HistoricRatesPage';
import ActivityByQuantityPanel from '../activityPanel/ActivityByQuantityPanel';
import './PortfolioPage.css';

/**
 * Leaving an older version of redux as a bookmark.
 * @param {Object} param0 
 * @returns 
 */
const PortfolioPageContainer = ({ portfolioOfAsset }) => {
    return <div className="whole-page">

        <div className="hr-page">
            <HistoricRatesPage portfolio={portfolioOfAsset} />
        </div>
        <div className="hr-page">
            <PortfolioPage portfolioOfAsset={portfolioOfAsset} />
        </div>
        <div className="hr-page">
            <ActivityByPricePanel selectedPortfolio={portfolioOfAsset} />
        </div>
        <div className="hr-page">
            <ActivityByQuantityPanel selectedPortfolio={portfolioOfAsset} />
        </div>
    </div>
}

export default PortfolioPageContainer;
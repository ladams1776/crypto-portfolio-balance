const axios = require('axios');
const portfolio = require('../../portfolio.json');
const key = process.env.X_CMC_PRO_API_KEY;
const COIN_MARKET_CAP_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";

module.exports = (req, response) => {
    console.log('getAllCurrentCryptoPriceAction');
    const url = COIN_MARKET_CAP_URL;
    console.log('portfolio', portfolio)
    axios.defaults.headers.common = { "Accept": "application/json", "X-CMC_PRO_API_KEY": key };
    axios
        .get(url)
        .then(async resp => {
            console.log('response');
            const currentCryptos = await resp.data;

            const timestamp = currentCryptos.status.timestamp;
            console.log('timestamp', timestamp);

            console.log('data', currentCryptos.data);
            const e = portfolio.map(p => {
                return currentCryptos.data.filter(c => {
                    if(p.code.toUpperCase() === c.symbol) {
                        return true;
                    }  
                    return false;
                })
            });
            // const e = currentCryptos.data.map(c => {
            //     return portfolio.filter(p => {
            //         if (p.code.toUpperCase() === c.symbol) {
            //             return true;
            //         }
            //         return false;
            //     });
            // });
            console.log('sweeeee', e)
            response.send(resp.data);

        })
        .catch(err => { response.send('Error fetching data from coinmarket' + err); });
};
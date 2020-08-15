'use strict'

// ----------------------------------------------------------------------------

const log       = require ('ololog')
    , ansi      = require ('ansicolor').nice
    , chai      = require ('chai')
    , expect    = chai.expect
    , assert    = chai.assert
    , testTrade = require ('./test.trade.js')

/*  ------------------------------------------------------------------------ */

module.exports = async (exchange, symbol) => {

    const skippedExchanges = [
        // 'adara',
    ]

    if (skippedExchanges.includes (exchange.id)) {
        log (exchange.id, 'found in ignored exchanges, skipping fetchTrades...')
        return
    }

    if (exchange.has.fetchTrades) {

        // log (symbol.green, 'fetching trades...')

        const trades = await exchange.fetchTrades (symbol)
        assert (trades instanceof Array)
        log (symbol.green, 'fetched', Object.values (trades).length.toString ().green, 'trades')
        const now = Date.now ()
        for (let i = 0; i < trades.length; i++) {
            testTrade (exchange, trades[i], symbol, now)
            if (i > 0) {
                if (trades[i].timestamp && trades[i - 1].timestamp) {
                    assert (trades[i].timestamp >= trades[i - 1].timestamp)
                }
            }

        }
        // log (asTable (trades))

    } else {

        log (symbol.green, 'fetchTrades () not supported'.yellow)
    }
}
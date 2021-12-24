import React, { useEffect, useState } from 'react';
import { RatesRepository } from '../../repositories';

import { Earnings } from '../Earnings';
import { calcRange } from './modules';
import { CRYPTO, SYMBOL } from '../../modules/constants';

const { BTC, USDT } = CRYPTO;

const Calculator = () => {
  const [amount, setAmount] = useState(0.15);
  const [crypto, setCrypto] = useState(BTC);
  const [range, setRange] = useState(6);
  const [rates, setRates] = useState({});

  useEffect(() => {
    setRates(RatesRepository.cache());
    (async () => {
      setRates(await RatesRepository.get());
    })();
  }, []);

  const handleAmount = ({ target: { value = 0 } = {} } = {}) => {
    setAmount(value > 0 ? value : '0');
  };

  const handleCrypto = (value) => {
    setCrypto(() => {
      setAmount(value === BTC ? 0.15 : 10000);
      return value;
    });
  };

  const handleRange = ({ target: { value = 0 } = {} } = {}) => {
    setRange(value);
  };

  const rateUSD = rates[crypto] || 1;
  const { months, value, type } = calcRange(range);

  return (
    <>
      <div className="form">
        <nav className="row">
          <button className={crypto === BTC ? 'active' : undefined} onClick={() => handleCrypto(BTC)}>
            <div className={'icon currency'}>{SYMBOL.BTC}</div>
            <abbr>BTC</abbr>
          </button>
          <button className={crypto === USDT ? 'active' : undefined} onClick={() => handleCrypto(USDT)}>
            <div className={'icon currency'}>{SYMBOL.USDT}</div>
            <abbr>USDT</abbr>
          </button>
        </nav>

        <div className="amount">
          <input
            className="currency"
            id="amount"
            type="number"
            value={parseFloat(amount, 10)}
            step={crypto === BTC ? '0.01' : '100'}
            aria-labelledby="calculator"
            onChange={handleAmount}
          />
          <div className="row">
            <label htmlFor="amount">{crypto} Amount</label>
            {crypto === BTC && <small className="rate">${rateUSD.toFixed(0)} / BTC</small>}
          </div>
        </div>

        <label htmlFor="months" className="row">
          <span className="currency">{value}</span>
          <span>&nbsp;{type}</span>
        </label>
        <input type="range" id="months" name="months" min="1" max="21" value={range} onChange={handleRange} />
      </div>

      <Earnings {...{ amount, crypto, months, rates }} />
    </>
  );
};

export { Calculator };

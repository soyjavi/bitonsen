import React from 'react';
import { parseMonths } from './modules';

const BTC = 'BTC';

const Earnings = ({ amount = 0, crypto = BTC, months = 6, percentage = 0.0, rates = {}, total }) => {
  // const perc =  crypto === BTC ? 0.0679 : 0.102;
  const rateUSD = rates[crypto] || 1;
  const monthlyInterest = (total ? total.earnings : amount * percentage) / 12;
  const usdMonthlyInterest = monthlyInterest * rateUSD;

  return (
    <div className="earnings">
      {total && (
        <>
          <h1 className="currency">
            <span className="symbol">{crypto === BTC ? '₿' : '₮'}&nbsp;</span>
            <span>{total.invested}</span>
          </h1>
          <strong>Total {crypto} invested</strong>

          <h1 className="currency">
            <span>{total.rate}</span>
            <span className="symbol">&nbsp;%</span>
          </h1>
          <strong>Blended Rate</strong>
        </>
      )}

      <h1 className="currency">
        <span className="symbol">$&nbsp;</span>
        {usdMonthlyInterest.toFixed(2)}
      </h1>
      <strong>USD Interest per month</strong>

      {crypto === BTC && (
        <>
          <h1 className="currency">
            <span className="symbol">₿&nbsp;</span>
            <span className="earn">{(monthlyInterest * months).toFixed(crypto === BTC ? 6 : 2)}</span>
          </h1>
          <strong>Total {crypto} Earnings</strong>
        </>
      )}

      <h1 className="currency">
        <span className="symbol">$&nbsp;</span>
        <span className="earn">{(usdMonthlyInterest * months).toFixed(2)}</span>
      </h1>
      <strong>Total USD Interest over {parseMonths(months)}</strong>
    </div>
  );
};

export { Earnings };

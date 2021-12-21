import { useEffect, useState } from 'react';
import { PlatformsRepository, RatesRepository } from '../../repositories';

import { parseTier } from './modules';
import { Earnings } from '../Earnings';

export const Spreadsheet = () => {
  const [amount, setAmount] = useState({});
  const [platforms] = useState(PlatformsRepository.list());
  const [rates, setRates] = useState({});

  useEffect(() => {
    setRates(RatesRepository.cache());
    (async () => {
      setRates(await RatesRepository.get());
    })();
  }, []);

  const handleChange = (value = '', id) => {
    setAmount({ ...amount, [id]: value >= 0 ? parseFloat(value, 10) : '' });
  };

  const total = { invested: 0, earnings: 0, rate: 0 };
  Object.keys(amount).forEach((key) => {
    const [platformName, tierIndex] = key.split('#');
    const platform = platforms.find(({ name }) => platformName === name);

    if (amount[key]) {
      total.invested += amount[key];
      total.earnings += amount[key] * (platform.tiers[tierIndex].yield / 100);
    }
  });
  total.rate = total.invested ? ((total.earnings * 100) / total.invested).toFixed(2) : 0;

  return (
    <div className="content">
      <div>
        <h1>Spreadsheet</h1>
        <p>
          Your crypto can earn up to 10.5% APY in crypto with a BlockFi Interest Account (BIA). Interest accrues daily
          and is paid monthly. There are no hidden fees, no minimum balances, and no reason to wait.
        </p>
        <table>
          <thead>
            <tr>
              <th>Amount BTC</th>
              <th>Yield</th>
              <th>Limits</th>
              <th>Compounding</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map(({ description, name, site, affiliate: { link } = {}, tiers = [] }) => (
              <>
                <tr key={name} className="platform">
                  <td colSpan="4">
                    <div className="row">
                      <a href={link || site} target="_blank">
                        {name}
                      </a>
                      {description && <small>{description}</small>}
                    </div>
                  </td>
                </tr>
                {tiers.map(({ compounding, range, yield: percentage }, index) => {
                  const id = `${name}#${index}`;
                  return (
                    <tr key={id} className={name ? 'anchor' : undefined}>
                      <td>
                        <input
                          placeholder="0.00"
                          type="number"
                          step={'0.01'}
                          value={amount[id]}
                          onChange={({ target: { value = 0 } = {} }) => handleChange(value, id)}
                        />
                      </td>
                      <td>{parseFloat(percentage, 10).toFixed(2)}%</td>
                      <td>{parseTier(range)}</td>
                      <td>{compounding}</td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
        <div className="info">
          <small>
            This calculator is indicative and for informational purposes only and is not a guarantee of actual interest
            that may be earned. Actual earned interest will be payable in cryptocurrency and will vary depending on the
            actual rate that applies to the cryptocurrency in your BIA from time to time. The USD-equivalent value of
            earned interest will vary depending on the conversion rate between USD and the applicable cryptocurrency
            from time to time.
          </small>
        </div>
      </div>

      <Earnings crypto="BTC" months={12} rates={rates} total={total} />
    </div>
  );
};

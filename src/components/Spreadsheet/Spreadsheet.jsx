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
    <>
      <div className="content cols">
        <div class="col">
          <h1>Spreadsheet</h1>
          <p>
            It's never too late, so get started on your crypto journey and earn high APY with a crypto interest account.
            Here are some of my recommendations, and thanks to this spreadsheet you will be able to discover how much
            crypto you can make monthly.
          </p>
        </div>
      </div>
      <div className="content cols">
        <table>
          <thead>
            <tr>
              <th>
                Amount <span class="hide-mobile">BTC</span>
              </th>
              <th>Yield</th>
              <th>Limits</th>
              <th>Compounding</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map(({ description, name, site, affiliate: { link, reward } = {}, tiers = [] }) => (
              <>
                <tr key={name} className="platform">
                  <td colSpan="4">
                    <div className="row">
                      <a href={link || site} alt={description} target="_blank">
                        {name.toUpperCase()}
                      </a>
                      {link ? <a href={link}>{reward}</a> : <div />}
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

        <Earnings crypto="BTC" months={12} rates={rates} total={total} />
      </div>
      <div className="content cols">
        <div className="col info">
          <small>
            This calculator is indicative and for informational purposes only and is not a guarantee of actual interest
            that may be earned. Actual earned interest will be payable in cryptocurrency and will vary depending on the
            actual rate that applies to the cryptocurrency in your BIA from time to time. The USD-equivalent value of
            earned interest will vary depending on the conversion rate between USD and the applicable cryptocurrency
            from time to time.
          </small>
        </div>
      </div>
    </>
  );
};

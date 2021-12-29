import { useEffect, useState } from 'react';
import { PlatformsRepository, RatesRepository } from '../../repositories';

import { parseTier } from './modules';
import { Earnings } from '../Earnings';

const BTC = 'BTC';
const USDT = 'USDT';

export const Spreadsheet = () => {
  const [amount, setAmount] = useState({});
  const [crypto, setCrypto] = useState(BTC);
  const [platforms] = useState(PlatformsRepository.list());
  const [rates, setRates] = useState({});

  useEffect(() => {
    setRates(RatesRepository.cache());
    (async () => {
      setRates(await RatesRepository.get());
    })();
  }, []);

  const handleCrypto = (next) => {
    setCrypto(() => {
      setAmount({});
      return next;
    });
  };

  const handleAmount = (value = '', id) => {
    setAmount({ ...amount, [id]: value >= 0 ? parseFloat(value, 10) : '' });
  };

  const total = { invested: 0, earnings: 0, rate: 0 };
  Object.keys(amount).forEach((key) => {
    const [platformName, tierIndex] = key.split('#');
    const platform = platforms.find(({ name }) => platformName === name);

    const tiers = (platform.tiers || []).filter((tier) => tier.crypto === crypto);

    if (amount[key]) {
      total.invested += amount[key];
      total.earnings += amount[key] * (tiers[tierIndex].yield / 100);
    }
  });
  total.rate = total.invested ? ((total.earnings * 100) / total.invested).toFixed(2) : 0;

  return (
    <>
      <div className="content cols">
        <div className="col">
          <div class="row">
            <h2>CeFi Spreadsheet</h2>
            <nav className="row">
              <button className={`${crypto === BTC ? 'active' : ''}`} onClick={() => handleCrypto(BTC)}>
                <div className="icon currency">₿</div>
                <small>BTC</small>
              </button>
              <button className={`${crypto === USDT ? 'active' : ''}`} onClick={() => handleCrypto(USDT)}>
                <div className="icon currency">₮</div>
                <small>USDT</small>
              </button>
            </nav>
          </div>
          <p>
            It's never too late, so get started on your crypto journey and earn high APY with a crypto interest account.
            Here are some of my recommendations, use this spreadsheet and you will be able to discover how much crypto
            you can make.
          </p>
        </div>
      </div>
      <div className="content cols">
        <div className="col">
          <table>
            <thead>
              <tr>
                <th>
                  Amount <span className="hide-mobile">{crypto}</span>
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
                  {tiers
                    .filter((tier) => tier.crypto === crypto)
                    .map(({ compounding, range, yield: percentage }, index) => {
                      const id = `${name}#${index}`;
                      return (
                        <tr key={id} className={name ? 'anchor' : undefined}>
                          <td>
                            <input
                              placeholder="0.00"
                              type="number"
                              step={'0.01'}
                              value={amount[id]}
                              onChange={({ target: { value = 0 } = {} }) => handleAmount(value, id)}
                            />
                          </td>
                          <td>{parseFloat(percentage, 10).toFixed(2)}%</td>
                          <td>{parseTier(range, crypto)}</td>
                          <td>{compounding}</td>
                        </tr>
                      );
                    })}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <Earnings crypto={crypto} months={12} rates={rates} total={total} />
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

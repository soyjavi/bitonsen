import ReactDOM from 'react-dom';
import { Calculator, Platforms, Spreadsheet } from './components';

ReactDOM.render(<Calculator />, document.getElementById('calculator'));
ReactDOM.render(<Platforms />, document.getElementById('platforms'));
ReactDOM.render(<Spreadsheet />, document.getElementById('spreadsheet'));

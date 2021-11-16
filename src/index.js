import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createBrowserHistory } from 'history';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import{MoralisProvider} from "react-moralis";


const history = createBrowserHistory();

Sentry.init({
	dsn: 'https://8336bb1614b24d00ad781a4461b69fd9@o982817.ingest.sentry.io/5938294',
	integrations: [
		new Integrations.BrowserTracing({
			// Can also use reactRouterV3Instrumentation or reactRouterV4Instrumentation
			routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
		}),
	],

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 0.6,
});
const moralisAppId="isklCjLYiT0YZ3OikTY2wDL2eguVudpeKiObGAWJ"
const moralisServerURL="https://btfk3eszgjwc.usemoralis.com:2053/server"
console.log('Initialized Sentry');

ReactDOM.render(
<App history={history} />
, document.getElementById('root'));

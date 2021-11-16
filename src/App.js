import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Admin from './Admin';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import Maintenance from './Maintenance';
import AdminUser from './AdminUser';
import AdminPreviousRound from './AdminPreviousRound';
import { useWallet,UseWalletProvider } from 'use-wallet';
import ResetPassword from './ResetPassword';
import Account from './Account';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import {portis} from '@web3-react/portis-connector'
import WalletConnectProvider from "@walletconnect/web3-provider";
const wallet = new WalletConnectProvider({
	 rpc:
	 {
		 56:"https://bsc-dataseed.binance.org/"
	 }
	
	,
	qrcodeModalOptions: {
	  mobileLinks: [
		"rainbow",
		"metamask",
		"argent",
		"trust",
		"imtoken",
		"pillar",
	  ],
	},
  });
export default function App({ history }) {
	let maintenance = false;
	return (
		  <UseWalletProvider
	//	 	chainId={56}
		  	connectors={{
		  		 walletconnect:wallet
		  	}}
		  >
			<GoogleReCaptchaProvider reCaptchaKey="6LfLfhAcAAAAABPO3RfdnRlQ2j9cKfbZqbyOluDT">
				<Router history={history}>
					<Switch>
						<Route path="/admin/previous_round">
							<AdminPreviousRound />
						</Route>
						<Route path="/admin/user">
							<AdminUser />
						</Route>
						<Route path="/admin">
							<Admin />
						</Route>
						<Route path="/reset_password">
							<ResetPassword />
						</Route>
						<Route path="/account">
							<Account />
						</Route>
						{/* <Route path="/">
							<Home />
							</Route> */}
						<Route path="/"> 
						<Home />
						</Route>
					</Switch>
				</Router>
			</GoogleReCaptchaProvider>
		</UseWalletProvider>
	);
}

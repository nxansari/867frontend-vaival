import PreviousResults from './components/PreviousResults';
import TopScores from './components/TopScores';
import PlayerInfo from './components/PlayerInfo';
import SlotMachine from './components/SlotMachine';
import { useEffect, useState } from 'react';
import Button from './components/Button';
import SignupModal from './components/SignupModal';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';
import ResetPasswordModal from './components/ResetPasswordModal';
import useWindowSize from './hooks/useWindowSize';
import DeviceIdentifier from 'react-device-identifier';
import redirect from './utils/redirect';
//start wallet import libraries
import { ABI } from './abi.js';
import { ethers } from 'ethers';
import { useWallet  } from 'use-wallet';
import Header from './components/Header';
import WalletConnectProvider from "@walletconnect/web3-provider";
//ending wallet import
import Web3 from "web3";
const net = 'https://bsc-dataseed.binance.org/';
const provider = new ethers.providers.JsonRpcProvider(net);

const Contract = new ethers.Contract('0x9cefd9588f076c5f805341864adc8a6f077a5b99', ABI, provider);

export default function Home() {
	const { activate } = useWallet()
	const { width, height } = useWindowSize();
	const [background, setBackground] = useState(true);
	const [signupVisible, setSignupVisible] = useState(false);
	const [loginVisible, setLoginVisible] = useState(false);
	const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
	const [points, setPoints] = useState(0);
	const [prizeInfoLink, setPrizeInfoLink] = useState('/');
	const [spins, setSpins] = useState(0);
	const [ad, setAd] = useState(null);
	const [currentLeaderboardCount, setCurrentLeaderboardCount] = useState(5);
	const wallet = useWallet();
    
	

	

	const [leaderboardData, setLeaderboardData] = useState({ top_winnings: [] });
	async function refresh() {
		let res = await fetch(
			`https://api.867casino.com/leaderboards?limit=${currentLeaderboardCount}`
		);
		let json = await res.json();
		setLeaderboardData(json);

		res = await fetch(`https://api.867casino.com/link?key=prize_info`);
		json = await res.json();
		setPrizeInfoLink(json['link']);

		res = await fetch('https://api.867casino.com/ad');
		json = await res.json();
		setAd(json);
	}
	useEffect(async () => {
		
		refresh();
		setInterval(refresh, 30 * 1000);
	}, []);
	//address view type
	var styledAddress = wallet.account
		? wallet.account.slice(0, 4) + '..' + wallet.account.slice(-4)
		: '';

	let isLoggedIn = localStorage.getItem('token') != null;
	let currentWalletConnector=localStorage.getItem('LAST_WALLET_CONNECTOR')
	var obj;
	//wallet connection
	const handleWalletConnect = async () => {
		if (wallet.status =="error")
		{
			window.localStorage.removeItem("walletconnect");
			wallet.reset()
		}
		 wallet.connect('walletconnect').then(() => 
		 {
			  	
		 }).catch((error) => {
		 	alert(error);
		   })
	
	};

	async function getBalance ()
	 {
		if (wallet.status === 'connected') {
			const webprovider = new ethers.providers.Web3Provider(wallet.ethereum);
			const signer = webprovider.getSigner();
			var signedContract = Contract.connect(signer);
			let tx1 = await signedContract.balanceOf(wallet.account).catch((err) => {
				console.log('contractBalance err', err);
			});
			console.log(tx1)
			let value = parseFloat(tx1.toString()) / 10 ** 9;
			console.log('resultBalance:', tx1, wallet.account, value);
			alert('balance: ' + value.toString());
		} else {
			alert('Please connect wallet');
		}
	};
    async function disconnectWallet()
	{
		wallet.reset()
	}
	async function removeWallet()
	{
		wallet.reset()
		window.localStorage.removeItem("walletconnect");
	}
	async function showMore() {
		let res = await fetch(
			`https://api.867casino.com/leaderboards?limit=${currentLeaderboardCount + 100}`
		);
		let json = await res.json();
		setLeaderboardData(json);
		setCurrentLeaderboardCount(currentLeaderboardCount + 100);
	}
	async function handleMetamask()
	{
		wallet.connect().then(() => {
		
		});
	    console.log(wallet)
	}
	return (
		<>
			<div className={background ? 'hero' : ''}></div>
			{ad != null ? <Toast text={ad.text} link={ad.link} /> : <></>}

			<SignupModal
				visible={signupVisible}
				setVisible={setSignupVisible}
				setLoginVisible={setLoginVisible}
				setResetPasswordVisible={setResetPasswordVisible}
			/>
			<LoginModal
				visible={loginVisible}
				setVisible={setLoginVisible}
				setSignupVisible={setSignupVisible}
				setResetPasswordVisible={setResetPasswordVisible}
			/>
			<ResetPasswordModal
				visible={resetPasswordVisible}
				setVisible={setResetPasswordVisible}
				setSignupVisible={setSignupVisible}
			/>

			<Header
				isLoggedIn={isLoggedIn}
				setLoginVisible={setLoginVisible}
				setSignupVisible={setSignupVisible}
				background={background}
				setBackground={setBackground}
			/>

			<div className="landing-container flex justify-center items-center text-white py-6 lg:px-6 px-1 mb-20">
				<div className="grid grid-flow-row lg:grid-cols-5 lg:grid-rows-1 grid-cols-1 grid-rows-3 lg:gap-4">
					{/* Scoreboards */}
					{width <= 1024 ? (
						<>
							{/* Main */}
							<div className="flex justify-center items-center lg:pt-7 pt-0 lg:col-span-3 row-span-3">
								<SlotMachine
									points={points}
									setPoints={setPoints}
									setSignupVisible={setSignupVisible}
									spins={spins}
									setSpins={setSpins}
								/>
							</div>
							<div className="grid lg:grid-flow-row lg:grid-cols-1 lg:grid-rows-2 grid-flow-row grid-cols-2 grid-rows-1 justify-center items-center lg:gap-4 gap-1">
								<TopScores data={leaderboardData} showMore={showMore} />
								<PreviousResults />
							</div>
						</>
					) : (
						<>
							<div className="grid lg:grid-flow-row lg:grid-cols-1 lg:grid-rows-2 grid-flow-row grid-cols-2 grid-rows-1 justify-center items-center lg:gap-4 gap-1">
								<TopScores data={leaderboardData} showMore={showMore} />
								<PreviousResults />
							</div>

							{/* Main */}
							<div className="flex justify-center items-center lg:pt-0 pt-0 lg:col-span-3 row-span-3">
								<SlotMachine
									points={points}
									setPoints={setPoints}
									setSignupVisible={setSignupVisible}
									spins={spins}
									setSpins={setSpins}
								/>
							</div>
						</>
					)}

					{/* Player Info */}
					<div className="flex justify-center items-center lg:flex-col flex-row lg:pt-0 pt-7">
						<PlayerInfo points={points} setPoints={setPoints} />
						<div className="lg:mb-2"></div>
						<div className="side-buttons flex flex-col w-full lg:ml-0 ml-5 lg:mt-3 mt-0">
							<Button
								text="Chart"
								onClick={() =>
									redirect('https://poocoin.app/tokens/0x9cefd9588f076c5f805341864adc8a6f077a5b99')
								}
							/>
							<Button text="Telegram" onClick={() => redirect('https://t.me/EightSixSeven')} />
							<Button text="Prize Info" onClick={() => redirect(prizeInfoLink)} />
							<Button text="Website" onClick={() => redirect('https://867crypto.com')} />
							{isLoggedIn && wallet.status === 'connected' ? (
								<div>
									<div>Account: {styledAddress}</div>
									<Button text="Get Balance" onClick={getBalance} />
									<Button onClick={disconnectWallet} text="Disconnect Wallet" />
									{currentWalletConnector=="walletconnect" ?<Button onClick={removeWallet} text="Remove  Wallet" /> : <></>}
								</div>
							) : (
								<>{isLoggedIn ? 
								<div><Button text="Connect to  Wallet Connect" onClick={handleWalletConnect} /> 
								<DeviceIdentifier isDesktop={true}>
								<Button text="Connect to metamask extension" onClick={handleMetamask} />
								</DeviceIdentifier>
								</div> : <></>}</>
							)}
							
							<Button
								text="Reset Minigame"
								onClick={async () => {
									if (isLoggedIn) {
										let res = await fetch(
											`https://api.867casino.com/me/reset_minigame?token=${localStorage.getItem(
												'token'
											)}`
										);
										let json = await res.json();
										alert(json['message']);
										window.location.reload();
									}
									localStorage.removeItem('minigame');
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

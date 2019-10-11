const puppeteer = require("puppeteer");

const url = "https://cdn.wink.org";

/* -------------- DEV -------------- */
const dev = true;//when true it use local data structure below to store data else it will store in mysql db (TODO mysql db) 
let wallets = {};//global wallets object
let bets = {};//global bets object
let walletsNBets = {};//bets stored by users
/* --------------------------------- */

module.exports = {	
	getWallets:()=>{if(dev){return wallets;}else{}},//return all wallets
	getBets:()=>{if(dev){return bets;}else{}},//return all bets
	getWalletsNBets:()=>{if(dev){return walletsNBets;}else{}},//return all wallets n bets grouped
	getBetsByWallet:(addy)=>{if(dev){return walletsNBets[addy];}else{}}//return all bets for the wallet addy received in paramater
};

/* 
	--- ENTRY POINT ---
	Navigate to url,
	activate socket.io debugging output to console,
	create an eventlistener triggered on console.log, 
	reload the page and start scraping data.
*/	
(async () => {
	if(dev)console.log("winkDiceScraper started !")
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	page.on("console", (msg) => { Trim(msg.text())});
	await page.goto(url);
	await page.evaluate(() => { localStorage.debug = "socket.io-client:socket"; });
	await page.goto(url);	
})();

/* Trim strings obtained from console */
function Trim(txt){
	/*when we arrive on the page 
	we receive a a full page of bets 
	it happen only once
	*/
	if(txt.includes(`emitting event ["login_info",{"RAIN_LIST":[],"LASTEST_BETS_QUEUE":`)){
		//convert string data to array
		let betArr = JSON.parse(txt.split(`"LASTEST_BETS_QUEUE":`)[1].split("]")[0] + "]");
		//for each bet in array
		for(var i=0;i < betArr.length;i++)
			//add the bet
			AddBet(bettArr[i])
	}
	/*each new bet pass trought here*/
	else if(txt.includes(`emitting event ["bet_info",`)){
		//convert string data to object
		var bet = JSON.parse(txt.split(`emitting event ["bet_info",`)[1].split("]")[0]);
		//add the bet
		AddBet(bet);
	}
}

/* Add new bet */
function AddBet(bet){
	var w, b; //wallet, bet	
	if(dev){		
		//add the wallet to global wallets object if not exist
		w = AddWallet(bet.bettor);
		
		//create a unique key for this bet
		let uniqueBetKey = bet.bettor + "_" + bet.orderId; 
		
		//check if this unique key exist in global bets object
		if(!bets.hasOwnProperty(uniqueBetKey))
			//add the new bet
			bets[uniqueBetKey] = bet;
		
		//check if wallet exist in walletsNBets object
		if(!walletsNBets.hasOwnProperty(w.addy))
			//create a new entry for this wallet to store bets of this user
			walletsNBets[w.addy] = {};
		
		
		//check if this bet id already exist for this user
		if(!walletsNBets[w.addy].hasOwnProperty(bet.orderId))
			//add the new bet for this user
			walletsNBets[w.addy][bet.orderId] = bet;
		
	}else{
		/* TODO */
	}
}

/* Add new wallet */
function AddWallet(addy){
	if(dev){
		/*if the wallet does not exist in object
		we add it and get a unique id for it 
		*/
		if(!wallets.hasOwnProperty(addy))
			wallets[addy] = {addy:addy, id:GetId()};
	}else{
		/* TODO */
	}
	return wallets[addy];
}

/* create a unique id for a new wallet */
function GetId(){
	var count = 0;
	//for each wallet in wallets object
	for(var p in wallets)
		if(wallets.hasOwnProperty(p))
			count++;
	return count;	
}

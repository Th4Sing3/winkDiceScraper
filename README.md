### Note
This project still under development. No database implemented yet it store data in objects that will be deleted when you will close your project.

# WinkDiceScraper
This package navigate to wink.org website then start scraping dice bets data. 
It use puppeteer library for internal navigation.

## Installation

1. Put the folder containing the files in your project
2. Open a command prompt
3. Navigate to the winkDiceScraper folder
4. Type `npm install` and press enter
5. In your code, declare once : const diceScrapper = require("./winkDiceScraper")

## Usage
In your code you'll have access 
```
diceScrapper.getWallets();//return all wallets
diceScrapper.getBets();//return all bets
diceScrapper.getWalletsNBets();//return all wallets n bets grouped by user
diceScrapper.getBetsByWallet("enter wallet addy here");//return all bets for the wallet addy received in paramater
````
If you like this or want to use it for yourself or commercially, contribution are welcome :)
TRON wallet : THXp6NSTbqDBt6p1CpcFc38zLJN9BTdDDd

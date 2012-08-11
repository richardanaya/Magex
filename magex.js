var fs = require('fs');
var request = require('request');

//This URL shoud be in 'text spoiler' mode.
var url = 'http://gatherer.wizards.com/Pages/Search/Default.aspx?sort=cn+&output=spoiler&method=text&action=advanced&set=%20[%22Magic%202013%22]';

var getImage = function( id ) {
    request('http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid='+id+'&type=card').pipe(fs.createWriteStream(id+'.jpeg'));
};

var stat_regex = /multiverseid=(\d*)">([\S ]*)<\/a>\s*<\/td>\s*<\/tr>\s*<tr id="[\S]*">\s*<td>\s*Cost:\s*<\/td>\s*<td>\s*([\S ]*)\s*<\/td>\s*<\/tr>\s*<tr>\s*<td>\s*Type:\s*<\/td>\s*<td>\s*([\S ]*)\s*<\/td>\s*<\/tr>\s*<tr>\s*<td>\s*(Pow\/Tgh:|Loyalty:)\s*<\/td>\s*<td>\s*([\S ]*)\s*<\/td>\s*<\/tr>\s*<tr>\s*<td>\s*Rules Text:\s*<\/td>\s*<td>\s*([\S \n]*)\s*<\/td>\s*<\/tr>\s*<tr>\s*<td>\s*Set\/Rarity:\s*<\/td>\s*<td>\s*([\S ]*)/g;

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var matches,
    cards = [];
    while (matches = stat_regex.exec(body)) {
        //write out images to <id>.jpeg format
        getImage(matches[1]);
        cards.push(
        		{
        			id: matches[1],
        			name: matches[2],
        			cost: matches[3],
        			type: matches[4],
        			powtgh: matches[6],
        			text: matches[7],
		            rarity: matches[8],
        		}
        	);
    }
    fs.writeFileSync('stats.json',JSON.stringify(cards,null,'\t'));
  }
});
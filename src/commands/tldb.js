const regpar = require("regex-parser");
const trunc = require("../lib/truncatestr");

module.exports = {
  name: "tldb",
  description: "A better test Leaderboard",
  documentation: "search through all test ships by name; also view the total points for that search. Currently not case-sensitive. Supports advanced regex search. Use -r at the end of the command name (with a space at either side) to use regex formatting. Example: ;ldb -r /[a-z]/i",
  execute(options) {
    let {message, cache, client, dbo, pre} = options;
    let query = message.content.substr(pre.length+1 + this.name.length);
    let matches = [];
    if(query.startsWith("-r ")) { // regex
      let regexstr = regpar(query.substr(3));
      matches = cache.tleaderboard.filter(s => s.ship_name.match(regexstr));
    } else {
      let lb = cache.tleaderboard;
      matches = lb.filter(s => s.ship_name.toLowerCase().includes(query.toLowerCase()));
    }
    let m = "";
    if(matches === []) m = "**[No Results]**";
    else {
      for(let i in matches) {
        let nstr = `\n**${parseInt(i)+1}**: ${matches[i].ship_name} (*${matches[i].score}pts*) \`{${matches[i].hex_code}}\``;
        if(m.length + nstr.length < 2000) {
          m += nstr;
        }
      }
      message.channel.send(trunc(m || "**[No Results]**", 2000));
    }
    let tp = 0;
    for(let i in matches) {
      tp += parseInt(matches[i].score);
    }
    message.channel.send(`Total points from the term *${query}*: **${tp}pts** (${matches.length} ships, out of ${cache.tleaderboard.length} ships.)`);
  }
}
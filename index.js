$(document).ready(async function() {
    console.log(`[index.js] init...`);
	
    var api = {
       wifi: `./wifi.json`,
    }
    let response = await $.get(api.wifi);
	console.log(`response: {response.text}`);
	console.log(JSON.parse(response.text));
});

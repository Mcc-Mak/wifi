$(document).ready(async function() {
    console.log(`[index.js] init...`);
	
    // var api = {
       // wifi: `./wifi.json`,
    // }
    // let response = await $.get(api.wifi);
	// console.log(response);
	// console.log(`response: {response.text}`);
	// console.log(JSON.parse(response.text));
	
	async function getAjax(i_url = "") {
		return await $.ajax(i_url);
	}

	(
		async () => {
			const r = await getAjax(i_url = `./wifi.json`);
			console.log(">>> r");
			console.log(r);
			console.log(">>> r.responseText");
			console.log(r.responseText);
		}
	) ();
});

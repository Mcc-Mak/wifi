async function getAjax(i_url = "") {
	return await $.ajax(i_url, {dataType: "text"});
}

$(document).ready(async function() {
    console.log(`[index.js] init...`);

	const response = await getAjax(`./wifi.json`);
	console.log(
		JSON.parse(response.trim())
	);
});

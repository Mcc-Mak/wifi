async function getAjax(i_url = "") {
	return await $.ajax(i_url, {dataType: "text"}).then;
}

$(document).ready(async function() {
    console.log(`[index.js] init...`);

	let api = {
		wifi: {
			fixed: `https://www.ogcio.gov.hk/en/our_work/community/common_wifi_branding/fixed-wi-fi-hk-locations.json`,
			non_fixed: `https://www.ogcio.gov.hk/en/our_work/community/common_wifi_branding/non-fixed-wi-fi-hk-locations.json`,
		}
	};

	[
		"fixed",
		"non_fixed"
	].forEach(async (category) => {
		let i_url = api.wifi[category];
		const response = await getAjax(i_url);	
		//define data array
		var tabledata = JSON.parse(response.trim());
		// console.log(tabledata);

		//initialize table
		var table = new Tabulator("#wifi_" + category, {
			data: JSON.parse(response.trim()), //assign data to table
			autoColumns: true, //create columns from data field names
			pagination: "local",
			paginationSize: 25,
			paginationCounter:"rows",
		});
	});
});

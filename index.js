async function getAjax(i_url = "") {
	return await $.ajax(i_url, {dataType: "text"});
}

$(document).ready(async function() {
    console.log(`[index.js] init...`);

	let api = {
		wifi: {
			fixed: `./fixed-wi-fi-hk-locations.json`,
			non_fixed: `./non-fixed-wi-fi-hk-locations.json`,
		}
	};
	[
		"fixed",
		"non_fixed"
	].forEach(async (category) => {
		let i_url = api.wifi[category];
		const response = await getAjax(i_url);
		var data = JSON.parse(response.trim());
		
		Latitude
		Longitude
		// Table
		var table = new Tabulator("#wifi_" + category, {
			data: data,	//assign data to table
			autoColumns: true,					//create columns from data field names
			pagination: "local",
			paginationSize: 25,
			paginationCounter:"rows",
		});
		
		var map = L.map('map').setView([22.3193, 114.1694], 13);
		// Map
		data.forEach(dt => {
			var marker = new L.Marker([dt.Latitude, dt.Longitude]);
			marker.addTo(map);
		});
	});
});

async function getAjax(i_url = "") {
	return await $.ajax(i_url, {dataType: "text"});
}

$(document).ready(async function() {
    console.log(`[index.js] init...`);

	// Constant
	var api = {
		wifi: {
			fixed: `./fixed-wi-fi-hk-locations.json`,
			non_fixed: `./non-fixed-wi-fi-hk-locations.json`,
		}
	};
	// variable
	var map = L.map('map').setView([22.3193, 114.1694], 13);
	
	[
		"fixed",
		"non_fixed"
	].forEach(async (category) => {
		let i_url = api.wifi[category];
		const response = await getAjax(i_url);
		var data = [];
		JSON.parse(response.trim()).forEach(row => {
			data.push(
				Object.fromEntries(Object.entries(row).filter(
					([key]) => {
						return (
							!key.includes('SC') &&
								!["Latitude", "Longitude"].includes(key)
						)
					}
				))
			);
		});
		
		// Table
		var table = new Tabulator(`#wifi_${category}`, {
			data: data,			//assign data to table
			autoColumns: true,	//create columns from data field names
			pagination: "local",
			paginationSize: 25,
			paginationCounter:"rows",
		});
		
		// Map
		data.forEach(dt => {
			console.log(dt);
			let lat_lng = [
				parseFloat(dt.Latitude),
				parseFloat(dt.Longitude)
			];
			// console.log([dt.Latitude, dt.Longitude]);
			// console.log(lat_lng);
			if(![NaN].includes(NaN)) {
				var marker = new L.Marker(lat_lng);
				marker.addTo(map);
			}
		});
	});
	
	// Timestamp
	const response = await getAjax("./modified_datetime.log");
	$('#modified_datetime').html(`Modified datetime: ${response.trim()}`);
});

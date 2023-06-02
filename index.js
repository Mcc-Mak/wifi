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
	var map = L.map('map').setView([22.3193, 114.1694], 12);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; 2023-JUN'
	}).addTo(map);
	
	[
		"fixed",
		"non_fixed"
	].forEach(async (category) => {
		let i_url = api.wifi[category];
		const response = await getAjax(i_url);
		var data = [];
		JSON.parse(response.trim()).forEach(row => {
			let row_n = Object.fromEntries(Object.entries(row).filter(
				([key]) => {
					return (
						!key.includes('SC')
					)
				}
			));
			data.push(row_n);
		});
		
		// Table
		var table = new Tabulator(`#wifi_${category}`, {
			data: data,			//assign data to table
			// autoColumns: true,	//create columns from data field names
			pagination: "local",
			paginationSize: 25,
			paginationCounter:"rows",
			columns: [
				{
					"title": "OrganisationCode",
					"field": "OrganisationCode"
				},
				{
					"title": "LocationID",
					"field": "LocationID"
				},
				{
					"title": "SSID",
					"field": "SSID"
				},
				{
					"title": "SupportHotline",
					"field": "SupportHotline"
				},
				{
					"title": "LocationNameEN",
					"field": "LocationNameEN"
				},
				{
					"title": "LocationNameTC",
					"field": "LocationNameTC"
				},
				{
					"title": "AreaEN",
					"field": "AreaEN"
				},
				{
					"title": "AreaTC",
					"field": "AreaTC"
				},
				{
					"title": "DistrictEN",
					"field": "DistrictEN"
				},
				{
					"title": "DistrictTC",
					"field": "DistrictTC"
				},
				{
					"title": "AddressEN",
					"field": "AddressEN"
				},
				{
					"title": "AddressTC",
					"field": "AddressTC"
				},
				{
					"title": "Latitude",
					"field": "Latitude"
				},
				{
					"title": "Longitude",
					"field": "Longitude"
				},
				{
					"title": "VenueTypeEN",
					"field": "VenueTypeEN"
				},
				{
					"title": "VenueTypeTC",
					"field": "VenueTypeTC"
				},
				{
					"title": "NumberOfHotspots",
					"field": "NumberOfHotspots"
				},
				{
					"title": "DigitalCertificate",
					"field": "DigitalCertificate"
				},
				{
					"title": "SupportEmail",
					"field": "SupportEmail"
				},
				{
					"title": "MoreInformationEN",
					"field": "MoreInformationEN"
				},
				{
					"title": "MoreInformationTC",
					"field": "MoreInformationTC"
				},
				{
					"title": "MoreInformationLinkEN",
					"field": "MoreInformationLinkEN"
				},
				{
					"title": "MoreInformationLinkTC",
					"field": "MoreInformationLinkTC"
				},
				{
					"title": "RemarksEN",
					"field": "RemarksEN"
				},
				{
					"title": "RemarksTC",
					"field": "RemarksTC"
				},
				{
					"title": "Latitude",
					"field": "Latitude"
				},
				{
					"title": "Longitude",
					"field": "Longitude"
				},
			],
		});
		table.on("tableBuilt", function(){
			let invisible_column_list = [
				'OrganisationCode',
				'LocationID',
				'DigitalCertificate',
				'Latitude',
				'Longitude',
				'MoreInformationEN',
				'MoreInformationTC',
				'MoreInformationLinkEN',
				'MoreInformationLinkTC',
				'RemarksEN',
				'RemarksTC',
			];
			invisible_column_list.forEach(columnName => {
				table.hideColumn(columnName);
			});
		});
		table.on("cellClick", function(e, cell) {
			// Map
			let rowData = cell.getData();
			let lat_lng = [
				parseFloat(rowData.Latitude),
				parseFloat(rowData.Longitude)
			];
			var marker = L.marker(lat_lng);
			marker.addTo(map);
			map.setView(lat_lng);
		});
		
		// Map
		// data.forEach(dt => {
			// let lat_lng = [
				// parseFloat(dt.Latitude),
				// parseFloat(dt.Longitude)
			// ];
			// var marker = L.marker(lat_lng);
			// marker.addTo(map);
		// });
	});
	
	// Modified datetime
	const response = await getAjax("./modified_datetime.log");
	$('#modified_datetime').html(`Modified datetime: ${response.trim()}`);
});

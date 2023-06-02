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
			autoColumns: true,	//create columns from data field names
			pagination: "local",
			paginationSize: 25,
			paginationCounter:"rows",
			columns: [
			  {
				"field": "OrganisationCode"
			  },
			  {
				"field": "LocationID"
			  },
			  {
				"field": "SSID"
			  },
			  {
				"field": "SupportHotline"
			  },
			  {
				"field": "LocationNameEN"
			  },
			  {
				"field": "LocationNameTC"
			  },
			  {
				"field": "AreaEN"
			  },
			  {
				"field": "AreaTC"
			  },
			  {
				"field": "DistrictEN"
			  },
			  {
				"field": "DistrictTC"
			  },
			  {
				"field": "AddressEN"
			  },
			  {
				"field": "AddressTC"
			  },
			  {
				"field": "Latitude"
			  },
			  {
				"field": "Longitude"
			  },
			  {
				"field": "VenueTypeEN"
			  },
			  {
				"field": "VenueTypeTC"
			  },
			  {
				"field": "NumberOfHotspots"
			  },
			  {
				"field": "DigitalCertificate"
			  },
			  {
				"field": "SupportEmail"
			  },
			  {
				"field": "MoreInformationEN"
			  },
			  {
				"field": "MoreInformationTC"
			  },
			  {
				"field": "MoreInformationLinkEN"
			  },
			  {
				"field": "MoreInformationLinkTC"
			  },
			  {
				"field": "RemarksEN"
			  },
			  {
				"field": "RemarksTC"
			  },
			  {
				"field": "Latitude"
			  },
			  {
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
		
		// Map
		data.forEach(dt => {
			let lat_lng = [
				parseFloat(dt.Latitude),
				parseFloat(dt.Longitude)
			];
			if(![NaN].includes(NaN)) {
				var marker = new L.Marker(lat_lng);
				marker.addTo(map);
			}
		});
	});
	
	// Modified datetime
	const response = await getAjax("./modified_datetime.log");
	$('#modified_datetime').html(`Modified datetime: ${response.trim()}`);
});

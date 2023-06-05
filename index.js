async function getAjax(i_url = "") {
	return await $.ajax(i_url, {dataType: "text"});
}

function getAllUnique(data) {
	return data.filter((value, index, self) => self.indexOf(value) === index).sort();
}

function getHeaderFilterParams(data, v_type) {
	return getAllUnique(
		data.map(r => r[v_type])
	);
}

$(document).ready(async function() {
    console.log(`[index.js] init...`);

	// Constant
	const api = {
		wifi: {
			fixed: `./fixed-wi-fi-hk-locations.json`,
			non_fixed: `./non-fixed-wi-fi-hk-locations.json`,
		}
	};
	const MAX_NO_OF_WIFI_FIXED_SELECTION = 5;
	
	// variable
	var map = L.map('map').setView([22.3193, 114.1694], 12);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; 2023-JUN'
	}).addTo(map);
	
	// __MAIN__
	[
		"fixed",
		"non_fixed"
	].forEach(async (category) => {
		let i_url = api.wifi[`${category}`];
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
		let columnsDefinition = [
			{
				title: "Latitude",
				field: "Latitude",
			},
			{
				title: "Longitude",
				field: "Longitude",
			},
			{
				title: "OrganisationCode",
				field: "OrganisationCode",
			},
			{
				title: "LocationID",
				field: "LocationID",
			},
			{
				title: "SSID",
				field: "SSID",
			},
			{
				title: "SupportHotline",
				field: "SupportHotline",
			},
			{
				title: "VenueTypeEN",
				field: "VenueTypeEN",
			},
			{
				title: "VenueTypeTC",
				field: "VenueTypeTC",
			},
			{
				title: "LocationNameEN",
				field: "LocationNameEN",
			},
			{
				title: "LocationNameTC",
				field: "LocationNameTC",
			},
			{
				title: "AreaEN",
				field: "AreaEN",
			},
			{
				title: "AreaTC",
				field: "AreaTC",
			},
			{
				title: "DistrictEN",
				field: "DistrictEN",
			},
			{
				title: "DistrictTC",
				field: "DistrictTC",
			},
			{
				title: "AddressEN",
				field: "AddressEN",
			},
			{
				title: "AddressTC",
				field: "AddressTC",
			},
			{
				title: "NumberOfHotspots",
				field: "NumberOfHotspots",
			},
			{
				title: "DigitalCertificate",
				field: "DigitalCertificate",
			},
			{
				title: "SupportEmail",
				field: "SupportEmail",
			},
			{
				title: "MoreInformationEN",
				field: "MoreInformationEN",
			},
			{
				title: "MoreInformationTC",
				field: "MoreInformationTC",
			},
			{
				title: "MoreInformationLinkEN",
				field: "MoreInformationLinkEN",
			},
			{
				title: "MoreInformationLinkTC",
				field: "MoreInformationLinkTC",
			},
			{
				title: "RemarksEN",
				field: "RemarksEN",
			},
			{
				title: "RemarksTC",
				field: "RemarksTC",
			},
		];
		if(category == "fixed") {
			let columnsWithHeaderFilter = {
				wifi: {
					non_fixed: [],
					fixed: [
						"SSID",
						"VenueTypeTC",
						"VenueTypeEN",
						"LocationNameTC",
						"LocationNameEN",
						"AreaTC",
						"AreaEN",
						"DistrictTC",
						"DistrictEN",
					],
				}
			};
			for (let i=0; i<columnsDefinition.length; i++) {
				let columnObject = columnsDefinition[i];
				if(columnsWithHeaderFilter.wifi.fixed.includes(columnObject.field)) {
					columnObject["headerFilter"] = "select";
					columnObject["headerFilterFunc"] = "in";
					columnObject["headerFilterParams"] = {
						values: getHeaderFilterParams(data, `${columnObject.field}`),
						multiselect: true,
					};
				}
			}
		}
		let table = new Tabulator(`#wifi_${category}_table`, {
			data: data,			//assign data to table
			height: category == "fixed" ? 480 : null,
			pagination: "local",
			paginationSize: 25,
			paginationCounter:"rows",
			selectable: (
				category == "fixed" ?
					MAX_NO_OF_WIFI_FIXED_SELECTION :
						false
			),
			columns: columnsDefinition,
		});
		table.on("tableBuilt", function(){
			$(`#wifi_${category}_title`).html(`WiFi (${category == "non_fixed" ? "Non-" : ""}Fixed)`);
			
			let invisible_column_core = [
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
			invisible_column_core.forEach(columnName => {
				table.hideColumn(columnName);
			});
			
			let invisible_column_mapper = {
				wifi: {
					fixed: [],
					non_fixed: [
						'AreaEN',
						'AreaTC',
						'DistrictEN',
						'DistrictTC',
						'AddressEN',
						'AddressTC',
						'Latitude',
						'Longitude',
						'VenueTypeEN',
						'VenueTypeTC',
					],
				},
			};			
			invisible_column_mapper.wifi[`${category}`].forEach(columnName => {
				table.hideColumn(columnName);
			});
		});
		
		if(category == "fixed") {
			var markers = [];
			table.on("cellClick", function(e, cell) {				
				// Map
				let rowData = cell.getData();
				let lat_lng = [
					parseFloat(rowData.Latitude),
					parseFloat(rowData.Longitude)
				];
				let marked_marker = markers.filter(marker => {
					let ll_m = marker.getLatLng();
					return [ll_m.lat, ll_m.lng].toString() == lat_lng.toString();
				});
				if(marked_marker.length > 0) {
					marked_marker.forEach(marker => {
						map.removeLayer(marker);
						markers = markers.filter(m => {
							let ll_m = marker.getLatLng();
							let ll_m_d = m.getLatLng();
							return [ll_m.lat, ll_m.lng].toString() != [ll_m_d.lat, ll_m_d.lng].toString();
						});
					});
				} else {
					var marker = L.marker(lat_lng);
					marker.addTo(map);
					markers.push(marker);
				}
				if(markers.length > MAX_NO_OF_WIFI_FIXED_SELECTION) {
					map.removeLayer(markers.shift());
				}
				map.setView(lat_lng, 18);
				
				map.invalidateSize();
			});
		}
	});

	// Switch for Map
	$('#map_on_off_button').on('click', function(){
		$('#map').is(':visible') ?
			(
				$('#map').hide() &&
				$(this)
					.html('Show')
					.removeClass('btn-secondary')
					.addClass('btn-success') &&
				map.invalidateSize()
			) : (
				$('#map').show() &&
				$(this)
					.html('Hide')
					.removeClass('btn-success')
					.addClass('btn-secondary') &&
				map.invalidateSize()
			);
	});
	
	// Modified datetime
	const response = await getAjax("./modified_datetime.log");
	$('#modified_datetime').html(`${response.trim()}`);
});

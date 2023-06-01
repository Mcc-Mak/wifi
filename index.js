async function getAjax(i_url = "") {
	return await $.ajax(i_url, {dataType: "text"});
}

$(document).ready(async function() {
    console.log(`[index.js] init...`);

	const response = await getAjax(`./fixed-wi-fi-hk-locations.json`);	
	//define data array
	var tabledata = JSON.parse(response.trim());
	console.log(tabledata);

	//initialize table
	var table = new Tabulator("#example-table", {
		data: JSON.parse(response.trim()), //assign data to table
		autoColumns:true, //create columns from data field names
	});
});

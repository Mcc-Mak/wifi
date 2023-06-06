var invisible_column_core = [
  "OrganisationCode",
  "LocationID",
  "DigitalCertificate",
  "Latitude",
  "Longitude",
  "MoreInformationEN",
  "MoreInformationTC",
  "MoreInformationLinkEN",
  "MoreInformationLinkTC",
  "RemarksEN",
  "RemarksTC",
];
var invisible_column_mapper = {
  wifi: {
    fixed: [],
    non_fixed: [
      "AreaEN",
      "AreaTC",
      "DistrictEN",
      "DistrictTC",
      "AddressEN",
      "AddressTC",
      "Latitude",
      "Longitude",
      "VenueTypeEN",
      "VenueTypeTC",
    ],
  },
};

function initialize(table = null, category = "") {
  if (category == "fixed") {
    table
      .getColumns()
      .filter((e) => {
        return !invisible_column_core
          .concat(invisible_column_mapper.wifi[`${category}`])
          .includes(e._column.definition.field);
      })
      .forEach((column_o) => {
        let column = column_o._column.definition;
        $("#filter-field").append(
          `<option value="${column.field}">${column.title}</option>`
        );
      });
  }
}

function refreshHeaderFilter(table = null, category = "") {
  // Definition
  if (category == "fixed") {
    let columnsWithFilter = [
      "SSID",
      "VenueTypeEN",
      "VenueTypeTC",
      "LocationNameEN",
      "LocationNameTC",
      "AreaEN",
      "AreaTC",
      "DistrictEN",
      "DistrictTC",
    ];
    let newColumns = table.getColumns().map((column) => {
      if (columnsWithFilter.includes(column._column.definition.field)) {
        column._column.definition.headerFilter = "select";
        column._column.definition.headerFilterFunc = "in";
        column._column.definition.headerFilterParams = {
          values: table
            .getData("active")
            .map((r) => r[column._column.definition.field])
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort(),
          multiselect: true,
        };
      }
      return column._column.definition;
    });
    table.setColumns(newColumns);
  }

  // Visibility
  invisible_column_core
    .concat(invisible_column_mapper.wifi[`${category}`])
    .forEach((columnName) => {
      table.hideColumn(columnName);
    });
}

$(document).ready(async function () {
  console.log(`[index.js] init...`);

  // Constant
  const api = {
    wifi: {
      fixed: `./fixed-wi-fi-hk-locations.json`,
      non_fixed: `./non-fixed-wi-fi-hk-locations.json`,
    },
  };
  const MAX_NO_OF_WIFI_FIXED_SELECTION = 5;

  // variable
  var map = L.map("map").setView([22.3193, 114.1694], 12);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; 2023-JUN",
  }).addTo(map);

  // __MAIN__
  ["fixed", "non_fixed"].forEach(async (category) => {
    // Table
    let table = new Tabulator(`#wifi_${category}_table`, {
      ajaxURL: `${api.wifi[category]}`,
      ajaxResponse: function (url, params, response) {
        let data = response.map((row) => {
          let row_n = Object.fromEntries(
            Object.entries(row).filter(([key]) => {
              return !key.includes("SC");
            })
          );
          return row_n;
        });
        return data;
      },
      height: category == "fixed" ? 480 : null,
      pagination: "local",
      paginationSize: 25,
      paginationCounter: "rows",
      selectable: category == "fixed" ? MAX_NO_OF_WIFI_FIXED_SELECTION : false,
      columns: [
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
      ],
    });

    table.on("tableBuilt", function () {
      $(`#wifi_${category}_title`).html(
        `WiFi (${category == "non_fixed" ? "Non-" : ""}Fixed)`
      );

      initialize(table, category);

      refreshHeaderFilter(table, category);
    });

    table.on("renderComplete", function () {
      refreshHeaderFilter(table, category);
    });

    if (category == "fixed") {
      // Default condition(s)
      table.setFilter("LocationNameTC", "in", ["香港教育大學"]);

      // Event handlers
      var markers = [];
      $("#filter-clear").on("click", function () {
        table.clearFilter(true);
        table.getSelectedRows().forEach((row) => {
          let e = row._row.getCells()[0].getElement();
          e.click();
        });
        refreshHeaderFilter(table, category);
      });
      $("#filter-add").on("click", function () {
        let data = {
          field: $("#filter-field").val(),
          type: $("#filter-type").val(),
          value: $("#filter-value").val(),
        };
        console.log(`data.field: ${data.field}`);
        console.log(`data.type: ${data.type}`);
        console.log(`data.value: ${data.value}`);
        table.setFilter(data.field, data.type, data.value);
      });
      table.on("cellClick", function (e, cell) {
        // Map
        let rowData = cell.getData();
        let lat_lng = [
          parseFloat(rowData.Latitude),
          parseFloat(rowData.Longitude),
        ];
        let marked_marker = markers.filter((marker) => {
          let ll_m = marker.getLatLng();
          return [ll_m.lat, ll_m.lng].toString() == lat_lng.toString();
        });
        if (marked_marker.length > 0) {
          marked_marker.forEach((marker) => {
            map.removeLayer(marker);
            markers = markers.filter((m) => {
              let ll_m = marker.getLatLng();
              let ll_m_d = m.getLatLng();
              return (
                [ll_m.lat, ll_m.lng].toString() !=
                [ll_m_d.lat, ll_m_d.lng].toString()
              );
            });
          });
        } else {
          var marker = L.marker(lat_lng);
          marker.addTo(map);
          markers.push(marker);
        }
        if (markers.length > MAX_NO_OF_WIFI_FIXED_SELECTION) {
          map.removeLayer(markers.shift());
        }
        map.setView(lat_lng, 18);

        map.invalidateSize();
      });
    }
  });

  // Switch for Map
  $("#map_on_off_button").on("click", function () {
    $("#map").is(":visible")
      ? $("#map").hide() &&
        $(this)
          .html("Show")
          .removeClass("btn-secondary")
          .addClass("btn-success") &&
        map.invalidateSize()
      : $("#map").show() &&
        $(this)
          .html("Hide")
          .removeClass("btn-success")
          .addClass("btn-secondary") &&
        map.invalidateSize();
  });

  // Modified datetime
  const response = await $.ajax("./modified_datetime.log", {
    dataType: "text",
  });
  $("#modified_datetime").html(`${response.trim()}`);
});

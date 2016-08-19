/**
 * Created by jdenhertog on 18/08/16.
 */
import cartogram from './d3-cartogram';

import {scaleLinear} from 'd3-scale';
import {colorbrewer} from './colorbrewer';
import {nest} from 'd3-collection';
import {select, selectAll} from 'd3-selection';
import {hsl} from 'd3-color';
import {json, csv} from 'd3-request';
import {easeLinear} from 'd3-ease';
import {ascending, mean} from 'd3-array';
import {zoom as d3_zoom} from 'd3-zoom';
import {format} from 'd3-format';

import {geoPath, geoMercator} from 'd3-geo';

import * as geoProjection from 'd3-geo-projection';

// field definitions from:
// <http://www.census.gov/popest/data/national/totals/2011/files/NST-EST2011-alldata.pdf>
var percent = (function () {
        var fmt = format(".2f");
        return function (n) {
            return fmt(n) + "%";
        };
    })(),

    //

    fields = [
        {name: "(no scale)", id: "none"},
        // {name: "Census Population", id: "censuspop", key: "CENSUS%dPOP", years: [2010]},
        // {name: "Estimate Base", id: "censuspop", key: "ESTIMATESBASE%d", years: [2010]},
        {
            name: "AUTHORISATIONS",
            id: "AUTHORISATIONS",
            years: [2016],
            key: "AUTHORISATIONS%d",
            format: "+,"
        },
        {name: "Announcements", id: "announcements", years: [2016], key: "ANNOUNCEMENTS%d", format: ","},
        {
            name: "ACCURACYANNOUNCEMENTS",
            id: "ACCURACYANNOUNCEMENTS",
            years: [2016],
            key: "ACCURACYANNOUNCEMENTS%d",
            format: "+,"
        },
        {
            name: "ACCURACYANNOUNCEMENTSFILTERED",
            id: "ACCURACYANNOUNCEMENTSFILTERED",
            years: [2016],
            key: "ACCURACYANNOUNCEMENTSFILTERED%d",
            format: "+,"
        },
        {name: "FRACTIONVALID", id: "FRACTIONVALID", years: [2016], key: "FRACTIONVALID%d", format: "+,"},
        {
            name: "FRACTIONINVALIDLENGTH",
            id: "FRACTIONINVALIDLENGTH",
            years: [2016],
            key: "FRACTIONINVALIDLENGTH%d",
            format: "+,"
        },
        {
            name: "FRACTIONINVALIDLENGTHFILTERED",
            id: "FRACTIONINVALIDLENGTHFILTERED",
            years: [2016],
            key: "FRACTIONINVALIDLENGTHFILTERED%d",
            format: "+,"
        },
        {
            name: "FRACTIONINVALIDASN",
            id: "FRACTIONINVALIDASN",
            years: [2016],
            key: "FRACTIONINVALIDASN%d",
            format: "+,"
        },
        {
            name: "FRACTIONINVALIDASNFILTERED",
            id: "FRACTIONINVALIDASNFILTERED",
            years: [2016],
            key: "FRACTIONINVALIDASNFILTERED%d",
            format: "+,"
        },
        {
            name: "FRACTIONUNKNOWN",
            id: "FRACTIONUNKNOWN",
            years: [2016],
            key: "FRACTIONUNKNOWN%d",
            format: "+,"
        },
        {
            name: "SPACEANNOUNCED",
            id: "SPACEANNOUNCED",
            years: [2016],
            key: "SPACEANNOUNCED%d",
            format: "+,"
        },
        {name: "ACCURACYSPACE", id: "ACCURACYSPACE", years: [2016], key: "ACCURACYSPACE%d", format: "+,"},
        {
            name: "ACCURACYSPACEFILTERED",
            id: "ACCURACYSPACEFILTERED",
            years: [2016],
            key: "ACCURACYSPACEFILTERED%d",
            format: "+,"
        },
        {
            name: "FRACTIONSPACEVALID",
            id: "FRACTIONSPACEVALID",
            years: [2016],
            key: "FRACTIONSPACEVALID%d",
            format: "+,"
        },
        {
            name: "FRACTIONSPACEINVALIDLENGTH",
            id: "FRACTIONSPACEINVALIDLENGTH",
            years: [2016],
            key: "FRACTIONSPACEINVALIDLENGTH%d",
            format: "+,"
        },
        {
            name: "FRACTIONSPACEINVALIDLENGTHFILTERED",
            id: "FRACTIONSPACEINVALIDLENGTHFILTERED",
            years: [2016],
            key: "FRACTIONSPACEINVALIDLENGTHFILTERED%d",
            format: "+,"
        },
        {
            name: "FRACTIONSPACEINVALIDASN",
            id: "FRACTIONSPACEINVALIDASN",
            years: [2016],
            key: "FRACTIONSPACEINVALIDASN%d",
            format: "+,"
        },
        {
            name: "FRACTIONSPACEINVALIDASNFILTERED",
            id: "FRACTIONSPACEINVALIDASNFILTERED",
            years: [2016],
            key: "FRACTIONSPACEINVALIDASNFILTERED%d",
            format: "+,"
        },
        {
            name: "FRACTIONSPACEUNKNOWN",
            id: "FRACTIONSPACEUNKNOWN",
            years: [2016],
            key: "FRACTIONSPACEUNKNOWN%d",
            format: "+,"
        }



        /*
         {name: "Population Estimate", id: "popest", key: "POPESTIMATE%d"},
         {name: "Population Change", id: "popchange", key: "NPOPCHG_%d", format: "+,"},
         {name: "Births", id: "births", key: "BIRTHS%d"},
         {name: "Deaths", id: "deaths", key: "DEATHS%d"},
         {name: "Natural Increase", id: "natinc", key: "NATURALINC%d", format: "+,"},
         {name: "Int'l Migration", id: "intlmig", key: "INTERNATIONALMIG%d", format: "+,"},
         {name: "Domestic Migration", id: "domesticmig", key: "DOMESTICMIG%d", format: "+,"},
         {name: "Net Migration", id: "netmig", key: "NETMIG%d", format: "+,"},
         {name: "Residual", id: "residual", key: "RESIDUAL%d", format: "+,"},
         {name: "Birth Rate", id: "birthrate", key: "RBIRTH%d", years: [2011], format: percent},
         {name: "Death Rate", id: "deathrate", key: "RDEATH%d", years: [2011], format: percent},
         {name: "Natural Increase Rate", id: "natincrate", key: "RNATURALINC%d", years: [2011], format: percent},
         {
         name: "Int'l Migration Rate",
         id: "intlmigrate",
         key: "RINTERNATIONALMIG%d",
         years: [2011],
         format: percent
         },
         {
         name: "Net Domestic Migration Rate",
         id: "domesticmigrate",
         key: "RDOMESTICMIG%d",
         years: [2011],
         format: percent
         },
         {name: "Net Migration Rate", id: "netmigrate", key: "RNETMIG%d", years: [2011], format: percent} */
    ],
    years = [2016],
    fieldsById = nest()
        .key(function (d) {
            return d.id;
        })
        .rollup(function (d) {
            return d[0];
        })
        .object(fields),
    field = fields[0],
    year = years[0],
    colors = colorbrewer.RdYlBu[3]
        .reverse()
        .map(function (rgb) {
            return hsl(rgb);
        });

var body = select("body"),
    stat = select("#status");

var fieldSelect = select("#field")
    .on("change", function (e) {
        field = fields[this.selectedIndex];
        location.hash = "#" + [field.id, year].join("/");
    });

fieldSelect.selectAll("option")
    .data(fields)
    .enter()
    .append("option")
    .attr("value", function (d) {
        return d.id;
    })
    .text(function (d) {
        return d.name;
    });

var yearSelect = select("#year")
    .on("change", function (e) {
        year = years[this.selectedIndex];
        location.hash = "#" + [field.id, year].join("/");
    });

yearSelect.selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .attr("value", function (y) {
        return y;
    })
    .text(function (y) {
        return y;
    });

var map = select("#map"),
    /* zoom = d3_zoom()
     .translateBy(-20, 100)
     .scale(1.1)
     .scaleExtent([10.0, 1.0])
     .on("zoom", updateZoom), */
    layer = map.append("g")
        .attr("id", "layer"),
    countries = layer.append("g")
        .attr("id", "countries")
        .selectAll("path");

// map.call(zoom);
// updateZoom();

function updateZoom() {
    /* var scale = zoom.scale();
     layer.attr("transform",
     "translateBy(" + zoom.translate() + ") " +
     "scale(" + [scale, scale] + ")"); */
}

var proj = geoProjection.geoEckert3(),
    topology,
    geometries,
    rawData,
    dataById = {},
    carto = cartogram()
        .projection(proj)
        .properties(function (d) {
            return dataById[d.id];
        })
        .value(function (d) {
            return +d.properties[field];
        });

window.onhashchange = function () {
    parseHash();
};

var segmentized = location.search === "?segmentized",
    url = ["data",
        segmentized ? "us-states-segmentized.topojson" : "110m_countries_dateline_corr.topo.json"
    ].join("/");
json(url, function (topo) {
    topology = topo;
    geometries = topology.objects['110m_countries'].geometries;
    csv("data/countries-rpki.csv", function (error, data) {
        if (error) {
            throw error;
        }
        rawData = data;
        dataById = nest()
            .key(function (d) {
                return d.NAME;
            })
            .rollup(function (d) {
                return d[0];
            })
            .object(data);
        init();
    });
});

function init() {
    var features = carto.features(topology, geometries).filter(function (f) {
            if (!f.properties) {
                var geoProp = geometries.find(function (g) {
                    return g.id === f.id;
                }).properties;
                console.log('kicked: ' + geoProp.name + ' ' + f.id);
            }
            return f.properties && f;
        }),
        path = geoPath()
            .projection(proj);

    countries = countries.data(features)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("id", function (d) {
            if (!d.properties) {
                return undefined;
            }
            return d.properties.NAME;
        })
        .attr("fill", "#fafafa")
        .attr("d", path);

    countries.append("title");

    parseHash();
}

function reset() {
    stat.text("");
    body.classed("updating", false);

    var features = carto.features(topology, geometries).filter(function (f) {
            return f.properties && f;
        }),
        path = geoPath()
            .projection(proj);

    countries.data(features)
        .transition()
        .duration(750)
        .ease(easeLinear)
        .attr("fill", "#fafafa")
        .attr("d", path);

    countries.select("title")
        .text(function (d) {
            if (d.properties) {
                return d.properties.NAME;
            }
        });
}

function update() {
    var start = Date.now();
    body.classed("updating", true);

    var key = field.key.replace("%d", year),
        fmt = (typeof field.format === "function")
            ? field.format
            : format(field.format || ","),
        value = function (d) {
            return d.properties && +d.properties[key] || 0;
        },
        values = countries.data()
            .map(value)
            .filter(function (n) {
                return !isNaN(n);
            })
            .sort(ascending),
        lo = values[0],
        hi = values[values.length - 1];

    var color = scaleLinear()
        .range(colors)
        .domain(lo < 0
            ? [lo, 0, hi]
            : [lo, mean(values), hi]);

    // normalize the scale to positive numbers
    var scale = scaleLinear()
        .domain([lo, hi])
        .range([1, 1000]);

    // tell the cartogram to use the scaled values
    carto.value(function (d) {
        return scale(value(d));
    });

    // generate the new features, pre-projected
    var features = carto(topology, geometries).features.filter(function (f) {
        return f.properties && f;
    });

    // update the data
    countries.data(features)
        .select("title")
        .text(function (d) {
            return d.properties && [d.properties.NAME, fmt(value(d))].join(": ");
        });

    countries.transition()
        .duration(750)
        .ease(easeLinear)
        .attr("fill", function (d) {
            return color(value(d));
        })
        .attr("d", carto.path);

    var delta = (Date.now() - start) / 1000;
    stat.text(["calculated in", delta.toFixed(1), "seconds"].join(" "));
    body.classed("updating", false);
}

var deferredUpdate = (function () {
    var timeout;
    return function () {
        var args = arguments;
        clearTimeout(timeout);
        stat.text("calculating...");
        return timeout = setTimeout(function () {
            update.apply(null, arguments);
        }, 10);
    };
})();

var hashish = selectAll("a.hashish")
    .datum(function () {
        return this.href;
    });

function parseHash() {
    var parts = location.hash.substr(1).split("/"),
        desiredFieldId = parts[0],
        desiredYear = +parts[1];

    field = fieldsById[desiredFieldId] || fields[0];
    year = (years.indexOf(desiredYear) > -1) ? desiredYear : years[0];

    fieldSelect.property("selectedIndex", fields.indexOf(field));

    if (field.id === "none") {

        yearSelect.attr("disabled", "disabled");
        reset();

    } else {

        if (field.years) {
            if (field.years.indexOf(year) === -1) {
                year = field.years[0];
            }
            yearSelect.selectAll("option")
                .attr("disabled", function (y) {
                    return (field.years.indexOf(y) === -1) ? "disabled" : null;
                });
        } else {
            yearSelect.selectAll("option")
                .attr("disabled", null);
        }

        yearSelect
            .property("selectedIndex", years.indexOf(year))
            .attr("disabled", null);

        deferredUpdate();
        location.replace("#" + [field.id, year].join("/"));

        hashish.attr("href", function (href) {
            return href + location.hash;
        });
    }
}

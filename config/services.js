define(['jquery','text!config/queries.xml'],function($, queries) {

var Queries = {};

$(queries).find('q').each(function() {
    var id = $(this).attr('id'),
        text = $(this).text().replace(/(?:\r\n|\r|\n)/g, ' ');
    Queries[ id ]= text;
});

//console.log(Queries);

return {
    "dbName": "africafertilizer",
    "gaulLayer": "gaul0_faostat_afo_3857",
    "wdsUrl": "http://faostat3.fao.org/wds/"+
    "rest/table/json",
    "wdsUrlExportCsv": "http://faostat3.fao.org/wds/rest/exporter/streamcsv",
    //TODO update to fenix.fao.org/geoserver...

    "wmsUrl": "http://fenixapps2.fao.org/geoserver-demo",
    "sldUrl": "http://fenixapps2.fao.org/geoservices/CSS2SLD",

    "url_geoserver_wms": "http://fenix.fao.org/geoserver",
    "url_bbox": "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/bbox/layer/gaul0_faostat_afo_4326/",
    "url_spatialquery": "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/query/",

    "url_spatialquery_enc": "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/query/{sql}?geojsonEncoding=True",

    "url_geocoding": "http://fenix.fao.org/geo/fenix/geocoding/latlon/",
    "url_esrilayer": "http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}.png",
    "url_baselayer": "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    "url_osmlayer": "http://{s}.tile.osm.org/{z}/{x}/{y}.png",

    "url_events_attachments": "//fenixrepo.fao.org/afo/events/attachments/",

    "prices_international_banner": "images/prices/prices_international_banner_argus_fmb_europe.jpg",  
    "prices_international_link": "http://www.argusmedia.com/Events/Argus-Events/Europe/Fert-Euro/Home",
    "prices_international_chart": "images/prices/prices_international_chart_july2015.png",

    "map_attribution": "&copy; <a href='http://www.openstreetmap.org/copyright'>OSM contrib</a>",
    "map_marker": "images/marker-icon.png",
    "map_center": [7.188100, 22.236328],

    "dateRangeSlider": {
        prices_national: {
            defaultValues: { min: new Date(2014, 2, 0), max: new Date(2015, 6, 0) },
            bounds: { min: new Date(2010, 2, 0), max: new Date(2015, 6, 0) }
        },
        prices_detaild: {
            defaultValues: { min: new Date(2014, 7, 0), max: new Date(2015, 7, 0) },
            bounds: { min: new Date(2010, 2, 0), max: new Date(2015, 7, 0) }
        }    
    },

    "queries": Queries,

    "//BACKUP queries": {
        "home_maps_filter": "select country_code, coalesce( {field} , -1) from afo_map_slider",

        "fertilizers_tree": "select fertilizer_category_code, fertilizer_code, fertilizer_category_label, fertilizer_label from fertilizers_category join codes_fertilizers on (fertilizer = fertilizer_code) join codes_fertilizers_categories on (fertilizer_category = fertilizer_category_code) order by fertilizer_label",
        "fertilizers_country": "select distinct country_code from fertilizers_country where fertilizer_code in ( <%= ids %> )",
        "fertilizers_bycountry": "select fertilizer_label from fertilizers_country join codes_fertilizers on (codes_fertilizers.fertilizer_code = fertilizers_country.fertilizer_code) where fertilizers_country.country_code = '{id}' order by fertilizer_label",
        "fertilizers_bycrop": "select fertilizer_label from fertilizers_crop join codes_fertilizers on (codes_fertilizers.fertilizer_code = fertilizers_crop.fertilizer_code) where fertilizers_crop.crop_code = '{id}' order by fertilizer_label",

        "regions": "select country_code, country_label from codes_countries where parent_code = '' order by country_code ",
        "countries": "select country_code, country_label from codes_countries where parent_code <> '' group by country_code, country_label order by country_label", 
        "countries_withfertizers": "select DISTINCT codes_countries.country_code, codes_countries.country_label from fertilizers_country, codes_countries where codes_countries.country_code = fertilizers_country.country_code order by codes_countries.country_label",
        "crops_withfertizers": "select DISTINCT codes_crops.crop_code, codes_crops.crop_label from fertilizers_crop, codes_crops where codes_crops.crop_code = fertilizers_crop.crop_code order by codes_crops.crop_label",

        "countries_byregion": "SELECT country_code, country_label FROM codes_countries WHERE parent_code = '{id}' ",
        "countries_geojson": "SELECT ST_AsGeoJSON(geom), adm0_code, areanamee FROM spatial.gaul0_faostat_afo_4326 WHERE adm0_code IN ({ids}) ",

        "countries_groups": "SELECT country, name FROM countries WHERE value = 1 AND name IN ( <%= ids %> ) ",
        "countries_byfertilizers": "select country_code, string_agg(fertilizer_label,'|') from fertilizers_country join codes_fertilizers on (codes_fertilizers.fertilizer_code = fertilizers_country.fertilizer_code) where fertilizers_country.fertilizer_code in ( {ids} ) group by country_code",

        "data_sources": "select * from codes_data_sources "+
                      "where data_source_code <> 'ifa' AND "+
                      "data_source_code <> 'ifdc' ",

        "products": "select DISTINCT fertilizer_label, fertilizer_code from codes_fertilizers ORDER BY fertilizer_label",
        "elements": "select DISTINCT * from codes_elements WHERE element_code NOT IN ('rexp','rimp') ",

        "prices_national_countries": "select c.country_code, c.country_label from prices_national d, codes_countries c where c.country_code  = d.country_code group by c.country_code, c.country_label order by c.country_label",
        "prices_national" : "select area, item, year, month, round(cast(value AS numeric), 2) as value, unit, '' as flag, fertilizer_code from prices_national",
        "prices_national_filter" : "select area, item, year, month,  round(cast(value AS numeric), 2) as value, unit, '' as flag, fertilizer_code from prices_national where fertilizer_code in ('{fertilizer_code}') AND country_code in ('{country_code}')  and month_number between {month_from_yyyymm} and {month_to_yyyymm} ",

        "prices_national_products": "select c.fertilizer_code, c.fertilizer_label from codes_fertilizers c, prices_local d where  c.fertilizer_code = d.fertilizer group by c.fertilizer_code, c.fertilizer_label order by c.fertilizer_label ASC ",

        "prices_detailed_local_geofilter": "select market, town_location, string_agg(''||price, ',') as price, string_agg(type, ',') as type from (select market, town_location, round(cast(avg(unit_price_usd) AS numeric), 2) as price, type from prices_local where fertilizer = cast( {fertilizer_code} AS varchar) and month between {month_from_yyyymm} and {month_to_yyyymm} and country in ('{country_code}') and type in ('{market_type}') group by market, town_location, type) as data group by market, town_location",

        "prices_detailed_local_grid": "select DISTINCT country_label, market, price, type, month from (select market, country, round(cast(avg(unit_price_usd) AS numeric), 2) as price, type, month from prices_local where fertilizer = cast({fertilizer_code} AS varchar) and month between {month_from_yyyymm} and {month_to_yyyymm} and country in ('{country_code}') and type in ('{market_type}') group by market, country, month, type) data join codes_countries on (country = country_code) order by month,country_label,market asc",

        "prices_detailed_products": "select c.fertilizer_code, c.fertilizer_label from codes_fertilizers c, prices_local d where  c.fertilizer_code = d.fertilizer group by c.fertilizer_code, c.fertilizer_label order by c.fertilizer_label ASC ",

        "prices_detailed_countries": "select country, country_label from (select distinct country from prices_local) as countries join codes_countries on country = country_code group by country, country_label order by country_label ",

        "prices_international": "select nutrient, fob, string_agg(period,'|') as period, string_agg(''||value,'|') as value from (select * from prices_international where period in (select distinct period from prices_international order by period desc limit 14) order by period, index) origin group by index, nutrient, fob order by index",

        "select_from_compare": "select element_code, element_label, CASE WHEN year is null then '' else cast ( year as character varying) end as year, CASE WHEN value is null then '' else cast ( value as character varying) end  as value, CASE WHEN um is null then '' else cast ( um as character varying) end  as Unit, '' as Flag from ( select element, year, value, um from compare where data_source = '{SOURCE}' and fertilizer = '{PRODUCT}' and country = '{COUNTRY}' and n_p = '{KIND}' ) c right join codes_elements on element = element_code WHERE element<>'rimp' AND element<>'rexp' ORDER BY element ASC, year ASC",
        "select_from_compare_cstat": "select element_code, element_label, CASE WHEN year is null then '' else cast ( year as character varying) end as year, CASE WHEN value is null then '' else cast ( value as character varying) end  as value, CASE WHEN um is null then '' else cast ( um as character varying) end  as Unit, '' as Flag from ( select element, year, value, um from country_stat where fertilizer = '{PRODUCT}' and country = '{COUNTRY}' and n_p = '{KIND}' ) c right join codes_elements on element = element_code WHERE element<>'rimp' AND element<>'rexp' ORDER BY element ASC, year ASC",
        "select_from_compare_ifa": "select element_code, element_label, CASE WHEN year is null then '' else cast ( year as character varying) end as year,CASE WHEN nutrient is null then '' else cast ( nutrient as character varying) end  as nutrient,CASE WHEN value is null then '' else cast ( value as character varying) end  as Value,  CASE WHEN um is null then '' else cast ( um as character varying) end  as Unit, '' as Flag  from (     select element, year, nutrient, value, um  from ifa_data   where data_source = 'ifa' and       fertilizer = '{PRODUCT}' and       country = '{COUNTRY}' and n_p = '{KIND}'       ) c   right join codes_elements on element = element_code  WHERE element<>'rimp' AND element<>'rexp' ORDER BY element ASC, year ASC",

        "select_from_compare_chart": "select element_code, element_label, year, value, um from ( select element, year, value, um from compare where data_source = '{SOURCE}' and fertilizer = '{PRODUCT}' and country = '{COUNTRY}' and n_p = '{KIND}' ) c join codes_elements on element = element_code and element in ('appcons', 'imp', 'exp') WHERE value is not null ORDER BY element ASC, year ASC",
        "select_from_compare_chart_cstat": "select element_code, element_label, year, value, um from ( select element, year, value, um from country_stat where fertilizer = '{PRODUCT}' and country = '{COUNTRY}' and n_p = '{KIND}' ) c  join codes_elements on element = element_code WHERE value is not null ORDER BY element ASC, year ASC",

        "select_dynamic_compare": "select element_code, element_label, year, coalesce(value, -1), um from ( select element, year, value, um from compare where {WHERE} ) c right join codes_elements on element = element_code ORDER BY element ASC, year ASC",
        "product_by_source" : "select c.fertilizer_code, c.fertilizer_label from codes_fertilizers c, compare d where  d.data_source in ('{SOURCE}') and c.fertilizer_code = d.fertilizer group by c.fertilizer_code, c.fertilizer_label order by c.fertilizer_label ASC",
        "products_by_cstat": "select c.cstat_fertilizer_code, c.cstat_fertilizer_label from codes_fertilizers_cstat c, country_stat d where c.cstat_fertilizer_code = d.fertilizer group by c.cstat_fertilizer_code, c.cstat_fertilizer_label order by c.cstat_fertilizer_label ASC",

        "compare_countries": "select c.country_code, c.country_label from prices_national d, codes_countries c where c.country_code  = d.country_code group by c.country_code, c.country_label order by c.country_label",
        "compare_by_country": "SELECT cc.country_label, d.year, d.value, d.um FROM compare d, countries_unique cc WHERE d.data_source IN ('{SOURCE}') AND d.country IN ({COUNTRY}) AND d.country = cc.country_code AND d.element IN ({ELEMENT}) AND d.fertilizer IN ({PRODUCT}) AND n_p IN ('{KIND}') AND d.value IS NOT NULL ORDER BY cc.country_label ASC, d.year ASC",
        "compare_by_element": "SELECT cc.element_label, d.year, d.value, d.um FROM compare d, codes_elements cc WHERE d.data_source IN ('{SOURCE}') AND d.country IN ({COUNTRY}) AND d.element IN ({ELEMENT}) AND d.element = cc.element_code AND d.fertilizer IN ({PRODUCT}) AND n_p IN ('{KIND}') AND d.value IS NOT NULL ORDER BY cc.element_label ASC, d.year ASC",
        "compare_by_product": "SELECT cc.fertilizer_label, d.year, d.value, d.um FROM compare d, codes_fertilizers cc WHERE d.data_source IN ('{SOURCE}') AND d.country IN ({COUNTRY}) AND d.element IN ({ELEMENT}) AND d.fertilizer IN ({PRODUCT}) AND d.fertilizer = cc.fertilizer_code AND n_p IN ('{KIND}') AND d.value IS NOT NULL ORDER BY cc.fertilizer_label ASC, d.year ASC",

        "compare_pivot": "SELECT cs.data_source_label,cc.country_label,ce.element_label, cf.fertilizer_label, d.year, d.value, d.um FROM compare d inner join countries_unique cc on d.country=cc.country_code inner join codes_fertilizers cf on d.fertilizer = cf.fertilizer_code inner join codes_elements ce on d.element = ce.element_code inner join codes_data_sources cs on d.data_source = cs.data_source_code  where d.data_source IN ({SOURCE}) AND d.country IN ({COUNTRY}) AND d.element IN ({ELEMENT}) AND d.fertilizer IN ({PRODUCT}) AND n_p IN ({KIND}) AND d.value IS NOT NULL",

        "compare_by_source": "SELECT cc.data_source_label, d.year, d.value, d.um FROM compare d, codes_data_sources cc WHERE d.data_source IN ('{SOURCE}') AND d.country IN ({COUNTRY}) AND d.element IN ({ELEMENT}) AND d.fertilizer IN ({PRODUCT}) AND d.data_source = cc.data_source_code AND n_p IN ('{KIND}') AND d.value IS NOT NULL ORDER BY cc.data_source_label ASC, d.year ASC",

        "compare_by_country_cstat": "SELECT cc.country_label, d.year, d.value, d.um FROM country_stat d, countries_unique cc WHERE d.country IN ({COUNTRY}) AND d.country = cc.country_code AND d.element IN ({ELEMENT}) AND d.fertilizer IN ({PRODUCT}) AND n_p IN ('{KIND}') AND d.value IS NOT NULL ORDER BY cc.country_label ASC, d.year ASC",
        "compare_by_element_cstat": "SELECT cc.element_label, d.year, d.value, d.um FROM country_stat d, codes_elements cc WHERE d.country IN ({COUNTRY}) AND d.element IN ({ELEMENT}) AND d.element = cc.element_code AND d.fertilizer IN ({PRODUCT}) AND n_p IN ('{KIND}') AND d.value IS NOT NULL ORDER BY cc.element_label ASC, d.year ASC",
        "compare_by_product_cstat": "SELECT cc.cstat_fertilizer_label, d.year, d.value, d.um FROM country_stat d, codes_fertilizers_cstat cc WHERE d.country IN ({COUNTRY}) AND d.element IN ({ELEMENT}) AND d.fertilizer IN ({PRODUCT}) AND d.fertilizer = cc.cstat_fertilizer_code AND n_p IN ('{KIND}') AND d.value IS NOT NULL ORDER BY cc.cstat_fertilizer_label ASC, d.year ASC",

        "directory_business_country": "SELECT distinct country_code, country_name FROM directories_business order by country_name ASC",
        "directory_business_result": "select full_company_name, company_city, concat(services_0, ' ', services_1, ' ', services_2, ' ', services_3, ' ', services_4, ' ', services_5, ' ', services_6, ' ', services_7, ' ', services_8, ' ', services_9, ' ', services_10, ' ', services_11, ' ', services_12, ' ', services_13, ' ', services_14),  concat(sector_0, ' ', sector_1, ' ', sector_2, sector_3)  from directories_business where country_code IN ({COUNTRY}) AND (sector_0 IN ({SECTOR}) OR sector_1 IN ({SECTOR}) OR sector_2 IN ({SECTOR}) OR sector_3 IN ({SECTOR})) AND ( services_0 IN ({SERVICE}) OR services_1 IN ({SERVICE}) OR services_2 IN ({SERVICE}) OR services_3 IN ({SERVICE}) OR services_4 IN ({SERVICE}) OR services_5 IN ({SERVICE}) OR services_6 IN ({SERVICE}) OR services_7 IN ({SERVICE}) OR services_8 IN ({SERVICE}) OR services_9 IN ({SERVICE}) OR services_10 IN ({SERVICE}) OR services_11 IN ({SERVICE}) OR services_12 IN ({SERVICE}) OR services_13 IN ({SERVICE}) OR services_14 IN ({SERVICE}))",
        "directory_business_only_product_all" : "select full_company_name, company_city, concat(services_0, ' ', services_1, ' ', services_2, ' ', services_3, ' ', services_4, ' ', services_5, ' ', services_6, ' ', services_7, ' ', services_8, ' ', services_9, ' ', services_10, ' ', services_11, ' ', services_12, ' ', services_13, ' ', services_14), concat(sector_0, ' ', sector_1, ' ', sector_2, sector_3)  from directories_business where country_code IN ({COUNTRY}) AND ( services_0 IN ({SERVICE}) OR services_1 IN ({SERVICE}) OR services_2 IN ({SERVICE}) OR services_3 IN ({SERVICE}) OR services_4 IN ({SERVICE}) OR services_5 IN ({SERVICE}) OR services_6 IN ({SERVICE}) OR services_7 IN ({SERVICE}) OR services_8 IN ({SERVICE}) OR services_9 IN ({SERVICE}) OR services_10 IN ({SERVICE}) OR services_11 IN ({SERVICE}) OR services_12 IN ({SERVICE}) OR services_13 IN ({SERVICE}) OR services_14 IN ({SERVICE}))",
        "directory_business_only_sector_all" : "select full_company_name, company_city, concat(services_0, ' ', services_1, ' ', services_2, ' ', services_3, ' ', services_4, ' ', services_5, ' ', services_6, ' ', services_7, ' ', services_8, ' ', services_9, ' ', services_10, ' ', services_11, ' ', services_12, ' ', services_13, ' ', services_14), concat(sector_0, ' ', sector_1, ' ', sector_2, sector_3)  from directories_business where country_code IN ({COUNTRY}) AND (sector_0 IN ({SECTOR}) OR sector_1 IN ({SECTOR}) OR sector_2 IN ({SECTOR}) OR sector_3 IN ({SECTOR}))",
        "directory_business_only_country_all" : "select full_company_name, company_city, concat(services_0, ' ', services_1, ' ', services_2, ' ', services_3, ' ', services_4, ' ', services_5, ' ', services_6, ' ', services_7, ' ', services_8, ' ', services_9, ' ', services_10, ' ', services_11, ' ', services_12, ' ', services_13, ' ', services_14), concat(sector_0, ' ', sector_1, ' ', sector_2, sector_3)  from directories_business where country_code IN ({COUNTRY})",

        "pubs_reformat": "SELECT CONCAT('',publications.category), CONCAT('',publications.title),  CONCAT('',publications.description),  CONCAT('',publications.publication_date),  CONCAT('',publications.posting_date),  CONCAT('',publications.source),  CONCAT('',publications.author_name),   CONCAT('',publications.sector),  CONCAT('',publications.language),   CONCAT('',publications.region_code),   CONCAT('',publications.countries_code),   CONCAT('',publications.document_type),  CONCAT('',publications.document_size),  CONCAT('',publications.document_attachment_name),   CONCAT('',publications.document_attachment_title),   CONCAT('',publications.document_tags), CONCAT('',publications.publication_rating) FROM public.publications",
        "events_reformat": "SELECT events_view.id_events, events_view.category, events_view.date_start,events_view.date_end,events_view.description,events_view.title,events_view.long_description,events_view.nbdocs,events_view.ea_type,events_view.ea_file_name,   events_view.ea_attachment_title,   events_view.ea_attachment_size,  events_view.ea_attachment_description, events_view.venue, events_view.country FROM public.events_view",
        "events_reformat_long": "SELECT id_events,category ,date_start ,date_end ,description ,title  from events"
        }
    };
});
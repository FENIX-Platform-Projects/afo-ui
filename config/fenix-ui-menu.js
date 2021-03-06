define({
    "active": "home",
    "hiddens": [],
    "breadcrumb": {
        "active": true,
        "showHome": true,
        "container": ".fx-menu-breadcrumb"
    },
    //TODO move config contents on root
    "config": {
        "type": "fixed-top",
        "brand": {
            "target": "index.html"
        },
        "languages": [{
            "lang": "FR",
            "label": "Fr"
        }, {
            "lang": "EN",
            "label": "En"
        }],
        "items": [{
            "attrs": {
                "id": "home"
            },
            "target": "index.html",
            "label": {
                "EN": "Home",
                "FR": ""
            },
            "breadcrumbLabel": {
                "EN": "WELCOME TO THE AFRICA FERTILIZER INFORMATION PORTAL",
                "FR": ""
            }
        }, {
            "attrs": {
                "id": "statistics"
            },
            "target": "statistics.html",
            "label": {
                "EN": "Statistics",
                "FR": ""
            },
            "type": "dropdown",
            "children": [{
                "attrs": {
                    "id": "statistics_glance"
                },
                "target": "statistics_glance.html",
                "label": {
                    "EN": "At a Glance",
                    "FR": ""
                }
            }, {
                "attrs": {
                    "id": "statistics_compare"
                },
                "target": "statistics_compare.html",
                "label": {
                    "EN": "Compare",
                    "FR": ""
                }
            }]
        }, {
            "attrs": {
                "id": "prices"
            },
            "target": "#",
            "label": {
                "EN": "Prices",
                "FR": ""
            },
            "type": "dropdown",
            "children": [{
                "attrs": {
                    "id": "prices_international"
                },
                "target": "prices_international.html",
                "label": {
                    "EN": "International",
                    "FR": ""
                }
            }, {
                "attrs": {
                    "id": "prices_national"
                },
                "target": "prices_national.html",
                "label": {
                    "EN": "National",
                    "FR": ""
                }
            }, {
                "attrs": {
                    "id": "prices_detailed"
                },
                "target": "prices_detailed.html",
                "label": {
                    "EN": "Local prices",
                    "FR": ""
                }
            }]
        }, {
            "attrs": {
                "id": "directories"
            },
            "target": "directories.html",
            "label": {
                "EN": "Directories",
                "FR": ""
            },
            "type": "dropdown",
            "children": [{
                "attrs": {
                    "id": "directories_business"
                },
                "target": "directories_business.html",
                "label": {
                    "EN": "Business",
                    "FR": ""
                }
            }, {
                "attrs": {
                    "id": "directories_prod"
                },
                "target": "directories_prod.html",
                "label": {
                    "EN": "Production",
                    "FR": ""
                }
            }]
        }, {
            "attrs": {
                "id": "catalogue"
            },
            "target": "catalogue.html",
            "label": {
                "EN": "Catalogue",
                "FR": ""
            }
        }, {
            "attrs": {
                "id": "publications"
            },
            "target": "publications.html",
            "label": {
                "EN": "Publications",
                "FR": ""
            }
        }, {
            "attrs": {
                "id": "events"
            },
            "target": "events.html",
            "label": {
                "EN": "Events",
                "FR": ""
            }
        }, {
            "attrs": {
                "id": "about_us"
            },
            "target": "about_us.html",
            "label": {
                "EN": "About Us",
                "FR": ""
            }
        }],
	    "rightItems": [
			{
				"attrs": {
					"id": "login",
					"class": "afo-eldorado-icons"
				},
				"label": {
					"EN": "<span class='icojam_user'></span>",
					"FR": ""
				}
			},
			{
				"attrs": {
					"id": "logout",
					"class": "afo-eldorado-icons"
				},
				"label": {
					"EN": "<span class='icojam_user'></span>",
					"FR": ""
				}
			}			
		]
    }
});
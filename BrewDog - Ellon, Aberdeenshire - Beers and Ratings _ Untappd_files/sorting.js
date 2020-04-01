Handlebars.registerHelper('handleYourCount', function(data) {
    return data.has_had ? "drankit": "";
});

Handlebars.registerHelper('handleABV', function(data) {
    return (parseFloat(data.beer.beer_abv) != 0) ? data.beer.beer_abv+"%": "N/A";
});

Handlebars.registerHelper('handleIBU', function(data) {
    return (parseFloat(data.beer.beer_ibu) != 0) ? data.beer.beer_ibu: "N/A";
});

Handlebars.registerHelper('handleBeerRating', function(data) {
    if (parseFloat(data.beer.rating_score) != 0) {
        var rating = data.beer.rating_score;

        var htmlRatings = '<div class="caps small" data-rating="'+rating+'">';

        var wholeNumber = Math.floor(rating);

        for (i = 1; i < 6; i++) {

            var differenceRating = Math.abs(i - rating);

            if (wholeNumber >= i) {
                htmlRatings += '<div class="cap cap-100"></div>';
            } else {
                if (differenceRating >= 0 && differenceRating < 1) {
                    const roundedTenth = Math.round(10 * (1 - differenceRating)) / 10;
                    
                    if (roundedTenth == 1) {
                        htmlRatings += '<div class="cap cap-100"></div>';
                    } else {
                    const split = roundedTenth.toString().split('.');
                      if (split[1]) {
                        if (split[1].length == 1) {
                          htmlRatings += '<div class="cap cap-'+split[1]+'0"></div>';
                        } else {
                          htmlRatings += '<div class="cap cap-'+split[1]+'"></div>';
                        }
                      }
                    }   
                } else {
                    htmlRatings += '<div class="cap"></div>';
                }
            }
        }

        htmlRatings += '</div>';

        return new Handlebars.SafeString(htmlRatings);
    }
});

function _checkUrl(args) {
    return args.indexOf("?") === -1 ? "?" : "&";
}

function _checkUrlQuery() {
    return window.location.href.indexOf("?") >= 0 ? true : false;
}

function _buildUrl(_is_search, _is_filter) {
    var args = "";

    if (_is_filter) {
        if ($("#filter_picker").length !== 0) {
            if ($("#filter_picker").val() != "all") {
                args += _checkUrl(args) + "filter_type="+$("#filter_picker").val().toLowerCase();
            }
        }

        args += _checkUrl(args) + "sort="+ $(".selected_sort").html().trim();
        return args;
    }

    if ($("#style_picker").length !== 0) {
        if ($("#style_picker").val() != "all") {
            args += _checkUrl(args) + "type_id="+$("#style_picker").val();
        }
    }

    if ($("#country_picker").length !== 0) {
        if ($("#country_picker").val() != "all") {
            args += _checkUrl(args) + "country_id="+$("#country_picker").val();
        }
    }

    if ($("#brewery_picker").length !== 0) {
        if ($("#brewery_picker").val() != "all") {
            args += _checkUrl(args) + "brewery_id="+$("#brewery_picker").val();
        }
    }

    if ($("#showAll").length !== 0) {
        if ($("#showAll").is(":checked")) {
            args += _checkUrl(args) + "showAll=yes";
        }
    }

    if ($("#hasNotHadBefore").length !== 0) {
        if ($("#hasNotHadBefore").is(":checked")) {
            args += _checkUrl(args) + "hasNotHadBefore=true";
        }
    }

    if ($("#showAllBeers").length !== 0) {
        if ($("#showAllBeers").is(":checked")) {
            args += _checkUrl(args) + "showAllBeers=true";
        }
    }

    if ($("#filter_picker").length !== 0) {
        if ($("#filter_picker").val() != "all") {
            args += _checkUrl(args) + "filter_type="+$("#filter_picker").val().toLowerCase();
        }
    }

    if ($("#venue_category_picker").length !== 0) {
        if ($("#venue_category_picker").val() != "all") {
            args += _checkUrl(args) + "category_id="+$("#venue_category_picker").val().toLowerCase();
        }
    }

    if ($("#brewery_countries_picker").length !== 0) {
        if ($("#brewery_countries_picker").val() != "all") {
            args += _checkUrl(args) + "country_id="+$("#brewery_countries_picker").val().toLowerCase();
        }
    }

    if ($("#brewery_type_picker").length !== 0) {
        if ($("#brewery_type_picker").val() != "all") {
            args += _checkUrl(args) + "brewery_type_id="+$("#brewery_type_picker").val().toLowerCase();
        }
    }

    if ($(".search-text").val() != "") {
        args += _checkUrl(args) + "q="+ $(".search-text").val();
    }

    args += _checkUrl(args) + "sort="+ $(".selected_sort").html().trim();

    return args;
}


var _sendPaginatedRequest = function(_params) {
    $(".more-list-items").hide();
    $(".stream-loading").show();

    $.ajax({
        url: _apiReqsUrl+_params,
        type: "GET",
        dataType: "json",
        error: function(html)
        {
            $(".more-list-items").show();
            $(".stream-loading").hide();
            $.notifyBar({
                html: "Hmm. Something went wrong. Please try again!",
                delay: 2000,
                animationSpeed: "normal"
            });
        },
        success: function(res)
        {
            $(".stream-loading").hide();

            var source   = $("#menu-template").html();
            var template = Handlebars.compile(source);

            rawData = res.data.beers ? res.data.beers : res.data;

            if (rawData.count == 0) {
                $('.more-list-items').hide();
            } else {
                var html    = template(rawData);
                $("."+_selector).append(html);

                if (rawData.items.length >= 15) {
                    $(".more-list-items").show();
                } else {
                    $(".more-list-items").hide();
                }

                $('.format-date').each(function() {
                    $(this).html(moment($(this).attr('data-date')).format('MMM Do, YYYY'))
                })
            }
        }
    })
}

var _sendRequest = function(params, _override, _newUrl) {

    if (_shouldRefresh && !_override) {
        window.location.href = _url + params;
    } else {
        $('.menu-filter-error').hide();
        $(".menu-filter-no-results").hide();
        $(".list-container").html('<div class="graph-loader"></div><div class="loading-msg">Loading...</div>');

        $.ajax({
            url: (_newUrl ? _newUrl : _apiReqsUrl) + params,
            type: "GET",
            error: function(html)
            {
                if (_shouldRefresh) {
                    $(".more-list-items").show();
                    $(".stream-loading").hide();
                    $.notifyBar({
                        html: "Hmm. Something went wrong. Please try again!",
                        delay: 2000,
                        animationSpeed: "normal"
                    });
                } else {
                    // error handing
                    $(".menu-area").show();
                    $(".menu-header").show();
                    $(".list-container").show();
                    $('.menu-filter-error').show();
                    $(".stream-loading").hide();
                    $(".more-list-items").show();
                }
            },
            success: function(res)
            {
                 $(".stream-loading").hide();

                if (_shouldRefresh) {
                    if (res && res != "") {
                        $("."+_selector).append(res);
                        $('.more-list-items').show();

                        $("img.lazy").lazyload({
                            threshold : 800,
                            effect : "fadeIn",
                            effectspeed: 800
                        });

                    } else {
                        $('.more-list-items').hide();
                    }
                } else {
                    if (res.error) {
                        $(".list-container").show();
                        $('.menu-filter-error').show();
                        $(".more-list-items").show();
                    } else {

                        var source   = $("#menu-template").html();
                        var template = Handlebars.compile(source);

                        rawData = res.data.beers ? res.data.beers : res.data;

                       if (rawData.count == 0) {
                            $(".list-container").hide();
                            $(".menu-filter-no-results").show();
                            $('.more-list-items').hide();
                        } else {
                            var html    = template(rawData);
                            $("."+_selector).html(html);

                            $("img.lazy").lazyload({
                                threshold : 800,
                                effect : "fadeIn",
                                effectspeed: 800
                            });

                            if (rawData.items.lentgh >= 15) {
                                $(".more-list-items").show();
                            } else {
                                $(".more-list-items").hide();
                            }

                            $('.format-date').each(function() {
                                $(this).html(moment($(this).attr('data-date')).format('MMM Do, YYYY'))
                            })

                            $("."+_selector).show();
                        }
                    }
                }




            }
        })
    }
}

$(document).ready(function() {

    if (_shouldRefresh && _checkUrlQuery()) {
        $(".filter-toggle").addClass("active");
        $(".menu-filter-options").slideDown();
    }

    var _sort = $('.selected_sort').html().trim();

    if (_sort != "") {
        $(".sort-items[data-sort-key='"+_sort+"'] span").addClass("active");
    }

    $(".filter-toggle").on("click", function() {
        if ($(".menu-filter-options").is(":visible")) {
            $(".filter-toggle").removeClass("active");
            $(".menu-filter-options").slideUp();
        } else {
            $(".filter-toggle").addClass("active");
            $(".menu-filter-options").slideDown();
        }
    });

    $('.more-list-items').on('click', function() {
        $(this).hide();

        if (_shouldRefresh) {
            $(".stream-loading:last").show();
        } else {
            $(".stream-loading").show();
        }

        var params = _buildUrl();

        if (_shouldRefresh) {
            _newUrl = _apiReqsUrl + "/"+$("."+_item_selector).length+params;
        } else {
            if (params.indexOf("?") >= 0) {
                params += "&offset="+$("."+_item_selector).length;
            } else {
                params += "?offset="+$("."+_item_selector).length;
            }
        }

        if (_shouldRefresh) {
            _sendRequest("", true, _newUrl);
        } else {
            _sendPaginatedRequest(params);
        }

        return false;
    })

    $(".clear-sorting-filter").on("click", function() {
        if (_shouldRefresh) {
            window.location.href = _url;
        } else {
            _sendRequest("");
            $(".more-list-items").hide();
        }
    });

    $(".clear-search").on("click", function() {
        $(".search-text").val('');
        if ($(".menu-filter-options").is(":visible")) {
            var params = _buildUrl();
            _sendRequest(params);
        }
    });

    $(".search-form").on("submit", function() {
        var params = _buildUrl(true);
        _sendRequest(params);

        return false;
    });

    $(".filter-toggles select").on("change", function() {

        var _id = $(this).attr("id");
        var _selectedText = $("#"+_id+" option:selected").text();
        var removeCounterText = _selectedText.split("(");
        $(this).parent().find("span:first").html(removeCounterText[0].trim());

        if ($(this).attr("id") == "filter_picker") {
            console.log("yes");
            var params = _buildUrl(false, true);
        } else {
            var params = _buildUrl();
        }

        _sendRequest(params);
    });

    $(".menu-sorting li.sort-items").on('click', function() {
        $(".sort-items span").removeClass("active");
        var _key = $(this).attr('data-sort-key');

        $(this).find("span").addClass("active");

        $(".selected_sort").html(_key);

        var params = _buildUrl();
        _sendRequest(params);
    });
});
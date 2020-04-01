$(document).ready(function() {
	
	if ($(".sidebar").is(":visible")) {
		var hC = $(".sidebar").height() + 64;
		$(".main").css("min-height", hC);
	}


	$(".read-less").on("click", function() {
		$(".beer-descrption-read-less").hide();
		$(".beer-descrption-read-more").show();
		return false;
	});

	$(".read-more").on("click", function() {
		$(".beer-descrption-read-more").hide();
		$(".beer-descrption-read-less").show();
		return false;
	});

	$(document).on("click", ".read-more-beerlist", function() {
		var bid = $(this).attr('data-bid');
		$(".desc-half-"+bid).hide();
		$(".desc-full-"+bid).show();
		return false;
	})

	$(document).on("click", ".read-less-beerlist", function() {
		var bid = $(this).attr('data-bid');
		$(".desc-full-"+bid).hide();
		$(".desc-half-"+bid).show();
		return false;
	})

	$(".like-btn").on("click", function() {
		var _this = $(this);
		var uid = $(_this).attr("data-uid");
		var _url = "";
		if ($(_this).attr("data-like") == "like") {
			$(_this).removeClass("yellow").addClass("grey").html("Unlike this Brewery");
			_url = "/apireqs/likebrewery/"+uid+"/like";
		}
		else {
			$(_this).removeClass("grey").addClass("yellow").html("Like this Brewery");
			_url = "/apireqs/likebrewery/"+uid+"/unlike";
		}

		$.ajax({
			url: _url,
			type: "GET",
			dataType: "json",
			error: function(xhr)
			{
				if ($(_this).attr("data-like") == "like") {
					$(_this).removeClass("grey").addClass("yellow").html("Like this Brewery");
				}
				else {
					$(_this).removeClass("yellow").addClass("grey").html("Unlike this Brewery");
				}

				$.notifyBar({
					html: "Hmm. Something went wrong. Please try again!",
					delay: 2000,
					animationSpeed: "normal"
				});
			},
			success: function(html)
			{
				if (html.status == "OK") {
					if ($(_this).attr("data-like") == "like") {
						$(_this).attr('data-like', 'unlike');
					}
					else {
						$(_this).attr('data-like', 'like');
					}
				}
				else {
					if ($(_this).attr("data-like") == "like") {
						$(_this).removeClass("grey").addClass("yellow").html("Like this Brewery");
					}
					else {
						$(_this).removeClass("yellow").addClass("grey").html("Unlike this Brewery");
					}

					$.notifyBar({
						html: html.error,
						delay: 2000,
						animationSpeed: "normal"
					});

				}
			}
		});

		return false;
	});

	$(".more_checkins_logged").on("click", function() {
		var _this = $(this);
		$(_this).hide();
		$(".stream-loading").addClass("active");

		var filter = $(this).attr("data-filter");
		var offset = $("#main-stream .item:last").attr('data-checkin-id');
		var breweryid = $(this).attr("data-brewery-id");

		$.ajax({
			url: "/brewery/more_feed/"+breweryid+"/"+offset+"?filter="+filter,
			type: "GET",
			error: function(xhr)
			{
				$(".stream-loading").removeClass("active");
				$(_this).show();
				$.notifyBar({
					html: "Hmm. Something went wrong. Please try again!",
					delay: 2000,
					animationSpeed: "normal"
				});
			},
			success: function(html)
			{
				$(".stream-loading").removeClass("active");

				if (html == "") {
					$(".more_checkins").hide();
				}
				else {
					$(_this).show();
					$("#main-stream").append(html);
					$("img.lazy").lazyload();					
                    $(".tip").tipsy({fade: true});
					refreshTime(".timezoner", "D MMM YY");
				}
			}
		});

		return false;
	});
});

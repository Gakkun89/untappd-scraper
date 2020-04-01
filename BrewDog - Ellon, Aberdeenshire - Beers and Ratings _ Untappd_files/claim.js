var Claim = {
	go_next: function(a){
		$(".claim-step").hide();
		$("#claim-step-"+a).show();
	},
	close: function(){
		$.facybox.close();
	},
	check_email: function(a,c) {
		if (parseInt(a) != 5) {

			var b = $(c).val();

			if (b.indexOf("@gmail") >= 0 || b.indexOf("@yahoo") >= 0 || b.indexOf("@hotmail") >= 0 || b.indexOf("@outlook") >= 0) {
				$("#personalemail").show();
				$("#personalemail").focus();
			}
			else {
				$("#personalemail").hide();
			}

		}
	},
	open_approve: function(){
		$.facybox({div: "#claimApprove"});
		$(".close").hide();
	},
	open_reject: function(){
		$.facybox({div: "#claimReject"});
		$(".close").hide();
	},
	toggleIntro: function(a, b){
		$(".intro-details").hide();
		$("#"+a).show();
		
		$(".intro-tabs li").each(function(){
			$(this).removeClass("active");
		});
		
		$(b).parent().addClass('active');
		
	},
	update: function(a){
		$(a).parent().hide();
		$(".loading").show();
		$("#info_form").submit();
	},
	cancel_approve: function(){
		$(".response-bad-approve").hide();
		$(".response-good-approve").hide();
		$(".check-name").show();
		$(".big-approve-btn").hide();
		$.facybox.close();
	},
	addToBox: function(a){
		var text = $(a).val();
		
		$(".namehere").html(text);
	},
	checkSlug: function(){
		var un = $(".slug:last").val();
	
		$(".response-bad-approve").hide();
		$(".response-good-approve").hide();
	
		if (un == "" || un == "undefined")
		{
			$(".response-bad-approve span").html("You must enter a username. Please try again.");
			$(".response-bad-approve").show();
		}
		else
		{
			$(".check-name").hide();
			$(".loader").show();
			
			$.ajax({
				url: "/claim/check_user/"+un,
				type: "GET",
				dataType: "json",
			    error: function(html)
				{
					$(".loader").hide();
					$(".approve-btns").show();
	
					$(".response-bad-approve span").html("Oh no! Something went wrong! Please try again.");
					$(".response-bad-approve").show();
				},
				success: function(html)
				{
					$(".loader").hide();
			
					
					if (html.result == "success")
					{
						$(".response-good-approve span").html("Great! That username is available!");
						$(".response-good-approve").show();
						$(".check-name").hide();
						$(".big-approve-btn").show();
					}
					else
					{
						$(".check-name").show();
						
						$(".response-bad-approve span").html(html.msg);
						$(".response-bad-approve").show();
					}
				}
			});
		}
		
		

	},
	approve: function(a,b){
		
		$(".approve-btns").hide();
		$(".loader").show();
		$(".response-bad-approve").hide();
		$(".response-good-approve").hide();
		
		var args = "slug=" + $(".slug:last").val();
		
		$.ajax({
			url: "/admin/claim/approve/"+a,
			type: "POST",
			data: args,
			dataType: "json",
		    error: function(html)
			{
				$(".loader").hide();
				$(".approve-btns").show();
				
				
				$(".response-bad-approve span").html("Oh no! Something went wrong! Please try again.");
				$(".response-bad-approve").show();
			},
			success: function(html)
			{
				if (html.result == "success")
				{
					window.location.href = "/admin/claim?me=open";
				}
				else
				{
					$(".loader").hide();
					$(".approve-btns").parent().show();
					
					$(".response-bad-approve span").html(html.msg);
					$(".response-bad-approve").show();
				}
			}
		});
	},
	reject: function(a,b){
		
		$(".reject-btns").parent().hide();
		$(".loader").show();
		$(".response-bad-reject").hide();
		
		var args = $(".reject-claim-form:last").serialize();
		
		$.ajax({
			url: "/admin/claim/reject/"+a,
			type: "POST",
			data: args,
			dataType: "json",
		    error: function(html)
			{
				$(".loader").hide();
				$(".reject-btns").parent().show();

				$(".response-bad-approve span").html("Oh no! Something went wrong! Please try again.");
				$(".response-bad-approve").show();
			},
			success: function(html)
			{
				if (html.result == "success")
				{
					window.location.href = "admin/claim/edit/"+a+"?edit=true";
				}
				else
				{
					$(".loader").hide();
					$(".reject-btns").parent().show();
					
					$(".response-bad-reject span").html(html.msg);
					$(".response-bad-reject").show();
				}
			}
		});
	},
	request: function(a){
		
		Claim.toggle("true", a);
		
		var args = $("#claim-form").serialize();
		
		$.ajax({
			url: "/claim/request",
			type: "POST",
			data: args,
			dataType: "json",
		    error: function(html)
			{
				Claim.toggle("false", a);
				var tct = "Hmm, that didn't appear to work. Can you please try again?";
				$("#response-bad").html(tct);
				$("#response-bad").show();
			},
			success: function(html)
			{
				if (html.result == "success")
				{
					$("#claim-loader").hide();
					Claim.go_next(3);
				}
				else
				{
					Claim.toggle("false", a);
					$("#response-bad").html(html.msg);
					$("#response-bad").show();
				}
			}
		});
	},
	toggle: function(a, b){
		
		$("#response-bad").hide();
		if (a == "true")
		{
			$(b).hide();
			$(".loading").show();
		}
		else
		{
			$(".loading").hide();
			$(b).show();
		}
	}
}
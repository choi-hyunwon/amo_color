$(function () {

	// 링크용 함수
	// ex)   <div data-href="http://google.com">
	// ex)   <div data-href="todayStudy.htm">
	// ex)   <div data-href="todayStudy.htm, window_name"> // 새창
	// ex)   <div data-href="todayStudy.htm, _blank"> // 새창
	$("body").on("click", "[data-href]", function () {
		var href = $(this).attr("data-href");
		if (!href) return;
		href = href.split(",").map(function (item) { return item.trim(); });
		if (href.length > 1) {
			window.open(href[0], href[1]);
		} else {
			location.href = href[0];
		}
	});


	// 큰 탭
	$(".tabs li").on("click", function(){
		$(this).addClass("on").siblings().removeClass("on");
		var $tabContents = $("#" + $(this).parent(".tabs").attr("data-tab-id"));
		if (!$tabContents.length) return;
		var index = $(this).index();
		$tabContents.children().hide();
		$tabContents.children().eq(index).show();
	});

	// 버튼형 탭
	$(".buttonTabs button").on("click", function() {
		var index = $(this).index();
		$(this).addClass("on").siblings().removeClass("on");
		var $tabContents = $(this).parents(".buttonTabs").next(".buttonTabsContents");
		if (!$tabContents.length) return;
		$tabContents.children().hide();
		$tabContents.children().eq(index).show();
	});
	
	// 헤더 뒤로가기 버튼 (레이어 닫기)
	$("body").on("click", ".layer header .backArrow", function () {
		hideLayer($(this));
	});

	// 좋아요, 북마크 토글
	$(".snsLikeIcon, .snsBookmarkIcon, .snsSmallLikeIcon").click(function(){
		$(this).toggleClass("on");
	});

	// 사진 스크롤시 하단 표시버튼 변경
	$(".listPhoto").scrollEnd(function($this){
		var scrollLeft = $this[0].scrollLeft;
		var itemWidth = $(window).width();
		var index = Math.round(scrollLeft / itemWidth);
		var $scrollBox = $this.next(".productScrollButtons");
		if (!$scrollBox.length) return;
		$scrollBox.children().eq(index).addClass("on").siblings().removeClass("on");
	}, 100);
	
	// 사진 스크롤시 하단 표시버튼 변경
	$(".season_slider .sdw").scrollEnd(function($this){
		var scrollLeft = $this[0].scrollLeft;
		var itemWidth = $this.children(".box").outerWidth(true);
		var index = Math.round(scrollLeft / itemWidth);
		var $scrollBox = $this.next(".sldidc");
		if (!$scrollBox.length) return;
		$scrollBox.children().eq(index).addClass("on").siblings().removeClass("on");
	}, 100);
});

// 레이어 보이기
function showLayer($element, title) {
	var $layer;
	if (typeof ($element) == "string") $element = $($element);
	if ($element.hasClass("layer")) {
		$layer = $element;
	} else {
		$layer = $element.parents(".layer");
	}
	if (title) {
		$layer.find("header h1").text(title);
	}
	if ($layer.length) {
		console.log("Layer id : " + $layer.attr("id"));
		$layer.addClass("show");
	} else {
		console.error("Can not find the layer.", $element);
	}
}

// 레이어 닫기
function hideLayer($element) {
	var $layer;
	if (typeof ($element) == "string") $element = $($element);
	if ($element.hasClass("layer")) {
		$layer = $element;
	} else {
		$layer = $element.parents(".layer");
	}
	if ($layer.length) $layer.removeClass("show");
}

// 퍼스널 컬러 그래프 만들기
function setColorChart(color_data) {
	var cx, cy;
	var $svg = $("svg");
	cx = $svg.width() / 2;
	cy = $svg.height() / 2;

	var last = 0;
	for (var key in color_data) {
		if (!color_data.hasOwnProperty(key)) continue;
		if (!color_data[key]) continue;
		var angle = color_data[key] / 100 * 360 + last;
		if (angle >= 360) angle = 359.99;
		var d = describeArc(cx, cy, 80, last, angle);
		var $path = $("svg ." + key);
		$path.attr("d", d);
		last = angle;
	}
}

// 단위변환용
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	};
}

// d attribute 생성
function describeArc(x, y, radius, startAngle, endAngle) {
	var start = polarToCartesian(x, y, radius, endAngle);
	var end = polarToCartesian(x, y, radius, startAngle);

	var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

	var d = [
		"M", start.x, start.y,
		"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ");

	return d;
}

function showBlackAlert(string, time) {
	if (!time) time = 2000;
	$(".blackAlert").html(string);
	$(".blackAlert").css("bottom", 16);
	setTimeout(function(){
		$(".blackAlert").css("bottom", -100);
	}, time);
}

// 스크롤 엔드 이벤트 생성
$.fn.scrollEnd = function(callback, timeout) {          
	$(this).scroll(function(){
		var $this = $(this);
		if ($this.data('scrollTimeout')) {
			clearTimeout($this.data('scrollTimeout'));
		}
		$this.data('scrollTimeout', setTimeout(function(){
			callback($this);
		}, timeout));
	});
};

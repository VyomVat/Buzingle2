
//Declare Globals
mode = 1;
animID = 0;
count = 0;
WW = 1200;
HH = 600;
LL = 0;
TT = 0;
isActive = false;
pencolor = "#FF0000";
picJoket = "frog.png";
plots = [];
myCanvas = null;
ctx = null;
channel = 'jokoData';
jokoConfig = null;
JW = 50;
JH = 30;
JCNT = 15;
spriteJoket = "frog9-sheet3.gif";
soundJocket = "gas.mp3";
pubnub = null;
player = null;




/* 	<!-- Instantiate PubNub --> */
pubnub = PUBNUB.init({
	publish_key: 'pub-c-18917a5c-e61c-4df2-ade0-1040e52b52b8',
	subscribe_key: 'sub-c-68bc8e34-316e-11e5-89d5-0619f8945a4f'
});
pubnub.subscribe({
	channel: channel,
	callback: drawFromStream,
	presence: function(m) {
		if (m.occupancy > 1) {
			//Handle Diplay of users
		}
	}
}); 



$(document).ready(function() {

	//Set Globals
	myCanvas = document.getElementById("myCanvas");
	ctx = myCanvas.getContext("2d");

	WW = myCanvas.offsetWidth;
	HH = myCanvas.offsetHeight;
	myCanvas.width = WW;
	myCanvas.height = HH;


	$('ul.tabs li').mousemove(function() {
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#" + tab_id).addClass('current');
	});

	$('div.tab-content').mouseleave(function() {
		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');
	});


	$('ul.tabs li').removeClass('current');
	$('.tab-content').removeClass('current');


	//Build Tabs from configured values
	$.getJSON("config.json", function(result) {
        $.each(result.pics, function (i, field) {
            //alert(i);
			$("#picList").append("<div class='pickDiv' onclick='setMode(2,&quot;" + field.main + "&quot;)'><img class='pickDiv' id='" + field.id + "' src='img/" + field.thumb + "'/></div>");
		});
		$.each(result.sprites, function(i, field) {
			$("#spriteList").append("<div class='pickDiv' onclick='setMode(3,&quot;" + field.main + "&quot;," + field.jw + "," + field.jh + "," + field.jc + ")'><img class='pickDiv' id='" + field.id + "' src='img/" + field.thumb + "'/></div>");
		});
		$.each(result.sounds, function(i, field) {
			$("#soundList").append("<div class='pickDiv' style='background:yellow' onclick='setMode(4,&quot;" + field.main + "&quot;)'>" + field.name + "</div>");
		});
	});
});


window.onload = function() {

	//Set Sizes and positions of frame and canvas
	$("#myCanvas").css({
		'height': HH + 'px',
		'width': WW + 'px',
		'left': LL + 'px',
		'top': TT + 'px'
	});
	$("#jokoFrame").css({
		'height': HH + 'px',
		'width': WW + 'px'
	});
	$("#frameDiv").css({
		'left': LL + 'px',
		'top': TT + 'px'
	});

	// Mouse Event Handlers
	/*
	if (myCanvas) {
		var isDown = false;
		var canvasX, canvasY;
		ctx.lineWidth = 3;

		$(myCanvas)
			.mousedown(function(e) {
				if (mode == 1) {
					isActive = true;
				}
			})
			.mousemove(function(e) {
				if (isActive !== false && mode == 1) {
					drawJoko(e);
				}
			})
			.mouseup(function(e) {
				if (mode == 1) {
					isActive = false;

					//Send data to pubnub stream
					pubnub.publish({
						channel: channel,
						message: {
							m: mode,
							pen: pencolor,
							plots: plots
						}
					});
					plots = [];
				}
			})


		.click(function(e) {
			canvasX = e.pageX - myCanvas.offsetLeft;
			canvasY = e.pageY - myCanvas.offsetTop - 110;
			if (mode == 2) {
				/* 				canvasX = e.pageX - myCanvas.offsetLeft;
				canvasY = e.pageY - myCanvas.offsetTop; */

				var imageObj = new Image();
				imageObj.onload = function() {
					ctx.drawImage(imageObj, canvasX, canvasY);
				};
				imageObj.src = 'img/' + picJoket;

				pubnub.publish({
					channel: channel,
					message: {
						m: mode,
						x: canvasX,
						y: canvasY,
						p: picJoket
					}
				});

			}

			if (mode == 3) {

				/* 				canvasX = e.pageX - myCanvas.offsetLeft;
				canvasY = e.pageY - myCanvas.offsetTop; */

				var spriteObj = new Image();
				spriteObj.onload = function() {
					animID = requestAnimationFrame(function(timestamp) {
						drawSprite(ctx, spriteObj, canvasX, canvasY, JW, JH, JCNT);
					});
				};
				spriteObj.src = 'img/' + spriteJoket;

				pubnub.publish({
					channel: channel,
					message: {
						m: mode,
						x: canvasX,
						y: canvasY,
						p: spriteJoket,
						w: JW,
						h: JH,
						c: JCNT
					}
				});
			}
			if (mode == 4) {
				var snd = new Audio("img/" + soundJocket); // buffers automatically when created
				snd.play();
				pubnub.publish({
					channel: channel,
					message: {
						m: mode,
						s: soundJocket
					}
				});
			}
			if (mode == 5) {
				/* 				canvasX = e.pageX - myCanvas.offsetLeft;
				canvasY = e.pageY - myCanvas.offsetTop -  110; */
				var txt = $("#txtComment").val();
				ctx.font = "bold 22px sans-serif";
				ctx.fillText(txt, canvasX, canvasY);
				pubnub.publish({
					channel: channel,
					message: {
						m: mode,
						x: canvasX,
						y: canvasY,
						t: txt
					}
				});
			}

		});
	}
	*/

	// Touch Events Handlers
	draw = {
		started: false,
		start: function(evt) {

			ctx.beginPath();
			ctx.moveTo(
				evt.touches[0].pageX,
				evt.touches[0].pageY);

			this.started = true;

		},
		move: function(evt) {

			if (this.started) {
				ctx.lineTo(
					evt.touches[0].pageX,
					evt.touches[0].pageY);
				ctx.strokeStyle = "#FF0000";
				ctx.lineWidth = 5;
				ctx.stroke();
			}

		},
		end: function(evt) {
			this.started = false;
			pubnub.publish({
				channel: channel,
				message: {
					m: mode,
					pen: pencolor,
					plots: plots
				}
			});
		}
	};

	// Touch Events
	myCanvas.addEventListener('touchstart', draw.start, false);
	myCanvas.addEventListener('touchend', draw.end, false);
	myCanvas.addEventListener('touchmove', draw.move, false);

	// Disable Page Move
	document.body.addEventListener('touchmove', function(evt) {
		evt.preventDefault();
	}, false);
};



//----- Helper Functions -------------------- //

//Draws line
function drawJoko(e) {
	if (!isActive) return;
	// cross-browser canvas coordinates
	var x = e.offsetX || e.layerX - canvas.offsetLeft;
	var y = e.offsetY || e.layerY - canvas.offsetTop;
	plots.push({
		x: x,
		y: y
	});
	drawOnCanvas(plots, pencolor);
}

function drawOnCanvas(plots, pen) {
	ctx.beginPath();
	ctx.moveTo(plots[0].x, plots[0].y);
	for (var i = 1; i < plots.length; i++) {
		ctx.lineTo(plots[i].x, plots[i].y);
	}
	ctx.strokeStyle = pen;
	ctx.stroke();
}

//To be used for multuser functionality
function drawFromStream(message) {

	if (!message) return;
	if (message.m == 1) {
		ctx.beginPath();
		drawOnCanvas(message.plots, message.pen);
	}
	if (message.m == 2) {
		var imageObj = new Image();
		imageObj.onload = function() {
			ctx.drawImage(imageObj, message.x, message.y);
		};
		//imageObj.src = '../joko/img/frog9.gif';
		imageObj.src = 'img/' + message.p;
	}
	if (message.m == 3) {
		var spriteObj = new Image();
		spriteObj.onload = function() {
			animID = requestAnimationFrame(function(timestamp) {
				drawSprite(ctx, spriteObj, message.x, message.y, message.w, message.h, message.c);
			});
		};
		spriteObj.src = 'img/' + message.p;
	}
	if (message.m == 4) {
		var snd = new Audio("img/" + message.s); // buffers automatically when created
		snd.play();
	}
	if (message.m == 5) {
		ctx.font = "bold 22px sans-serif";
		ctx.fillText(message.t, message.x, message.y);
	}
	if (message.m == 100) {
		if (message.pc == 1) {
			player.playVideo();
		}
		if (message.pc == 2) {
			player.stopVideo();
		}
		if (message.pc == 3) {
			player.pauseVideo();
		}
		if (message.pc == 4) {
			player.seekTo(message.t);
		}
	}
}

//Load you tube vid in frame
function loadURL() {
	var data = $("#txtURL").val();
	if (data === "") {} else {
		var arr = data.split('v=');
		data = arr[1];
		if (data === "") {} else {
			$("#jokoFrame").attr('src', 'https://www.youtube.com/embed/' + arr[1]);
		}
	}
}

//Clears the canvas
function clearJoko() {
	var myCanvas = document.getElementById("myCanvas");
	var ctx = myCanvas.getContext("2d");
	ctx.clearRect(0, 0, WW, HH);
}

//Set current joket drawing
function setMode(val, p, w, h, c) {
	if (animID !== 0) {
		cancelAnimationFrame(animID);
	}
	mode = val;
	if (p === null) {} else {
		if (mode === 1) pencolor = p;
		if (mode === 2) picJoket = p;
		if (mode === 3) {
			spriteJoket = p;
			JW = w;
			JH = h;
			JCNT = c;
		}
		if (mode == 4) soundJocket = p;
	}
	$('ul.tabs li').removeClass('current');
	$('.tab-content').removeClass('current');
}

//Draws sprite
function drawSprite(ctx, img, x, y, imgW, imgH, imgCnt) {

	for (i = 0; i < 10000000; i++) {
		i = i;
	}
	animID = requestAnimationFrame(function(timestamp) {
		drawSprite(ctx, img, x, y, imgW, imgH, imgCnt);
	});
	ctx.clearRect(x, y, imgW, imgH);
	ctx.drawImage(img, imgW * count, 0, imgW, imgH, x, y, imgW, imgH);
	if (count == (imgCnt - 1))
		count = 0;
	else
		count++;
}


//Create YT player object

function onYouTubeIframeAPIReady() {
	player = new YT.Player('jokoFrame', {
		events: {
			//'onReady': onPlayerReady,
			//'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	//alert(2);
	event.target.playVideo();
}
var done = false;

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
		setTimeout(stopVideo, 6000);
		done = true;
	}
}

function stopVideo() {
	player.stopVideo();
	pubnub.publish({
		channel: channel,
		message: {
			m: 100,
			pc: 2
		}
	});
}

function pauseVideo() {
	player.pauseVideo();
	pubnub.publish({
		channel: channel,
		message: {
			m: 100,
			pc: 3
		}
	});
}

function forwardVideo() {
	player.seekTo(player.getCurrentTime() + 1);
	var tm = player.getCurrentTime();
	pubnub.publish({
		channel: channel,
		message: {
			m: 100,
			pc: 4,
			t: tm
		}
	});
}

function rewindVideo() {
	player.seekTo(player.getCurrentTime() - 1);
	var tm = player.getCurrentTime();
	pubnub.publish({
		channel: channel,
		message: {
			m: 100,
			pc: 4,
			t: tm
		}
	});
}

function startVideo() {
	player.playVideo();
	pubnub.publish({
		channel: channel,
		message: {
			m: 100,
			pc: 1
		}
	});
}

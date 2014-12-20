//youkaimapようかいまっぷ
//http://www.youkaimap.freeiz.com/

(function($){
	$.fn.WaWS = function(options){
		
		options = $.extend({
			warp:3,							//vertical panels count. (default:3)
			woof:3,							//horizontal panels count. (default:3)
			data:[],						//content data. {image:'(URL string)',url:'(URL string or null)',title:'(string *Unique*)'},{...}
			launch:5,						//moved endpoint panel. counting from the upper-left 1, 2, 3, ... (default:5)
			speed:300,						//slide speed. (default:300)
			spped_ajust:100,					//adjust moving speed (default:50)
			panel_size:100,					//panel size. (default:100)
			auto_slide:{
				auto_run:false,				//auto movement of the panel. true or false (default:false)
				order:'forward',			//moving direction of content data. 'forward' or 'back' or 'random' (default:forward)
				interval:10000				//interval of auto movement (default:10000)
			},
			view:{
				width:300,					//ViewWindow width size. (default:300)
				height:300,					//ViewWindow height size. (default:300)
				image_max_width:280,		//drawing image max-width size. (default:280)
				image_max_height:280,		//drawing image max-height size. (default:280)
				interval:5000,				//time from open to close. (default:5000)
				open_url_target:'_blank',	//onClick target. '_blank' or '_self' or 'other name' (default:'_blank')
				close:true					//show close button. true or false (default:true)
			}
		},options);
		
		var waws = this;
		var blockid = "#"+$(this).attr('id');
		
		if(options.warp <= 0){
			options.warp = 1;
		}
		if(options.woof <= 0){
			options.woof = 1;
		}
		if(options.launch > options.warp*options.woof || options.launch <= 0){
			options.launch = 1;
		}
		
		var slide_speed = options.speed;
		var block_w = options.woof*options.panel_size+"px";
		var block_h = options.warp*options.panel_size+"px";
		var launch_p = options.launch;
		var z_p_warp;
		var z_p_woof;
		var idle = 1;
		var select_p = [];
		var last_way = Math.floor(Math.random()*2);
		$(blockid).css({
			'font-size':'0',
			'display':'inline-block',
			'*display':'inline',
    		'*zoom':'1',
			'letter-spacing':'-.40em',
			'overflow':'hidden',
			'position':'relative',
			'text-align':'left',
			'vertical-align':'top',
			'padding':'0',
			'width':block_w,
			'height':block_h
		});
		
		var reserve_a = [];
		var reserve_push = [];
		
		var _this;
		
		var img ={};
		for(var i=0;i<options.data.length;i++){
			img[i] = new Image();
			img[i].src = options.data[i]["image"];
			l++;
		}
		
		if(options.data.length > options.warp*options.woof){
			var l = 0;
			reserve_a[l] = [];
			for(var i=options.warp*options.woof;i<options.data.length;i++){
				reserve_a[l] = options.data[i];
				l++;
			}
		}
		
		var autoTimer = function(obj){
			if(options.auto_slide['auto_run'] == true){
				var autoTimerID = setTimeout(function(){
					obj.autoMove(autoTimerID);
				},options.auto_slide['interval']);
			}
			return autoTimerID;
		}
		
		
		//Constructor
		var MakePanel = function(){
			this.aww = [];
			this.aww[0] = [];
			this.panel_cnt = options.warp*options.woof;
			this.panels = "";
			this.bgselect = "";
			this.base_alt = "";
			this.p_size = options.panel_size+"px";
			this.n_size = (-1*options.panel_size)+"px";
			
			var j = 0;
			var k = 0;
			var m = 0;
			var compleat = 0;
			for(var i=0; i< this.panel_cnt;i++){
				this.panels = ('<p id="waws_p'+(i+1)+'" class="waws_plate"><span></span></p>');
				this.bgselect = "#waws_p"+(i+1)+" span";
				$(blockid).append(this.panels);
				
				if(i  < options.data.length){
					$(this.bgselect).css('background-image','url('+options.data[i]["image"]+')');
					$(this.bgselect).attr('alt',options.data[i]["title"]);
				}else{
					$(this.bgselect).css('background-image','url('+options.data[m]["image"]+')');
					$(this.bgselect).attr('alt',options.data[m]["title"]);
					m++;
				}
				
				if(k>(options.woof-1)){
					j++;
					this.aww[j] = [];
					k = 0;
				}
				this.aww[j][k] = "waws_p"+(i+1);
				
				if(i == (options.launch-1)){
					z_p_warp = j;
					z_p_woof = k;
				}
				
				k++;
			}
			
			$(".waws_plate,.waws_plate span").css({
				'width':this.p_size,
				'height':this.p_size
			});
			
		}
		
		
		
		//Preparation of movement
		MakePanel.prototype.setPanel = function(cp1,cp2){
			var move_warp;
			var move_woof;
			
			if(cp1 < z_p_warp){
				move_warp = "d";
			}else if(cp1 > z_p_warp){
				move_warp = "u";
			}else{
				move_warp = "n";
			}
			
			if(cp2 < z_p_woof){
				move_woof = "r";
			}else if(cp2 > z_p_woof){
				move_woof = "l";
			}else{
				move_woof = "n";
			}
			
			this.slideAnimation(cp1,cp2,move_warp,move_woof);
		}
		
		
		//Slide Animation
		MakePanel.prototype.slideAnimation = function(cp1,cp2,move_warp,move_woof){
			var slideway = [];
			var savearray = [];
			var altarray = [];
			var bgimg;
			var slide_aww = this.aww;
			
			var moveWarp = function(p_size,n_size,aww){
				if(move_warp == "u"){
					slideway = [n_size,"0"];
					select_p = [cp1-1,cp2];
				}else if(move_warp == "d"){
					slideway = [p_size,"0"];
					select_p = [cp1+1,cp2];
				}
				for(var i=0;i<options.warp;i++){
					bgimg = '#'+aww[i][cp2]+' span';
					savearray[i] = $(bgimg).css('background-image');
					altarray[i] = $(bgimg).attr('alt');
				}
			}
			
			var moveWoof = function(p_size,n_size,aww){
				if(move_woof == "l"){
					slideway = ["0",n_size];
					select_p = [cp1,cp2-1];
				}else if(move_woof == "r"){
					slideway = ["0",p_size];
					select_p = [cp1,cp2+1];
				}else{
					slideway = ["0","0"];
					select_p = [cp1,cp2];
				}
				for(var i=0;i<options.woof;i++){
					bgimg = '#'+aww[cp1][i]+' span';
					savearray[i] = $(bgimg).css('background-image');
					altarray[i] = $(bgimg).attr('alt');
				}
			}
			
			if(last_way == 0){
				if(move_warp != "n"){
					moveWarp(this.p_size,this.n_size,this.aww);
				}else{
					moveWoof(this.p_size,this.n_size,this.aww);
				}
			}else{
				if(move_woof != "n"){
					moveWoof(this.p_size,this.n_size,this.aww);
				}else{
					moveWarp(this.p_size,this.n_size,this.aww);
				}
			}
			
			if(reserve_push.hasOwnProperty('image')){
				reserve_a.shift();
			}
			
			this.setDummySpan(cp1,cp2,move_warp,move_woof);
			this.slideAnimation2(savearray,altarray,slideway,cp1,cp2,move_warp,move_woof);
			
		}
		
		
		//Set dummy
		MakePanel.prototype.setDummySpan = function(cp1,cp2,move_warp,move_woof){
			var dummyspan = '<span id="WaWS_dummy"></span>'
			var firstspan;
			var	lastspan;
			var dummyurl = "";
			
			var setDummySapnWarp = function(p_size,n_size,aww){
				firstspan = '#'+aww[0][cp2] + " span";
				lastspan = '#'+aww[options.warp-1][cp2] + " span";
				if(move_warp == "u"){
					dummyurl = $(firstspan).css('background-image');
					$(lastspan).after(function(){
						return dummyspan;
					});
					$("#WaWS_dummy").css("top",p_size);
				}else if(move_warp == "d"){
					dummyurl = $(lastspan).css('background-image');
					$(firstspan).before(function(){
						return dummyspan;
					});
					$("#WaWS_dummy").css("top",n_size);
				}
			}
			
			var setDummySapnWoof = function(p_size,n_size,aww){
				firstspan = '#'+aww[cp1][0] + " span";
				lastspan = '#'+aww[cp1][options.woof-1] + " span";
				if(move_woof == "l"){
					dummyurl = $(firstspan).css('background-image');
					$(lastspan).after(function(){
						return dummyspan;
					});
					$("#WaWS_dummy").css("left",p_size);
				}else if(move_woof == "r"){
					dummyurl = $(lastspan).css('background-image');
					$(firstspan).before(function(){
						return dummyspan;
					});
					$("#WaWS_dummy").css("left",n_size);
				}
			}
			
			if(last_way == 0){
				if(move_warp != "n"){
					setDummySapnWarp(this.p_size,this.n_size,this.aww);
				}else{
					setDummySapnWoof(this.p_size,this.n_size,this.aww);
				}
			}else{
				if(move_woof != "n"){
					setDummySapnWoof(this.p_size,this.n_size,this.aww);
				}else{
					setDummySapnWarp(this.p_size,this.n_size,this.aww);
				}
			}
			
			if(reserve_a[0] != null){
				dummyurl = "url("+reserve_a[0]["image"]+")";
			}
			
			$("#WaWS_dummy").css({
				'background-image':dummyurl,
				'width':this.p_size,
				'height':this.p_size
			});
			
		}
		
		
		//panels and dummy slide
		MakePanel.prototype.slideAnimation2 = function(savearray,altarray,slideway,cp1,cp2,move_warp,move_woof){
			var spanid = "";
			
			var clearcss = ({
				'transform':'none',
				'-webkit-transform':'none',
				'-moz-transform':'none',
				'-o-transform':'none',
				'-ms-transform':'none',
				'-transition':'0',
				'-webkit-transition':'0',
				'-moz-transition':'0',
				'-o-transition':'0',
				'-ms-transition':'0',
				left:"0px",
				top:"0px"
			});
			
			
			var slideAnimeWarp = function(aww){
				for(var i=0;i<options.warp;i++){
					spanid = "#"+aww[i][cp2]+", +span ,+#WaWS_dummy";
					$(spanid).css({
						'transform':'translateY('+slideway[0]+')',
						'-webkit-transform':'translateY('+slideway[0]+')',
						'-moz-transform':'translateY('+slideway[0]+')',
						'-o-transform':'translateY('+slideway[0]+')',
						'-ms-transform':'translateY('+slideway[0]+')',
						'transition':slide_speed+'ms',
						'-webkit-transition':slide_speed+'ms',
						'-moz-transition':slide_speed+'ms',
						'-o-transition':slide_speed+'ms',
						'-ms-transition':slide_speed+'ms'
					}).one("webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd",function(){
						$(this).css(clearcss);
						MakePanel.prototype.setSlidePanelvalue(savearray,altarray,cp1,cp2,move_warp,move_woof,aww);
					});
				}
			}
			
			
			var slideAnimeWoof = function(aww){
				for(var i=0;i<options.woof;i++){
					spanid = "#"+aww[cp1][i]+", +span ,+#WaWS_dummy";
					$(spanid).css({
						'transform':'translateX('+slideway[1]+')',
						'-webkit-transform':'translateX('+slideway[1]+')',
						'-moz-transform':'translateX('+slideway[1]+')',
						'-o-transform':'translateX('+slideway[1]+')',
						'-ms-transform':'translateX('+slideway[1]+')',
						'transition':slide_speed+'ms',
						'-webkit-transition':slide_speed+'ms',
						'-moz-transition':slide_speed+'ms',
						'-o-transition':slide_speed+'ms',
						'-ms-transition':slide_speed+'ms'
					}).one("webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd",function(){
						$(this).css(clearcss);
						MakePanel.prototype.setSlidePanelvalue(savearray,altarray,cp1,cp2,move_warp,move_woof,aww);
					});
				}
			}
			
			//-------------------------------------------jQuery animate
			/*var slideAnimeWarp = function(aww){
				for(var i=0;i<options.warp;i++){
					spanid = "#"+aww[i][cp2]+", +span ,+#WaWS_dummy";
					$(sapanid).animate({
						top:slideway[0],
						left:slideway[1]
					},slide_speed,function(){
						MakePanel.prototype.setSlidePanelvalue(savearray,altarray,cp1,cp2,move_warp,move_woof,aww);
					}).animate({
				       	left:"0px",
				       	top:"0px"
					},0);
				}
			}
			
			
			var slideAnimeWoof = function(aww){
				for(var i=0;i<options.woof;i++){
					spanid = "#"+aww[cp1][i]+", +span ,+#WaWS_dummy";
					$(spanid).animate({
						top:slideway[0],
						left:slideway[1]
					},slide_speed,function(){
						MakePanel.prototype.setSlidePanelvalue(savearray,altarray,cp1,cp2,move_warp,move_woof,aww);
					}).animate({
			        	left:"0px",
			        	top:"0px"
					},0);
				}
			}*/
			//-------------------------------------------jQuery animate end
			
			
			if(last_way == 0){
				if(slideway[0] != "0"){
					slideAnimeWarp(this.aww);
				}else{
					slideAnimeWoof(this.aww);
				}
			}else{
				if(slideway[1] != "0"){
					slideAnimeWoof(this.aww);
				}else{
					slideAnimeWarp(this.aww);
				}
			}
			
			
			
			
			this.checkPanelPosition();
		}
		
		
		//After the movement,Change pales value
		MakePanel.prototype.setSlidePanelvalue = function(savearray,altarray,cp1,cp2,move_warp,move_woof,aww){
			var panel = "";
			var fist_r_span = "";
			$("#WaWS_dummy").remove();
			
			var getReserve = function(id){
				var reserve_push_ex = [];
				if(reserve_a[0] != null){
					reserve_push_ex["image"] = $(id).css('background-image');
					reserve_push_ex["title"] = $(id).attr('alt');
					$(id).css('background-image','url('+reserve_a[0]["image"]+')');
					$(id).attr('alt',reserve_a[0]["title"]);
				}else{
					return false;
				}
				return reserve_push_ex;
			}
			
			var setSlidePanelWarp = function(aww){
				var reserve_push_fix = [];
				if(move_warp == "u"){
					for(var i=0;i<options.warp;i++){
						panel = '#'+aww[i][cp2]+' span';
						$(panel).css('background-image',savearray[i+1]);
						$(panel).attr('alt',altarray[i+1]);
					}
					$(panel).css('background-image',savearray[0]);
					$(panel).attr('alt',altarray[0]);
					reserve_push_fix = getReserve(panel);
				}else if(move_warp == "d"){
					for(var i=0;i<options.warp;i++){
						panel = '#'+aww[i][cp2]+' span';
						if(i ==0){
							$(panel).css('background-image',savearray[savearray.length-1]);
							$(panel).attr('alt',altarray[altarray.length-1]);
						}else{
							$(panel).css('background-image',savearray[i-1]);
							$(panel).attr('alt',altarray[i-1]);
						}
					}
					fist_r_span = '#'+aww[0][cp2]+' span';
					reserve_push_fix = getReserve(fist_r_span);
				}
				return reserve_push_fix;
			}
			
			var setSlidePanelWoof = function(aww){
				var reserve_push_fix = [];
				if(move_woof == "l"){
					for(var i=0;i<options.woof;i++){
						panel = '#'+aww[cp1][i]+' span';
						$(panel).css('background-image',savearray[i+1]);
						$(panel).attr('alt',altarray[i+1]);
					}
					$(panel).css('background-image',savearray[0]);
					$(panel).attr('alt',altarray[0]);
					reserve_push_fix = getReserve(panel);
				}else if(move_woof == "r"){
					for(var i=0;i<options.woof;i++){
						panel = '#'+aww[cp1][i]+' span';
						if(i ==0){
							$(panel).css('background-image',savearray[savearray.length-1]);
							$(panel).attr('alt',altarray[altarray.length-1]);
						}else{
							$(panel).css('background-image',savearray[i-1]);
							$(panel).attr('alt',altarray[i-1]);
						}
					}
					fist_r_span = '#'+aww[cp1][0]+' span';
					reserve_push_fix = getReserve(fist_r_span);
				}
				return reserve_push_fix;
			}
			
			var reserve_push_set = [];
			if(last_way == 0){
				if(move_warp != "n"){
					reserve_push_set = setSlidePanelWarp(aww);
				}else{
					reserve_push_set = setSlidePanelWoof(aww);
				}
			}else{
				if(move_woof != "n"){
					reserve_push_set = setSlidePanelWoof(aww);
				}else{
					reserve_push_set = setSlidePanelWarp(aww);
				}
			}
			
			reserve_push = reserve_push_set;
		}
		
		
		//Ends or continues to move
		MakePanel.prototype.checkPanelPosition = function(){
			var cpp_alt = this.base_alt;
			_this = this;
			
			if(select_p[0] == z_p_warp && select_p[1] == z_p_woof){
				var opentimer = setTimeout(function(){
					_this.openLargeWindow(opentimer);
				},slide_speed+options.spped_ajust);
			}else{
				setTimeout(function(){
					_this.reserveDataPush(cpp_alt);
					if(last_way == 0){
						last_way = 1;
					}else{
						last_way = 0;
					}
					_this.setPanel(select_p[0],select_p[1]);
				},slide_speed+options.spped_ajust);
			}
		}
		
		
		//Push and Shift preliminary data
		MakePanel.prototype.reserveDataPush = function(){
			if(reserve_push["image"]){
				reserve_push["image"] = reserve_push["image"].replace("url(","");
				reserve_push["image"] = reserve_push["image"].replace(")","");
				var title = this.base_alt;
				var imgnumber = 0;
				for(var i = 0, len = options.data.length; i < len; i++){
					if(i in options.data && options.data[i]['title'] === title){
						imgnumber = i;
						break;
					}
				}
			}else{
				return false;
			}
			
			reserve_a.push({
				image:reserve_push["image"],
				url:options.data[imgnumber]["url"],
				title:reserve_push["title"]
			});
			
		}
		
		
		//Open ViewWindow
		MakePanel.prototype.openLargeWindow = function(opentimer){
			clearTimeout(opentimer);
			this.reserveDataPush();
			var title = this.base_alt;
			var imgnumber = 0;
			var view_idle = 0;
			_this = this;
			
			for(var i = 0, len = options.data.length; i < len; i++){
				if(i in options.data && options.data[i]['title'] === title){
					imgnumber = i;
					break;
				}
			}
			
			$(blockid).after('<p id="WaWSlargeview"><span></span></p>');
			
			var offset = $(blockid).offset();
			
			$("#WaWSlargeview").css({
				'left':(offset.left+$(blockid).width()/2)+'px',
				'top':(offset.top+$(blockid).height()/2)+'px'
			});
			
			img[imgnumber].src = options.data[imgnumber]["image"];
			var imgwidth  = img[imgnumber].width;
			var imgheight = img[imgnumber].height;
			var imgsize;
			var timerId;
			
			if(imgwidth > imgheight){
				imgsize = options.view["image_max_width"]+'px auto';
				$("#WaWSlargeview span").css('background-size',imgsize);
			}else{
				imgsize = 'auto '+options.view["image_max_height"]+'px';
				$("#WaWSlargeview span").css('background-size',imgsize);
			}
			
			$("#WaWSlargeview span").attr('title',options.data[imgnumber]["title"]);
			
			$("#WaWSlargeview").show().animate({
			    'left':(offset.left+$(blockid).width()/2)-options.view["width"]/2+'px',
				'top':(offset.top+$(blockid).height()/2)-options.view["height"]/2-16+'px',
			    'width':options.view["width"],
				'height':options.view["height"]
			},slide_speed,function(){
				if(options.view["close"] == true){
					$("#WaWSlargeview").append('<div id="WaWSclose"></div>');
				}
				
				$("#WaWSlargeview span").css({
					'background-image':'url('+options.data[imgnumber]["image"]+')',
					'width':imgwidth+'px',
					'height':imgheight+'px',
					'vertical-align':'middle',
					'margin-top':(options.view["height"]-options.view["image_max_height"])/2+'px',
					'margin-left':'auto',
					'margin-right':'auto',
					'max-width':options.view["image_max_width"]+'px',
					'max-height':options.view["image_max_height"]+'px'
				});
				$("#WaWSclose").css({
					'left':(options.view["width"]-$("#WaWSclose").width())+'px'
				});
			});
			
			var closeView = function(){
				$("#WaWSlargeview span,#WaWSclose").remove();
				var lw_close = $.when(
					$("#WaWSlargeview").animate({
						opacity:'hide',
						'left':(offset.left+$(blockid).width()/2)+'px',
						'top':(offset.top+$(blockid).height()/2)+'px',
						width:'1px',
						height:'1px'
					},slide_speed)
				);
				lw_close.done(function(){
					$("#WaWSlargeview").remove();
					clearTimeout(timerId);
					timerId = null;
					idle = 1;
					autoTimer(_this);
				});
			}
			
			var timerClose = function(){
				timerId = setTimeout(function(){
					closeView();
				},options.view['interval']);
			}
			
			var stopTimer = function(){
				clearTimeout(timerId);
				view_idle = 1;
			}
			
			timerClose();
			
			$("#WaWSlargeview span").on('click',function(){
				if(options.data[imgnumber]["url"] == ""){
					if(timerId){
						closeView();
					}
				}else{
					window.open(options.data[imgnumber]["url"],options.view["open_url_target"]);
				}
			});
			
			$(document).on('click','#WaWSclose',function(){
				if(timerId){
					closeView();
				}
			});
		}
		
		
		//Auto-run
		MakePanel.prototype.autoMove = function(autoTimerID){
			stopTimer(autoTimerID);
			idle = 0;
			var rnd = [];
			var l_p_id;
			
			var searchPanelPoint = function(l_p_id){
				var sl_p = [];
				for(var i=0;i<options.warp; i++){
					for(var j=0;j<options.woof; j++){
						if(i in this.aww && this.aww[i][j] === l_p_id){
							sl_p[0] = i;
							sl_p[1] = j;
							break;
						}
					}
				}
				return sl_p;
			}
			
			if(options.auto_slide['order'] == 'forward'){
				l_p_id = "waws_p"+(launch_p-1);
				if(!($('#'+l_p_id)[0])){
					//console.log("none:"+l_p_id);
					l_p_id = "waws_p"+this.panel_cnt;
					//console.log("newid:"+l_p_id);
				}else{
					//console.log("find:"+l_p_id);
				}
				rnd = searchPanelPoint(l_p_id);
			}else if(options.auto_slide['order'] == 'back'){
				l_p_id = "waws_p"+(launch_p+1);
				if(!($('#'+l_p_id)[0])){
					//console.log("none:"+l_p_id);
					l_p_id = "waws_p"+1;
					//console.log("newid:"+l_p_id);
				}else{
					//console.log("find:"+l_p_id);
				}
				rnd = searchPanelPoint(l_p_id);
			}else{
				rnd[0] = Math.floor(Math.random()*options.warp);
				rnd[1] = Math.floor(Math.random()*options.woof);
				if(rnd[0] == z_p_warp && rnd[1] == z_p_woof){
					if(rnd[0] != 0 && rnd[1] != 0){
						rnd = [0,0];
					}else{
						rnd = [(options.warp-1),(options.woof-1)];
					}
				}
			}
			
			var set_a_id = "#"+this.aww[rnd[0]][rnd[1]]+" span";
			this.base_alt = $(set_a_id).attr("alt");
			if(rnd[0] == z_p_warp && rnd[1] == z_p_woof){
				this.openLargeWindow();
			}else{
				this.setPanel(rnd[0],rnd[1]);
			}
			
			function stopTimer(autoTimerID){
				clearTimeout(autoTimerID);
				autoTimerID = null;
			}
		}
		
		
		
		waws.each(function(){
			var Waws = new MakePanel();
			
			$(".waws_plate").bind('click',function(){
				if(idle == 1){
					idle = 0;
					var thisid = $(this).attr("id");
					var this_span = "#"+thisid+" span";
					Waws.base_alt = $(this_span).attr("alt");
					var cp1;
					var cp2;
					
					for(var i=0; i<options.warp;i++){
						cp1 = i;
						cp2 = Waws.aww[i].lastIndexOf(thisid);
						if(cp2 > -1){
							break;
						}
					}
					
					if(cp1 == z_p_warp && cp2 == z_p_woof){
						Waws.openLargeWindow();
					}else{
						Waws.setPanel(cp1,cp2);
					}
				}
			});
			
			
			var auto_run_Id;
			if(idle == 1){
				auto_run_Id = autoTimer(Waws);
			}
			
			
			
			
			//Stop auto-run
			$("#WaWSstopAutoRun").click(function(){
				if(auto_run_Id){
					clearTimeout(auto_run_Id);
					options.auto_slide["auto_run"] = false;
					console.log("stop auto-run");
				}
			});
			
			
		});
		
		return this;
	}
}) (jQuery);



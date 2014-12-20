(function($){
	$.fn.WaWS = function(options){
		
		//オプション
		options = $.extend({
			warp:3,							//vertical panels count. (default:3)
			woof:3,							//horizontal panels count. (default:3)
			data:[],						//content data. {image:'(URL string)',url:'(URL string or null)',title:'(string *Unique*)'},{...}
			launch:5,						//moved endpoint panel. counting from the upper-left 1, 2, 3, ... (default:5)
			speed:300,						//slide speed. (default:300)
			panel_size:100,					//panel size. (default:100)
			auto_slide:{
				auto_run:false,				//
				order:'forward',			//moving direction of content data. 'forward' or 'back' or 'random' (default:forward)
				interval:5000
			},
			view:{
				width:300,					//ViewWindow width size. (default:300)
				height:300,					//ViewWindow height size. (default:300)
				image_max_width:280,		//drawing image max-width size. (default:280)
				image_max_height:280,		//drawing image max-height size. (default:280)
				interval:5000,				//time to view image. (default:5000)
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
		var zoom_p = options.launch;
		var z_p_warp;
		var z_p_woof;
		var idle = 1;
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
		
		//パネルの作成
		var MakePanel = function(warp,woof,data,launch,auto_slide,view,panel_size,blockid){
			var aww = [];
			aww[0] = [];
			var panel_cnt = warp*woof;
			var panels = "";
			var j = 0;
			var k = 0;
			var bgselect = "";
			var select_p = [];
			var base_alt = "";
			var p_size = panel_size+"px";
			var n_size = (-1*panel_size)+"px";
			var reserve_a = [];
			var reserve_push = [];
			var last_way = Math.floor(Math.random()*2);
			
			if(data.length > warp*woof){
				var l = 0;
				reserve_a[l] = [];
				for(var i=warp*woof;i<data.length;i++){
					reserve_a[l] = data[i];
					l++;
				}
			}
			
			//console.log(reserve_a);
			
			
			for(var i=0; i< panel_cnt;i++){
				panels = ('<p id="waws_p'+(i+1)+'" class="waws_plate"><span></span></p>');
				bgselect = "#waws_p"+(i+1)+" span";
				$(blockid).append(panels);
				$(bgselect).css('background-image','url('+data[i]["image"]+')');
				$(bgselect).attr('alt',data[i]["title"]);
				
				if(k>(woof-1)){
					j++;
					aww[j] = [];
					k = 0;
				}
				aww[j][k] = "waws_p"+(i+1);
				
				if(i == (launch-1)){
					z_p_warp = j;
					z_p_woof = k;
				}
				
				k++;
			}
			
			$(".waws_plate,.waws_plate span").css({
				'width':p_size,
				'height':p_size
			});
			
			console.log(aww);
			
			
			
			//パネルアニメのダミー作成
			var setDummySpan = function(hitarray1,hitarray2,move_warp,move_woof){
				var d = new $.Deferred;
				
				var dummyspan = '<span id="WaWS_dummy"></span>'
				var firstspan;
				var	lastspan;
				var dummyurl = "";
				
				
				var setDummySapnWarp = function(){
					firstspan = '#'+aww[0][hitarray2] + " span";
					lastspan = '#'+aww[warp-1][hitarray2] + " span";
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
				
				var setDummySapnWoof = function(){
					firstspan = '#'+aww[hitarray1][0] + " span";
					lastspan = '#'+aww[hitarray1][woof-1] + " span";
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
						setDummySapnWarp();
					}else{
						setDummySapnWoof();
					}
				}else{
					if(move_woof != "n"){
						setDummySapnWoof();
					}else{
						setDummySapnWarp();
					}
				}
				
				/*
				if(move_warp != "n"){
					firstspan = '#'+aww[0][hitarray2] + " span";
					lastspan = '#'+aww[warp-1][hitarray2] + " span";
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
				}else{
					firstspan = '#'+aww[hitarray1][0] + " span";
					lastspan = '#'+aww[hitarray1][woof-1] + " span";
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
				*/
				
				if(reserve_a[0] != null){
					dummyurl = "url("+reserve_a[0]["image"]+")";
				}
				
				$("#WaWS_dummy").css({
					'background-image':dummyurl,
					'width':p_size,
					'height':p_size
				});
				d.resolve();
				return d.promise();
			}
			
			
			
			//余剰データの取り出しと格納
			var reserveDataPush = function(){
				
				//if(reserve_push["image"] != ""){
				if(reserve_push["image"]){
					
					reserve_push["image"] = reserve_push["image"].replace("url(","");
					reserve_push["image"] = reserve_push["image"].replace(")","");
					var title = base_alt;
					var imgnumber = 0;
					for(var i = 0, len = data.length; i < len; i++){
						if(i in data && data[i]['title'] === title){
							imgnumber = i;
							break;
						}
					}
					
					
					reserve_a.push({
						image:reserve_push["image"],
						url:data[imgnumber]["url"],
						title:reserve_push["title"]
					});
					reserve_a.shift();
					
					//console.log("view:"+reserve_a[0]["title"]);
					//console.log("rsrv:"+reserve_push["title"]);
					//console.log(base_alt);
				}else{
					//console.log("空");
					return false;
				}
				//console.log(reserve_a);
			}
			
			
			
			
			
			
			
			
			
			
			
			
			
			//ラージウィンドウ展開
			var openLargeWindow = function(opentimer){
				
				clearTimeout(opentimer);
				reserveDataPush();
				var title = base_alt;
				var imgnumber = 0;
				var view_idle = 0;
				
				for(var i = 0, len = data.length; i < len; i++){
					if(i in data && data[i]['title'] === title){
						imgnumber = i;
						break;
					}
				}
				
				$(blockid).after('<p id="WaWSlargeview"><span></span></p>');
				
				
				var offset = $(blockid).offset();
				
				
				$("#WaWSlargeview").css({
					//'display':'table-cell',
					//'vertical-align':'middle',
					//'text-align':'center',
					
					//'left':(offset.left+(view["width"]/2))+'px',
					//'top':(offset.top+(view["height"]/2))+'px'
					
					'left':(offset.left+$(blockid).width()/2)+'px',
					'top':(offset.top+$(blockid).height()/2)+'px'
					
					
				});
				
				
				
				var img = new Image();
				img.src = data[imgnumber]["image"];
				var imgwidth  = img.width;
				var imgheight = img.height;
				
				
				
				var timerId;
				
				
				
				
				
				
				
				
				
				var imgsize;
				if(imgwidth > imgheight){
					imgsize = view["image_max_width"]+'px auto';
					$("#WaWSlargeview span").css('background-size',imgsize);
				}else{
					imgsize = 'auto '+view["image_max_height"]+'px';
					$("#WaWSlargeview span").css('background-size',imgsize);
				}
				$("#WaWSlargeview span").attr('title',data[imgnumber]["title"]);
				
				$("#WaWSlargeview").show().animate({
			    	
			    	'left':(offset.left+$(blockid).width()/2)-view["width"]/2+'px',
					'top':(offset.top+$(blockid).height()/2)-view["height"]/2-16+'px',
			    	
			    	//'left':offset.left+'px',
					//'top':offset.top-16+'px',
			    	
			    	'width':view["width"],
					'height':view["height"]
					//width:$(blockid).width(),
					//height:$(blockid).height()
				},slide_speed,function(){
					if(view["close"] == true){
						$("#WaWSlargeview").append('<div id="WaWSclose"></div>');
					}
					
					$("#WaWSlargeview span").css({
						'background-image':'url('+data[imgnumber]["image"]+')',
						'width':imgwidth+'px',
						'height':imgheight+'px',
						'vertical-align':'middle',
						'margin-top':(view["height"]-view["image_max_height"])/2+'px',
						'margin-left':'auto',
						'margin-right':'auto',
						
						'max-width':view["image_max_width"]+'px',
						'max-height':view["image_max_height"]+'px'
						
						
						
						//'max-width':$(blockid).width()+'px',
						//'max-height':$(blockid).height()+'px'
					});
					$("#WaWSclose").css({
						'left':(view["width"]-$("#WaWSclose").width())+'px',
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
						//console.log("stop:"+timerId);
						clearTimeout(timerId);
						timerId = null;
						idle = 1;
						
						autoTimer();
					});
				}
				
				
				
				var timerClose = function(){
					timerId = setTimeout(function(){
						closeView();
					},view['interval']);
				}
				
				
				var stopTimer = function(){
					clearTimeout(timerId);
					view_idle = 1;
				}
				
				
				
				timerClose();
				
				
				
				
				
				$("#WaWSlargeview span").on('click',function(){
					if(data[imgnumber]["url"] == ""){
						if(timerId){
							closeView();
						}
					}else{
						window.open(data[imgnumber]["url"],view["open_url_target"]);
					}
				});
				
				//console.log("run:"+timerId);
				$(document).on('click','#WaWSclose',function(){
					if(timerId){
						closeView();
					}
				});
				
				
				
				
				/*
				$("#WaWSlargeview").on('mousemove mouseover',function(event){
					
						stopTimer();
					
				}).on('mouseleave',function(event){
					
					timerClose();
					view_idle = 0;
				});
				*/
				
			}
			
			
			
			
			
			//パネル移動後の位置確認と繰り返し
			var checkPanelPosition = function(){
				
				if(select_p[0] == z_p_warp && select_p[1] == z_p_woof){
					var timerId = setTimeout(function(){
						openLargeWindow(timerId);
						//console.log("open");
					},slide_speed+20);
				}else{
					setTimeout(function(){
						reserveDataPush();
						
						if(last_way == 0){
							last_way = 1;
						}else{
							last_way = 0;
						}
						
						setPanel(select_p[0],select_p[1]);
						
					},slide_speed+20);
				}
				
				
			}
			
			
			
			
			
			
			
			
			
			
			//移動後のパネルイメージ置き換え
			var setSlidePanelvalue = function(savearray,altarray,hitarray1,hitarray2,move_warp,move_woof){
				var panel = "";
				var fist_r_span = "";
				//var last_title = "";
				//reserve_push["image"] = "";
				//reserve_push["title"] = "";
				
				
				var getReserve = function(id){
					
					//console.log("getReserve");
					
					if(reserve_a[0] != null){
					//if(reserve_a[0]["image"] != ""){
						reserve_push["image"] = $(id).css('background-image');
						reserve_push["title"] = $(id).attr('alt');
						$(id).css('background-image','url('+reserve_a[0]["image"]+')');
						$(id).attr('alt',reserve_a[0]["title"]);
						//console.log('reserve_a[0]["image"]:'+reserve_a[0]["image"]);
					}else{
						return false;
					}
					
				}
				
				
				$("#WaWS_dummy").remove();
				
				
				var setSlidePanelWarp = function(){
					if(move_warp == "u"){
						for(var i=0;i<warp;i++){
							panel = '#'+aww[i][hitarray2]+' span';
							$(panel).css('background-image',savearray[i+1]);
							$(panel).attr('alt',altarray[i+1]);
						}
						$(panel).css('background-image',savearray[0]);
						$(panel).attr('alt',altarray[0]);
						//reserve_push["image"] = $(panel).css('background-image');
						//reserve_push["title"] = $(panel).attr('alt');
						getReserve(panel);
					}else if(move_warp == "d"){
						for(var i=0;i<warp;i++){
							panel = '#'+aww[i][hitarray2]+' span';
							if(i ==0){
								$(panel).css('background-image',savearray[savearray.length-1]);
								$(panel).attr('alt',altarray[altarray.length-1]);
							}else{
								$(panel).css('background-image',savearray[i-1]);
								$(panel).attr('alt',altarray[i-1]);
							}
						}
						fist_r_span = '#'+aww[0][hitarray2]+' span';
						//reserve_push["image"] = $(fist_r_span).css('background-image');
						//reserve_push["title"] = $(fist_r_span).attr('alt');
						getReserve(fist_r_span);
					}
				}
				
				var setSlidePanelWoof = function(){
					if(move_woof == "l"){
						for(var i=0;i<woof;i++){
							panel = '#'+aww[hitarray1][i]+' span';
							$(panel).css('background-image',savearray[i+1]);
							$(panel).attr('alt',altarray[i+1]);
						}
						$(panel).css('background-image',savearray[0]);
						$(panel).attr('alt',altarray[0]);
						//reserve_push["image"] = $(panel).css('background-image');
						//reserve_push["title"] = $(panel).attr('alt');
						getReserve(panel);
					}else if(move_woof == "r"){
						for(var i=0;i<woof;i++){
							panel = '#'+aww[hitarray1][i]+' span';
							if(i ==0){
								$(panel).css('background-image',savearray[savearray.length-1]);
								$(panel).attr('alt',altarray[altarray.length-1]);
							}else{
								$(panel).css('background-image',savearray[i-1]);
								$(panel).attr('alt',altarray[i-1]);
							}
						}
						fist_r_span = '#'+aww[hitarray1][0]+' span';
						//reserve_push["image"] = $(fist_r_span).css('background-image');
						//reserve_push["title"] = $(fist_r_span).attr('alt');
						getReserve(fist_r_span);
					}
				}
				
				
				if(last_way == 0){
					if(move_warp != "n"){
						setSlidePanelWarp();
					}else{
						setSlidePanelWoof();
					}
				}else{
					if(move_woof != "n"){
						setSlidePanelWoof();
					}else{
						setSlidePanelWarp();
					}
				}
				
				
				
				
				
				/*
				if(move_warp != "n"){
					if(move_warp == "u"){
						for(var i=0;i<warp;i++){
							panel = '#'+aww[i][hitarray2]+' span';
							$(panel).css('background-image',savearray[i+1]);
							$(panel).attr('alt',altarray[i+1]);
						}
						$(panel).css('background-image',savearray[0]);
						$(panel).attr('alt',altarray[0]);
						//reserve_push["image"] = $(panel).css('background-image');
						//reserve_push["title"] = $(panel).attr('alt');
						getReserve(panel);
					}else if(move_warp == "d"){
						for(var i=0;i<warp;i++){
							panel = '#'+aww[i][hitarray2]+' span';
							if(i ==0){
								$(panel).css('background-image',savearray[savearray.length-1]);
								$(panel).attr('alt',altarray[altarray.length-1]);
							}else{
								$(panel).css('background-image',savearray[i-1]);
								$(panel).attr('alt',altarray[i-1]);
							}
						}
						fist_r_span = '#'+aww[0][hitarray2]+' span';
						//reserve_push["image"] = $(fist_r_span).css('background-image');
						//reserve_push["title"] = $(fist_r_span).attr('alt');
						getReserve(fist_r_span);
					}
				}else{
					if(move_woof == "l"){
						for(var i=0;i<woof;i++){
							panel = '#'+aww[hitarray1][i]+' span';
							$(panel).css('background-image',savearray[i+1]);
							$(panel).attr('alt',altarray[i+1]);
						}
						$(panel).css('background-image',savearray[0]);
						$(panel).attr('alt',altarray[0]);
						//reserve_push["image"] = $(panel).css('background-image');
						//reserve_push["title"] = $(panel).attr('alt');
						getReserve(panel);
					}else if(move_woof == "r"){
						for(var i=0;i<woof;i++){
							panel = '#'+aww[hitarray1][i]+' span';
							if(i ==0){
								$(panel).css('background-image',savearray[savearray.length-1]);
								$(panel).attr('alt',altarray[altarray.length-1]);
							}else{
								$(panel).css('background-image',savearray[i-1]);
								$(panel).attr('alt',altarray[i-1]);
							}
						}
						fist_r_span = '#'+aww[hitarray1][0]+' span';
						//reserve_push["image"] = $(fist_r_span).css('background-image');
						//reserve_push["title"] = $(fist_r_span).attr('alt');
						getReserve(fist_r_span);
					}
				}
				*/
				//console.log("swap:"+hitarray1+"/"+hitarray2);
			}
			
			
			//スライドアニメーション2
			var slideAnimation2 = function(savearray,altarray,slideway,hitarray1,hitarray2,move_warp,move_woof){
				var sapnid = "";
				
				var slideAnimeWarp = function(){
					for(var i=0;i<warp;i++){
						sapnid = "#"+aww[i][hitarray2]+", +span ,+#WaWS_dummy";
						$(sapnid).animate({
							top:slideway[0],
							left:slideway[1]
						},slide_speed,function(){
							//$("#WaWS_dummy").remove();
							setSlidePanelvalue(savearray,altarray,hitarray1,hitarray2,move_warp,move_woof);
						}).animate({
				        	left:"0px",
				        	top:"0px"
						},0);
					}
				}
				
				var slideAnimeWoof = function(){
					for(var i=0;i<woof;i++){
						sapnid = "#"+aww[hitarray1][i]+", +span ,+#WaWS_dummy";
						$(sapnid).animate({
							top:slideway[0],
							left:slideway[1]
						},slide_speed,function(){
							//$("#WaWS_dummy").remove();
							setSlidePanelvalue(savearray,altarray,hitarray1,hitarray2,move_warp,move_woof);
						}).animate({
				        	left:"0px",
				        	top:"0px"
						},0);
					}
				}
				
				if(last_way == 0){
					if(slideway[0] != "0"){
						slideAnimeWarp();
					}else{
						slideAnimeWoof();
					}
				}else{
					if(slideway[1] != "0"){
						slideAnimeWoof();
					}else{
						slideAnimeWarp();
					}
				}
				
				/*
				if(slideway[0] != "0"){
					for(var i=0;i<warp;i++){
						sapnid = "#"+aww[i][hitarray2]+", +span ,+#WaWS_dummy";
						$(sapnid).animate({
							top:slideway[0],
							left:slideway[1]
						},slide_speed,function(){
							//$("#WaWS_dummy").remove();
							setSlidePanelvalue(savearray,altarray,hitarray1,hitarray2,move_warp,move_woof);
						}).animate({
				        	left:"0px",
				        	top:"0px"
						},0);
					}
				}else{
					for(var i=0;i<woof;i++){
						sapnid = "#"+aww[hitarray1][i]+", +span ,+#WaWS_dummy";
						$(sapnid).animate({
							top:slideway[0],
							left:slideway[1]
						},slide_speed,function(){
							//$("#WaWS_dummy").remove();
							setSlidePanelvalue(savearray,altarray,hitarray1,hitarray2,move_warp,move_woof);
						}).animate({
				        	left:"0px",
				        	top:"0px"
						},0);
					}
				}
				*/
				//console.log("anime2:"+hitarray1+"/"+hitarray2);
				checkPanelPosition();
			}
			
			
			
			//スライドアニメーション
			var slideAnimation = function(hitarray1,hitarray2,move_warp,move_woof){
				var slideway = [];
				var savearray = [];
				var altarray = [];
				var bgimg;
				
				
				var moveWarp = function(){
					if(move_warp == "u"){
						slideway = [n_size,"0"];
						select_p = [hitarray1-1,hitarray2];
					}else if(move_warp == "d"){
						slideway = [p_size,"0"];
						select_p = [hitarray1+1,hitarray2];
					}
					for(var i=0;i<warp;i++){
						bgimg = '#'+aww[i][hitarray2]+' span';
						savearray[i] = $(bgimg).css('background-image');
						altarray[i] = $(bgimg).attr('alt');
					}
				}
				
				var moveWoof = function(){
					if(move_woof == "l"){
						slideway = ["0",n_size];
						select_p = [hitarray1,hitarray2-1];
					}else if(move_woof == "r"){
						slideway = ["0",p_size];
						select_p = [hitarray1,hitarray2+1];
					}else{
						slideway = ["0","0"];
						select_p = [hitarray1,hitarray2];
					}
					for(var i=0;i<woof;i++){
						bgimg = '#'+aww[hitarray1][i]+' span';
						savearray[i] = $(bgimg).css('background-image');
						altarray[i] = $(bgimg).attr('alt');
					}
				}
				
				
				if(last_way == 0){
					if(move_warp != "n"){
						moveWarp();
					}else{
						moveWoof();
					}
				}else{
					if(move_woof != "n"){
						moveWoof();
					}else{
						moveWarp();
					}
				}
				
				
				
				
				/*
				if(move_warp != "n"){
					if(move_warp == "u"){
						slideway = [n_size,"0"];
						select_p = [hitarray1-1,hitarray2];
					}else if(move_warp == "d"){
						slideway = [p_size,"0"];
						select_p = [hitarray1+1,hitarray2];
					}
					for(var i=0;i<warp;i++){
						bgimg = '#'+aww[i][hitarray2]+' span';
						savearray[i] = $(bgimg).css('background-image');
						altarray[i] = $(bgimg).attr('alt');
					}
				}else{
					if(move_woof == "l"){
						slideway = ["0",n_size];
						select_p = [hitarray1,hitarray2-1];
					}else if(move_woof == "r"){
						slideway = ["0",p_size];
						select_p = [hitarray1,hitarray2+1];
					}else{
						slideway = ["0","0"];
						select_p = [hitarray1,hitarray2];
					}
					for(var i=0;i<woof;i++){
						bgimg = '#'+aww[hitarray1][i]+' span';
						savearray[i] = $(bgimg).css('background-image');
						altarray[i] = $(bgimg).attr('alt');
					}
				}
				*/
				
				
				
				setDummySpan(hitarray1,hitarray2,move_warp,move_woof)
				.done(function(){
					slideAnimation2(savearray,altarray,slideway,hitarray1,hitarray2,move_warp,move_woof);
				});
				
				
				
				/*
				var promise = $.when(
					setDummySpan(hitarray1,hitarray2,move_warp,move_woof)
				);
				
				promise.done(function(){
					slideAnimation2(savearray,altarray,slideway,hitarray1,hitarray2,move_warp,move_woof);
				});
				*/
			}
			
			
			
			
			
			
			//移動準備
			var setPanel = function(hitarray1,hitarray2){
				var move_warp;
				var move_woof;
				
				//stopTimer();
				//console.log("set:"+hitarray1+"/"+hitarray2);
				
				
				//縦方向への比較
				if(hitarray1 < z_p_warp){
					move_warp = "d";
				}else if(hitarray1 > z_p_warp){
					move_warp = "u";
				}else{
					move_warp = "n";
				}
				
				//横方向への比較
				if(hitarray2 < z_p_woof){
					move_woof = "r";
				}else if(hitarray2 > z_p_woof){
					move_woof = "l";
				}else{
					move_woof = "n";
				}
				
				slideAnimation(hitarray1,hitarray2,move_warp,move_woof);
			}
			
			
			
			//パネルオートムーブ
			var autoMove = function(autoTimerID){
				stopTimer(autoTimerID);
				idle = 0;
				var rnd = [];
				//var lp = [];
				//var ip_v = aww[z_p_warp][z_p_woof];
				//ip_v = ip_v.replace("waws_p","");
				
				var l_p_id;
				
				
				
				
				var searchPanelPoint = function(l_p_id){
					var sl_p = [];
					for(var i=0;i<warp; i++){
						for(var j=0;j<woof; j++){
							if(i in aww && aww[i][j] === l_p_id){
								sl_p[0] = i;
								sl_p[1] = j;
								break;
							}
						}
					}
					return sl_p;
				}
				
				
				
				
				
				if(auto_slide['order'] == 'forward'){
					l_p_id = "waws_p"+(zoom_p-1);
					if(!($('#'+l_p_id)[0])){
						console.log("none:"+l_p_id);
						l_p_id = "waws_p"+panel_cnt;
						console.log("newid:"+l_p_id);
					}else{
						console.log("find:"+l_p_id);
					}
					rnd = searchPanelPoint(l_p_id);
				}else if(auto_slide['order'] == 'back'){
					l_p_id = "waws_p"+(zoom_p+1);
					if(!($('#'+l_p_id)[0])){
						console.log("none:"+l_p_id);
						l_p_id = "waws_p"+1;
						console.log("newid:"+l_p_id);
					}else{
						console.log("find:"+l_p_id);
					}
					rnd = searchPanelPoint(l_p_id);
				}else{
					rnd[0] = Math.floor(Math.random()*warp);
					rnd[1] = Math.floor(Math.random()*woof);
					if(rnd[0] == z_p_warp && rnd[1] == z_p_woof){
						if(rnd[0] != 0 && rnd[1] != 0){
							rnd = [0,0];
						}else{
							rnd = [(warp-1),(woof-1)];
						}
					}
				}
				
				console.log("rnd:"+rnd);
				
				
				var set_a_id = "#"+aww[rnd[0]][rnd[1]]+" span";
				base_alt = $(set_a_id).attr("alt");
				if(rnd[0] == z_p_warp && rnd[1] == z_p_woof){
					openLargeWindow();
				}else{
					setPanel(rnd[0],rnd[1]);
				}
			}
			
			
			function autoTimer(){
				if(auto_slide['auto_run'] == true){
					var autoTimerID = setTimeout(function(){
						autoMove(autoTimerID);
					},auto_slide['interval']);
					//console.log("autoTimer:run "+autoTimerID);
				}
			}
			
			function stopTimer(autoTimerID){
				clearTimeout(autoTimerID);
				//console.log("autoTimer:stop "+autoTimerID);
				autoTimerID = null;
			}
			
			
			if(idle == 1){
				autoTimer();
			}
			
			
			
			
			
			
			
			
			//パネルクリック
			$(".waws_plate").bind('click',function(){
				if(idle == 1){
					idle = 0;
					var thisid = $(this).attr("id");
					var this_span = "#"+thisid+" span";
					base_alt = $(this_span).attr("alt");
					var hitarray1;
					var hitarray2;
					
					for(var i=0; i<warp;i++){
						hitarray1 = i;
						hitarray2 = aww[i].lastIndexOf(thisid);
						if(hitarray2 > -1){
							break;
						}
					}
					
					if(hitarray1 == z_p_warp && hitarray2 == z_p_woof){
						openLargeWindow();
					}else{
						setPanel(hitarray1,hitarray2);
					}
				}
			});
			
			
			//デバグ用タイマー手動ストップ
			$("#testclick").bind('click',function(){
				stopTimer();
			});
			
		}
		
		
		
		
		
		
		
		
		
		
		waws.each(function(){
			MakePanel(options.warp,options.woof,options.data,options.launch,options.auto_slide,options.view,options.panel_size,blockid);
		});
		
		// method chain用に要素を返す - (4)
		return this;
	}
}) (jQuery);



// 敵車一台のデータ.
function OCarObj(id, no, name, team, class_name, color) {
	  var		self		= this;
	  self.id 			= id;
	  self.no      	 	= no;
	  self.name			= name;
	  self.team     	= team;
	  self.class_name	= class_name;
	  self.color    	= color;


	this.initialize = function()
	{
		this.window_pos.x = 0;
		this.window_pos.y = 0;
	}

	this.draw = function(ctx, scale) {
		if (this.timestamp == '1970-01-01 00:00:00')
			return;

		this.w_pos.x += (this.tgt_pos.x - this.w_pos.x)*0.03;
		this.w_pos.y += (this.tgt_pos.y - this.w_pos.y)*0.03;

		if (this.no == 300 || this.no == 351)
		{
			this.drawMyCar (ctx, scale);
			return;
		}

		var alpha = 1.0;
		if(this.velocity <= 10)
			alpha = 0.3;


		//	テキスト描画.
		this.text_pos.x = this.w_pos.x + 10;
		this.text_pos.y = this.w_pos.y - 10;
		{
			ctx.font="15px Arial";
			sys_work.ctx.fillStyle = 'rgba(0, 0, 0,' + alpha + ')';
			//ctx.fillText( this.class_name + ":" + this.no + " : " + this.team + " : " + this.velocity, this.text_pos.x, this.text_pos.y);
			ctx.fillText(this.no + " : " + this.team + " : " + this.velocity, this.text_pos.x, this.text_pos.y);
		}

		// ライン.
		ctx.strokeStyle = 'rgba(32, 32, 32,' + alpha*0.7 + ')';
	 	ctx.lineWidth = 2;

        ctx.beginPath();
		ctx.moveTo(this.w_pos.x, this.w_pos.y);
		ctx.lineTo(this.text_pos.x, this.text_pos.y);
		ctx.stroke();

		//	●の描画.
		
		/*
		if (this.class_name == "SP9")
			ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';
		else if (this.class_name == "SP8")
			ctx.fillStyle = 'rgba(34, 34, 0, 1.0)';
		else if (this.class_name == "SP4")
			ctx.fillStyle = 'rgba(34, 0,  34, 1.0)';
		else
			ctx.fillStyle = 'rgba(34, 34, 34, 1.0)';
*/
		ctx.fillStyle = this.color;

		ctx.beginPath();
		ctx.arc(self.w_pos.x, self.w_pos.y, 8, 0, Math.PI*2, false);
		ctx.fill();

	};


	this.drawMyCar = function(ctx, scale)
	{
 	// ウィンドウ.
		 	var window_w = 130;
		 	var window_h = 50;
		 	var target_x = this.w_pos.x + 20.0;
		 	var target_y = this.w_pos.y - 20.0;

		 	if (target_x > (sys_work.SCR_W/2 - window_w))
		 		target_x = (sys_work.SCR_W/2 - window_w);

		 	this.window_pos.x += (target_x - this.window_pos.x) * 0.05;
		 	this.window_pos.y += (target_y - this.window_pos.y) * 0.05;
		 	if (this.window_pos.x　== 0)
		 	{
		 		this.window_pos.x = traget_x;
		 		this.window_pos.y = traget_y;
		 	}

		 	var window_x = this.window_pos.x;
		 	var window_y = this.window_pos.y;

		 	ctx.strokeStyle = 'rgba(32, 32, 32, 0.7)';
		 	ctx.lineWidth = 2;

            ctx.beginPath();
			ctx.moveTo(this.w_pos.x, this.w_pos.y);
			ctx.lineTo(window_x, window_y);
			ctx.stroke();

		 	ctx.fillStyle = 'rgba(32, 32, 32, 0.7)';
            ctx.beginPath();
		 	ctx.fillRect(window_x, window_y - window_h, window_w, window_h);

    		//	テキスト描画.
    		var l_pad = 5;
    		ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';

    		//	自車のときの表示.
    		{
    			ctx.font="20px Arial";
    			ctx.fillText("Gozz:" + this.no,  window_x + l_pad, window_y - window_h + 20);
    			ctx.fillText((this.velocity).toFixed(0) + "km/h",  window_x + l_pad, window_y - window_h + 20*2);
    		}


			//	●の描画.
			if(this.d_brake == 0) {
				ctx.fillStyle = 'rgba(0, 128, 0, 1.0)';
			} else {
				ctx.fillStyle = 'rgba(255, 0, 128, 1.0)';		//	減速中.
			}
			ctx.beginPath();
			ctx.arc(this.w_pos.x, this.w_pos.y, 8, 0, Math.PI*2, false);
			ctx.fill();

            
            // 点滅.
            this.anim_rate += (1.0 - this.anim_rate) * 0.08;
            this.anim_cnt++;
            if (this.anim_cnt>60*2)
            {
            	this.anim_cnt = 0;
            	this.anim_rate = 0;
            }
            //ctx.strokeStyle = 'rgba(255, 0, 128, 1.0)';
            var alpha = (1.0-this.anim_rate);
            ctx.strokeStyle = 'rgba(255, 0, 128,' + alpha + ')';
		    ctx.lineWidth = 15*(1.0-this.anim_rate);
            ctx.beginPath();
			ctx.arc(this.w_pos.x, this.w_pos.y, this.anim_rate*30, 0, Math.PI*2, false);
		 	ctx.stroke();
	}
}; // OCarObj

OCarObj.prototype = {
	id					: 0,
	no  				: 0,
	color				: "",
	name				: "",
	team				: "",
	class_name          : "",
	tgt_pos				: new Vector2(),	//	ワールド座標ターゲット.
	w_pos				: new Vector2(),	//	ワールド座標.
	text_pos			: new Vector2(),	//	テキスト座標.
	velocity			: 0,				//	移動速度.
	timestamp			: '1970-01-01 00:00:00',

		// アニメ.
	anim_rate           : 0,
	anim_cnt            : 0,
	window_pos          : new Vector2(),
	};




/////////////////////////////////////////////////////////////////
// イエローゾーン情報
function YerllowCarObj(pos) {
	var		self		= this;
	self.alpha = 0.5;
	self.finished = 0;
	self.w_pos = pos;

	this.exec = function(work) {
		var start_cnt = 10*60;
		var end_cnt = 20*60;

		if (!self.finished && self.cnt < end_cnt)
		{
			self.cnt++;
			if (self.cnt > start_cnt)
			{
				// 透明度アニメ
				self.alpha = (end_cnt - self.cnt)/(end_cnt - start_cnt)*0.5;
			}
		}
		else
		{
			self.finished = 1.0;
			self.alpha = 0.0;
		}
	};


	this.draw = function(ctx, scale) {
		//	●の描画.
		ctx.fillStyle = 'rgba(255, 255, 0, ' + self.alpha + ')';

		ctx.beginPath();
		ctx.arc(self.w_pos.x, self.w_pos.y, 8, 0, Math.PI*2, false);
		ctx.fill();

		//ctx.font="15px Arial";
		//sys_work.ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
		//ctx.fillText( " pos y:" + this.w_pos.y, this.w_pos.x + 10, this.w_pos.y);

	};
}; // YellowCarObj

YerllowCarObj.prototype = {
	cnt                 : 0,
	finished            : 0,
	alpha               : 0.8,
	w_pos				: new Vector2(),	//	ワールド座標.
	};

/////////////////////////////////////////////////////////////////
// 敵車オブジェクト本体.
function OtherCarObject() {
	var		self		= this;
	//	ゲームオブジェクト.
	this.cars		= new Array();
	this.yerllows   = new Array();

	//	初期化.
	this.initialize = function() {
  /*
		var other_car_list = [
		  [216678,   1, "Audi R8", "PHX R8", "SP9 G", "blue"],
		  [216514,   2, "Audi R8", "Mamerow", "SP9 G", "black"],
		  [216530,   3, "Audi R8", "PHOENIX", "SP9 G", "blue"],
		  [216524,  10, "SLS",     "Black Falcon", "SP9 G", "black"],
		  [216853,  29, "Audi",    "Belgian Audi", "SP9 G", "black"],
		  [216530,   4, "Audi",    "PHOENIX", "SP9 G", "black"],
		  [216850,   7, "Aston",   "Aston", "SP9 G", "black"],
		  [216885,  50, "Manthey", "Manthey", "SP9 G", "black"],
		  [216680,   9, "Black Falcon", "BF SLS", "SP9 G", "black"],
		  [216521,  25, "BMW",           "BMW Z4", "SP9 G", "black"],
		  [216532,  20, "Schubert",      "ScbrtZ4", "SP9 G", "black"],
		  [216706,  26, "BMW",    "BMW Z4", "SP9 G", "black"],
		  [216588,  22, "ROWE",   "ROWE SLS", "SP9 G", "blue"],
		  [216582,  11, "Frikadelli Racing Team",   "911 GT3", "SP9 G", "gray"],
		  [216533,  23, "ROWE",   "ROWE SLS", "SP9 G", "orange"],
		  [216531,  19, "BMW",   "ScbrtZ4", "SP9 G", "red"],
		  [216541,  45, "Timbuli",   "911 GT3", "SP9 G", "yellow"],
		  [216852,  63, "BlackFalcon",   "BF SLS", "SP9 G", "gray"],
		  [216547,  18, "Manthey",   "911 RSR", "SP7", "yellow"],
		  [216592,   8, "Haribo",   "Haribo911", "SP9 G", "gray"],
		  [216525,  21, "ROWE",   "ROWE SLS", "SP9 G", "gray"],
		  [216605,  44, "Falken", "Falken", "SP9 G", "blue"],
		  [216546,  12, "Manthey", "Manthey", "SP7", "green"],
		  [216519,  14, "Audi",   "R8", "SP9 G", "gray"],
		  [216539,  40, "Manthey",  "Manthey", "SP9 G", "green"],
		  [216540,  16, "BUSCH",   "R8", "SP9 G", "orange"],
		  [216527,  17, "Farnbacher",   "", "997", "gray"],
		  [216518,  15, "TKL",   "R8", "SP9 G", "gray"],
		  [216696,  76, "Corse",   "458", "SP8", "gray"],
		  [216526, 125, "ROWE",   "ROWE SLS", "SP9 G", "gray"],
		  [216554,  36, "Kremer",   "Kremer", "SP9 G", "gray"],
		  [216536,  27, "De Lorenzi",   "997", "SP9 G", "gray"],
		  [216559,  88, "Haribo",   "Haribo", "SP9 G", "gray"],
		  [216572,  24, "BMW Z4",   "W-MS Z4", "SP9 G", "gray"],
		  [216544,  55, "BF",   "BF 911", "SP9 G", "gray"],
		  [216528,  28, "Manthey",   "Manthey", "SP9 G", "gray"],
		  [216534,  69, "Dörr",   "Dörr MP4", "SP9 G", "gray"],
		  [216552,  53, "",   "997cup", "SP7", "gray"],
		  [216566,  39, "",   "997cup", "SP7", "gray"],
		  [216889, 105, "Beaspe",   "AudiTT", "SP4T", "gray"],
		  [216578,  78, "IS-F",    "IS-F", "SP8", "red"],
		  [216580,  79, "LFA",     "LFA", "SP8", "yellow"],
		  [216542, 100, "Aston", "Aston", "E1-XP2", "blue"],
		  [216618, 102, "Scirocco", "Götz", "SP3T", "white"],
		  [216638, 111, "Audi TT", "Raeder", "SP3T", "yellow"],
		  [216622, 120, "Subaru", "STI", "SP3T", "blue"],
		  [216615, 135, "86", "86", "SP3", "red"],
		  [216616, 136, "86", "86", "SP3", "green"],
		  [216535, 123, "GT-R GT3", "Schulze",        "SP9 G", "blue"],
		];

		
		  //[216523, 2, "BMW Z4 GT3", "BMW", "SP9", "green"],
		  //[216524, 3, "Mercedes-Benz SLS", "Black Falcon Team TMD Friction", "SP9", "green"],
		  //[216605, 4, "Porsche 911 GT3 R", "Falken Motorsport", "SP9", "green"],
		  //[216678, 5, "Audi R8 LMS ultra", "G-DRIVE RACING by PHOENIX", "SP9", "green"],
		  //[216577, 135, "Lexus IS-F", "Ring Racing", "SP8", "green"],
		  //[216578, 136, "Lexus IS-F", "Ring Racing", "SP8", "green"],
		  //[216717, 532, "Toyota GT86", "Ring Racing", "SP4", "green"],
		  //[216623, 312, "VW Golf GTI", "HTF Motorsport", "SP3T", "green"],
		  //[216683, 422, "BMW M3 CSL", "R. Wagner Motorsport GmbH", "V6", "green"],
		*/

		var other_car_list = [
		  [216618, 300, "VW Scirocco GT 24", "Götz Motorsport", "SP3", "green"],
		  ];

		for(var lp1 = 0; lp1 < other_car_list.length; lp1++)
		{
			var oc = other_car_list[lp1];
			var obj = new OCarObj(oc[0], oc[1], oc[2], oc[3], oc[4], oc[5]);
			this.cars.push (obj);
		}

		// データ更新開始.
		this.updateOtherCarData();
	};

	//	メッセージ処理.
	this.execCommand = function(command) {
		switch(command[0]) {
		case "RESTART":
			self.exec_mode	= 0;
			break;
		}
	};

	//	実行処理.
	this.exec = function(work) {
		switch(this.exec_mode) {
		case 0:			//	読み込み待ち.
			if(work.game_mode > GAME_MODE.LOAD_COURSE) {
				this.exec_mode++;
			}
			break;
		}

        // イエローゾーン
		for(var lp1 = 0; lp1 < self.yerllows.length; lp1++) {
			self.yerllows[lp1].exec(work);
		}

        // 避ける処理.
		//	GameObjを実行する.
		//for(var lp1 = 0; lp1 < self.cars.length; lp1++) {
		//	var obj = self.cars[lp1];
		//}
	};

	// 避ける.
	this.avoid = function (idx)
	{
		var my_obj = self.cars[idx];
		for(var lp1 = 0; lp1 < self.cars.length; lp1++) {
			if (lp1 == idx)
				continue;

			var obj = self.cars[lp1];
		}
	}



	//	描画処理.
	this.draw = function(ctx, scale) {
		if(this.exec_mode < 1)
			return;


		// イエローゾーン
		for(var lp1 = 0; lp1 < self.yerllows.length; lp1++) {
			self.yerllows[lp1].draw(ctx, scale);
		}

		//	GameObjを実行する.
		for(var lp1 = 0; lp1 < self.cars.length; lp1++) {
			self.cars[lp1].draw(ctx, scale);
		}

	};

	//	他車情報更新.
	this.updateOtherCarData = function(work) {
		//var now = new Date();
		//var request_url = "http://live.racing.apioverip.de/WEBNGR24_positions.jsonp?evaluate=evaluate&_=" + now.getTime();
		//sendRequest(on_loaded, '', 'GET', request_url, true, true);
//                                jsonpCallback:'evaluate',
                                //jsonp:'evaluate',

        var jsonp = 'http://live.racing.apioverip.de/WEBNGR24_positions.jsonp';
        var request = $.ajax({url:jsonp, 
                                dataType:'jsonp',
                                cache:false,
                                context:this

                            }
                            ).then(
        						function(data) { this.evaluate(data); },
        						function(data) { this.updateOtherCarData(); }
       						);
        var now = new Date();
    }

	// 敵車コールバック.
	this.evaluate = function(json)
	{
	    if(typeof(json)=='string') json=eval("("+json+")");

	    if(json){
	        var oDevice;
	        var i=0;

	        //イエローのクリア.
	        //delete sys_work.other_car_obj.yerllows;
	        //sys_work.other_car_obj.yerllows = new Array();


	        for(i in json){
	            oDevice=json[i];                   
	            if ((oDevice.NS != "undefined") && (oDevice.WE != "undefined"))
	            {
	            	// 登録敵車とのマッチング.
	            	var pos = sys_work.course_obj.convGPSV2Pos (oDevice.NS, oDevice.WE);
	                for(var lp1 = 0; lp1 < sys_work.other_car_obj.cars.length; lp1++)
	                {
	                	var obj = sys_work.other_car_obj.cars[lp1];
	                	if (obj.id == oDevice.id)
	                	{
	                		if (obj.timestamp == '1970-01-01 00:00:00')
	                		{
	                			obj.w_pos = pos;
	                			obj.tgt_pos = obj.w_pos;
	                		}
	                		else
	                		{
	                			obj.tgt_pos = pos;
	                		}

	                		obj.timestamp = oDevice.ts;
	                		obj.velocity = oDevice.speed;
	  		                //console.log("inner: " + oDevice.id + "  NS:" + oDevice.NS + "  WE:" + oDevice.WE + "  SPEED:" + oDevice.speed*1.6 + " ts:" + oDevice.ts);
	                	}
	                }

	                //イエローの処理.
	                if (0 < oDevice.speed && oDevice.speed <= 70 && pos.y < 200)
	                {
	                	sys_work.other_car_obj.yerllows.push(new YerllowCarObj(pos));
	                	// オブジェクト数制限
	                	if (sys_work.other_car_obj.yerllows.length > 300)
	  		              	sys_work.other_car_obj.yerllows.shift();
	                }
	            }
			}
	    }

	    // wait
	    //sleep(2000);

	    //再呼び出し。
	    this.updateOtherCarData();
	}
}; // OhterCarObject


OtherCarObject.prototype = {

	exec_mode			: 0,
};






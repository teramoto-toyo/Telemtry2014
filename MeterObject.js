//	クルマオブジェクト本体.
function MeterObject() {
	var		self		= this;
	var     exec_mode   = 0;

	//	初期化.
	this.initialize = function() {
		this.g_val = new Vector2();
	};

	//	メッセージ処理.
	this.execCommand = function(command) {
		switch(command[0]) {
		case "RESTART":
			self.exec_mode	= 0;
			self.initMove();				//	移動パラメータの初期化.
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

		if (work.g_array.length>0)
		{
			var tgt = work.g_array[work.g_array.length-1];

			self.g_val.x += (tgt.x - self.g_val.x)*0.1;
			self.g_val.y += (tgt.y - self.g_val.y)*0.1;
		}
	};



		//	描画処理.
	this.draw = function(ctx, scale) {
		if(this.exec_mode < 1)
			return;
		// main_meter.
		self.drawTemp (ctx, scale);
		self.drawG (ctx, scale);
		self.drawGas (ctx, scale);
		self.drawStint (ctx, scale);
	};


	// 水温系 /////////////////////////////////////////////
	this.drawTemp = function(ctx, scale) {
			ctx.strokeStyle = 'rgba(32, 32, 32, 1.0)';
		 	ctx.lineWidth = 1;

		 	var win_x = 230;
		 	var win_y = 110;

		 	var width  = 250;
		 	var height = 250;



		 	// window
            ctx.beginPath();
			ctx.moveTo(win_x, win_y);
			ctx.lineTo(win_x + width, win_y);
			ctx.lineTo(win_x + width, win_y+height);
			ctx.lineTo(win_x, win_y+height);
			ctx.lineTo(win_x, win_y);
			ctx.closePath();
			ctx.stroke();

			//	テキスト描画.
    		var l_pad = 5;
    		ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    		ctx.lineWidth = 1;

    		//	パラメータ
    		var l_pad  = 20;
    		var l_pad2 = 180;

    		var h_diff = 23;
    		var y_upper = h_diff*3 + 20;
    	
			ctx.font="20px Arial";
			
			ctx.fillStyle = 'rgba(225,   0, 0, 1.0)'; ctx.fillText("Engine Temp    ",                     win_x + l_pad,  win_y - y_upper + h_diff);
			ctx.fillStyle = 'rgba(225,   0, 0, 1.0)'; ctx.fillText(sys_work.db_eng_temp.toFixed(2),       win_x + l_pad2, win_y - y_upper + h_diff);
			ctx.fillStyle = 'rgba(0,   225, 0, 1.0)'; ctx.fillText("Engine Oil Temp",                     win_x + l_pad, win_y - y_upper + h_diff*2);
			ctx.fillStyle = 'rgba(0,   225, 0, 1.0)'; ctx.fillText(sys_work.db_eng_oil_temp.toFixed(2),                     win_x + l_pad2, win_y - y_upper + h_diff*2);
			ctx.fillStyle = 'rgba(0, 0,   225, 1.0)'; ctx.fillText("Gear Oil Temp  ",                     win_x + l_pad, win_y - y_upper + h_diff*3);
			ctx.fillStyle = 'rgba(0, 0,   225, 1.0)'; ctx.fillText(sys_work.db_gbox_oil_temp.toFixed(2),                     win_x + l_pad2, win_y - y_upper + h_diff*3);


			var graph_diff_y = height / 6;

			// メモリ読み
			ctx.font="10px Arial";
			ctx.fillStyle = 'rgba(25, 25, 25, 1.0)';
			ctx.fillText("120", win_x - 20, win_y + 5);
			ctx.fillText("100", win_x - 20, win_y + graph_diff_y * 2 + 5);
			ctx.fillText("60",  win_x - 15, win_y + height + 2);

			ctx.fillText("old",  win_x, win_y + height + 15);
			ctx.fillText("now",  win_x + width - 20, win_y + height + 15);

			// graph grid
			ctx.strokeStyle = 'rgba(25, 25, 25, 0.5)';
			ctx.lineWidth = 0.5;
            ctx.beginPath();
			ctx.moveTo(win_x,         win_y + graph_diff_y);
			ctx.lineTo(win_x + width, win_y + graph_diff_y);
			ctx.moveTo(win_x,         win_y + graph_diff_y * 2);
			ctx.lineTo(win_x + width, win_y + graph_diff_y * 2);
			ctx.moveTo(win_x,         win_y + graph_diff_y * 3);
			ctx.lineTo(win_x + width, win_y + graph_diff_y * 3);
			ctx.moveTo(win_x,         win_y + graph_diff_y * 4);
			ctx.lineTo(win_x + width, win_y + graph_diff_y * 4);
			ctx.moveTo(win_x,         win_y + graph_diff_y * 5);
			ctx.lineTo(win_x + width, win_y + graph_diff_y * 5);
			ctx.closePath();
			ctx.stroke();

			// graph
			if (sys_work.eng_tmp_array.length>=2) {
				for (var lp1 = sys_work.eng_tmp_array.length-1 ; lp1 >= 0 ; lp1--) {
					ctx.strokeStyle = 'rgba(225,   0, 0, 1.0)';
					this.drawGraphPart(ctx, sys_work.eng_tmp_array, lp1, win_x, win_y, width, height);
					ctx.strokeStyle = 'rgba(0,   225, 0, 1.0)';
					this.drawGraphPart(ctx, sys_work.eng_oil_array, lp1, win_x, win_y, width, height);
					ctx.strokeStyle = 'rgba(0,   0, 225, 1.0)';
					this.drawGraphPart(ctx, sys_work.gbox_oil_array, lp1,win_x, win_y, width, height);
				}
			}
						
	};

	this.drawGraphPart = function(ctx, array, idx, win_x, win_y, width, height) {
	 	var bottom = win_y  + height;

	 	var max = sys_work.eng_tmp_array.length-1;
	 	var from_right = max - idx;

	 	var x0 = win_x + width - (width/100)*(from_right);
	 	var x1 = win_x + width - (width/100)*(from_right+1);

		var y0 = bottom - (array[idx]- 60)/60*height;
		var y1 = bottom - (array[idx-1]- 60)/60*height;

		if (y0 > bottom) { y0 = bottom; }
		if (y1 > bottom) { y1 = bottom; }
		if (y0 < win_y) { y0 = win_y; }
		if (y1 < win_y) { y1 = win_y; }

		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.closePath();
		ctx.stroke();	
	}


	// G meter /////////////////////////////////////////////
	this.drawG = function(ctx, scale) {
			ctx.strokeStyle = 'rgba(32, 32, 32, 1.0)';
		 	ctx.lineWidth = 1;

		 	var win_x = 330;
		 	var win_y = 400;

		 	var width  = 150;
		 	var height = 150;



		 	// window
            ctx.beginPath();
			ctx.moveTo(win_x, win_y);
			ctx.lineTo(win_x + width, win_y);
			ctx.lineTo(win_x + width, win_y+height);
			ctx.lineTo(win_x, win_y+height);
			ctx.lineTo(win_x, win_y);
			ctx.closePath();
			ctx.stroke();

			//	テキスト描画.
    		var l_pad = 5;
    		ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    		ctx.lineWidth = 1;

    		//	パラメータ
			var graph_diff = height / 4;

			// メモリ読み
			ctx.font="10px Arial";
			ctx.fillStyle = 'rgba(25, 25, 25, 1.0)';
			ctx.fillText("2.00G",            win_x - 30, win_y + 5);
			ctx.fillText(sys_work.db_g_long.toFixed(2),  win_x - 30, win_y + graph_diff * 2 + 5);
			ctx.fillText("-2.00G",           win_x - 35, win_y + height + 10);
			ctx.fillText(sys_work.db_g_lat.toFixed(2), win_x + graph_diff * 2 - 15, win_y + height + 10);
			ctx.fillText("2.00G",            win_x + width - 20,     win_y + height + 10);

			// graph grid
			ctx.strokeStyle = 'rgba(25, 25, 25, 0.5)';
			ctx.lineWidth = 1;

            ctx.beginPath();
			ctx.moveTo(win_x,         win_y + graph_diff);
			ctx.lineTo(win_x + width, win_y + graph_diff);
			ctx.moveTo(win_x,         win_y + graph_diff * 2);
			ctx.lineTo(win_x + width, win_y + graph_diff * 2);
			ctx.moveTo(win_x,         win_y + graph_diff * 3);
			ctx.lineTo(win_x + width, win_y + graph_diff * 3);

			ctx.moveTo(win_x + graph_diff,     win_y );
			ctx.lineTo(win_x + graph_diff,     win_y + height);
			ctx.moveTo(win_x + graph_diff * 2, win_y );
			ctx.lineTo(win_x + graph_diff * 2, win_y + height);
			ctx.moveTo(win_x + graph_diff * 3, win_y );
			ctx.lineTo(win_x + graph_diff * 3, win_y + height);
			ctx.closePath();
			ctx.stroke();

			// ○書く
			for(var lp1=0; lp1<sys_work.g_array.length-1; lp1++)
			{
				var val = sys_work.g_array[lp1];
				var pos = new Vector2();

				pos.x = win_x + width/2.0  + width*val.x/4.0; 
				pos.y = win_y + height/2.0 - height*val.y/4.0; 

				//	●の描画.
				if(sys_work.g_array.length-1 == lp1) {
					ctx.fillStyle = 'rgba(255, 0, 0, 1.0)';
					ctx.beginPath();
					ctx.arc(pos.x, pos.y, 4, 0, Math.PI*2, false);
					ctx.fill();
				} else {
					var alpha = lp1/sys_work.g_array.length;
					ctx.strokeStyle = 'rgba( 25,25, 25,' + alpha + ')';
					ctx.beginPath();
					ctx.arc(pos.x, pos.y, 4, 0, Math.PI*2, false);
					ctx.stroke();
				}
			}

			//	
			{
				var pos = new Vector2();

				pos.x = win_x + width/2.0  + width*self.g_val.x/4.0; 
				pos.y = win_y + height/2.0 - height*self.g_val.y/4.0; 

				//	●の描画.
				ctx.fillStyle = 'rgba(255, 0, 0, 1.0)';
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, 4, 0, Math.PI*2, false);
				ctx.fill();
			}					
	};

	// Gas meter /////////////////////////////////////////////
	this.drawGas = function(ctx, scale) {
			ctx.strokeStyle = 'rgba(32, 32, 32, 1.0)';
		 	ctx.lineWidth = 5;

		 	var win_x = -80;
		 	var win_y = -270;

		 	var width  = 30;
		 	var height = 250;

		 	var fuel_max = 125;



		 	// window
            ctx.beginPath();
			ctx.moveTo(win_x, win_y);
			ctx.lineTo(win_x + width, win_y);
			ctx.lineTo(win_x + width, win_y+height);
			ctx.lineTo(win_x, win_y+height);
			ctx.lineTo(win_x, win_y);
			ctx.closePath();
			ctx.stroke();

			//	テキスト描画.
    		var l_pad = 5;
    		ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    		ctx.lineWidth = 1;

    		//	パラメータ
			var graph_diff = height / 4;

			// メモリ読み

			var fuel_remain = fuel_max  - sys_work.db_fuel_used;
			ctx.font="15px Arial";
			ctx.fillStyle = 'rgba(25, 25, 25, 1.0)';
//			ctx.fillText("125",            win_x + width + 3, win_y);
			
//			ctx.fillText("0",         　　  win_x + width + 3, win_y + height - 0);

			ctx.font="20px Arial";
//			ctx.fillText("fuel",      win_x, win_y + height + 20);
//			ctx.fillText("used",      win_x-5, win_y + height + 40);

			
			ctx.fillText(sys_work.db_fuel_used.toFixed(2),  win_x + width + 3, win_y + graph_diff * 2 + 5);

			ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
		 	ctx.fillRect(win_x, win_y, width, height);

			ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
            ctx.beginPath();
		 	ctx.fillRect(win_x, win_y, width, height*fuel_remain/fuel_max );
			
	};



	// スティント meter /////////////////////////////////////////////
	this.drawStint = function(ctx, scale) {
			ctx.strokeStyle = 'rgba(32, 32, 32, 1.0)';
		 	ctx.lineWidth = 1;

		 	var win_x = -430;
		 	var win_y = 450;

		 	var width  = 700;
		 	var height = 100;

		 	// window
            ctx.beginPath();
			ctx.moveTo(win_x, win_y);
			ctx.lineTo(win_x + width, win_y);
			ctx.lineTo(win_x + width, win_y+height);
			ctx.lineTo(win_x, win_y+height);
			ctx.lineTo(win_x, win_y);
			ctx.closePath();
			ctx.stroke();

			//	テキスト描画.
    		var l_pad = 5;
    		ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    		ctx.lineWidth = 1;

    		//	パラメータ
			var graph_diff_h = height / 4;
			var graph_diff_w = width / 24;

			// メモリ読み
			var pad = 17;
			ctx.font="10px Arial";
			ctx.fillStyle = 'rgba(25, 25, 25, 1.0)';
			ctx.fillText("Yamauchi",  win_x - 50, win_y + pad);
			ctx.fillText("Tobias",    win_x - 50, win_y + graph_diff_h  + pad);
			ctx.fillText("Michael",   win_x - 50, win_y + graph_diff_h * 2 + pad);
			ctx.fillText("Jordan",     win_x - 50, win_y + graph_diff_h * 3 + pad);
			
			var four_diff = graph_diff_w*4;
			ctx.fillText("Start",     win_x,                   win_y + height + 10);
			ctx.fillText("4",      win_x + four_diff - 5,          win_y + height + 10);
			ctx.fillText("8",      win_x + four_diff * 2 - 5,      win_y + height + 10);
			ctx.fillText("12",     win_x + four_diff * 3 - 5,      win_y + height + 10);
			ctx.fillText("16",     win_x + four_diff * 4 - 5,      win_y + height + 10);
			ctx.fillText("20",     win_x + four_diff * 5 - 5,      win_y + height + 10);
			ctx.fillText("goal",   win_x + four_diff * 6 - 20,     win_y + height + 10);
			
			ctx.fillText("16:00",     win_x,                   win_y + height + 20);
			ctx.fillText("20:00",      win_x + four_diff - 5,          win_y + height + 20);
			ctx.fillText("0:00",      win_x + four_diff * 2 - 5,      win_y + height + 20);
			ctx.fillText("4:00",     win_x + four_diff * 3 - 5,      win_y + height + 20);
			ctx.fillText("8:00",     win_x + four_diff * 4 - 5,      win_y + height + 20);
			ctx.fillText("12:00",     win_x + four_diff * 5 - 5,      win_y + height + 20);
			ctx.fillText("16:00",   win_x + four_diff * 6 - 20,     win_y + height + 20);



			// graph grid
			ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)';
			ctx.lineWidth = 1;

            ctx.beginPath();
			ctx.moveTo(win_x,         win_y + graph_diff_h);
			ctx.lineTo(win_x + width, win_y + graph_diff_h);
			ctx.moveTo(win_x,         win_y + graph_diff_h * 2);
			ctx.lineTo(win_x + width, win_y + graph_diff_h * 2);
			ctx.moveTo(win_x,         win_y + graph_diff_h * 3);
			ctx.lineTo(win_x + width, win_y + graph_diff_h * 3);

			ctx.closePath();
			ctx.stroke();

			//ctx.moveTo(win_x + graph_diff,     win_y );
			//ctx.lineTo(win_x + graph_diff ,     win_y + height);
			ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)';
			ctx.lineWidth = 1;

			
			for (lp1=0; lp1<24; lp1++)
			{
				ctx.beginPath();
				ctx.moveTo(win_x + graph_diff_w * lp1, win_y );
				ctx.lineTo(win_x + graph_diff_w * lp1, win_y + height);
				ctx.closePath();
				ctx.stroke();
			}
			
			// stint bar
			var wet_time = 10.5;
			var dry_time = 9;
			var wet_lap = 9;
			var dry_lap = 7;

			var wet_stint = wet_time * wet_lap;
			var dry_stint = dry_time * dry_lap;

			// driver = 99：修理時間 98 : 赤旗

			var stint_data = [
				{ "driver" : 2, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 0, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 3, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 1, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 0, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 3, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 1, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 3, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 2, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 1, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 2, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 1, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 0, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 2, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 3, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 0, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 2, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 3, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 1, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 0, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 2, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
				{ "driver" : 3, "time" : dry_stint }, { "driver" : 99, "time" : 3 },
			];
			
			var cor = 0;
			var yam_cor = 0;
			var tob_cor = 1;
			var mic_cor = 2;
			var kru_cor = 3;
			
			//これだと蓄積後に誤差が出てる↓
			//var std_wid = Math.floor(600 / 24 / 60 * 100) / 100; // 1分あたりのピクセル数
			var next_target_x = 0;
			var bar_height = height / 4;
			var total_min = 24*60;
			var min_cnt = 0;
			
			for(i = 0; i < stint_data.length; i++)
			{
				var stint_x = win_x + (min_cnt/total_min)*width;
				var stint_time = stint_data[i].time;
				var stint_width = (stint_time/total_min)*width;

				ctx.fillStyle = 'rgba(40, 40, 200, 0.8)';

				if(stint_x + stint_width >=  win_x + width)
				{
					stint_width = (win_x+width) - stint_x;
					stint_time = total_min - min_cnt;
				}
				bar_height = height / 4;
				
				if(stint_data[i].driver == 0)
					cor = yam_cor;
				else if(stint_data[i].driver == 1)
					cor = tob_cor;
				else if(stint_data[i].driver == 2)
					cor = mic_cor;
				else if(stint_data[i].driver == 3)
					cor = kru_cor;
				else if(stint_data[i].driver == 99) {
					cor = stint_data[i-1].driver;
					bar_height = height / 4;
					ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
				}
				else if(stint_data[i].driver == 98) {
					cor = 0;
					bar_height = height;
					ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
				}
				
				var stint_y = win_y + (height / 4) * cor;
				ctx.fillRect(stint_x, stint_y, stint_width, bar_height);
				
				// stint info
				if (stint_width > 20)
				{
					ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
					//ctx.fillText(stint_time + "min", stint_x+5, stint_y+10);

					var driver_name = "YM";
					if(stint_data[i].driver == 1)
					  driver_name = "TS";
					else if(stint_data[i].driver == 2)
					  driver_name = "MS";
					else if(stint_data[i].driver == 3)
					  driver_name = "JT";

					ctx.fillText(driver_name, stint_x+5, stint_y+10);

					var stint_hour_val = min_cnt/60 + 17;
					if (stint_hour_val>=24)
						stint_hour_val -= 24;

					var stint_hour = Math.floor(stint_hour_val);
					var stint_min = Math.floor((stint_hour_val - stint_hour)*60)-1;
					stint_min = conv2fixed(stint_min);

					ctx.fillText(stint_hour + ":" + stint_min, stint_x+5, stint_y+20);
				}
			
				min_cnt += stint_time;
			}
			
			// 現在時刻バー
			var local_time = new Date ();
			var goal_time =  new Date (2014, 6, 21, 16, 00, 00);
			var rest_min = (goal_time.getTime() - local_time.getTime())/60000;
			if (rest_min<0)
				rest_min = 0;

			var time_x = width - ((rest_min/total_min)*width);

			ctx.strokeStyle = 'rgba(0, 255, 0, 1.0)';
			ctx.lineWidth = 2;

            ctx.beginPath();
			ctx.moveTo(win_x + time_x, win_y);
			ctx.lineTo(win_x + time_x, win_y + height);

			ctx.closePath();
			ctx.stroke();

			ctx.font="10px Arial";
			ctx.fillStyle = 'rgba(25, 25, 25, 1.0)';
			ctx.fillText("now",  win_x + time_x - 8, win_y - 5);


	};


	// メーター  /////////////////////////////////////////////
	this.drawMeter = function(ctx, scale) {
			var main_meter_x = 0;
			var main_meter_y = 300;
			ctx.drawImage(sys_work.meter_img, main_meter_x, main_meter_y, 495, 119);

            // スピードメーター.
            //   0 km/h = -103 deg.
            // 320 km/h =   88 deg.
            var target_deg = 191/320.0 * sys_work.car_obj.velocity - 103;
            this.spd_deg += (target_deg - this.spd_deg) * 0.04;
            //var rot_rad = Math.PI * 2/360 * (fc.controller.getValue(0)-180);
            var rot_rad = Math.PI * 2/360 * this.spd_deg;

            // 左上
            var lx = main_meter_x+161;
            var ly = main_meter_y+10;
            // 回転中心.
            var cx = lx + 15;  // 左上 ＋幅
            var cy = ly + 72;   // 左上 +回転中心
            ctx.save();
			ctx.translate(cx,cy);
			ctx.rotate(rot_rad);  // 座標(0,0)を中心として時計回りにθ回転
			ctx.translate(-1 * cx,-1 * cy);  // x軸方向に-cx、y軸方向に-cy移動
			ctx.drawImage(sys_work.needle_img, lx, ly, 31, 89);

			// タコメーター/
            //    0 rpm =   -90 deg.
            // 9000 rpm =   100 deg.
            //var rot_rad = Math.PI * 2/360 * (fc.controller.getValue(0)-180);
            target_deg = (190/9000.0 * sys_work.db_engine_rpm) - 90;
            this.tacho_deg += (target_deg - this.tacho_deg) * 0.02;
            var rot_rad = Math.PI * 2/360 * this.tacho_deg;

            // 左上
            ctx.restore();
            lx = main_meter_x+396;
            ly = main_meter_y+10;
            // 回転中心.
            cx = lx + 15;  // 左上 ＋幅
            cy = ly + 72;   // 左上 +回転中心
			ctx.translate(cx,cy);
			ctx.rotate(rot_rad);  // 座標(0,0)を中心として時計回りにθ回転
			ctx.translate(-1 * cx,-1 * cy);  // x軸方向に-cx、y軸方向に-cy移動
			ctx.drawImage(sys_work.needle_img, lx, ly, 31, 89);
			ctx.save();
	}
};


MeterObject.prototype = {

	spd_deg				: -103,        		//  スピードメーター.
	tacho_deg           : -90,              //  タコメーター.
	//	デバッグ用ワーク.
	debug_flag			: "",				//	デバッグ表示切替用.
	d_acl				: 0,				//	デバッグ用加減速.

	exec_mode			: 0,
	g_val               : {}
	};


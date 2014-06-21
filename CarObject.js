//	クルマオブジェクト本体.
function CarObject() {
	var		self		= this;

	//	初期化.
	this.initialize = function() {
		this.window_pos.x = 0;
		this.window_pos.y = 0;
	};

	//	メッセージ処理.
	this.execCommand = function(command) {
		switch(command[0]) {
		case "RESTART":
			self.exec_mode	= 0;
			self.initMove();				//	移動パラメータの初期化.

			//	とりあえず位置の初期化.
			if(self.car_num == 0) {
				self.crs_pos = 0;
			} else {
				self.crs_pos = 30 - (self.car_num-1) * 30;
			}

			//	描画座用に変換する.
			self.w_pos = sys_work.course_obj.convCrsDis2Pos(self.crs_pos);
			break;
		}
	};

	//	実行処理.
	this.exec = function(work) {
                //console.log(this.exec_mode);
		switch(this.exec_mode) {
		case 0:			//	読み込み待ち.
			if(work.game_mode > GAME_MODE.LOAD_COURSE) {
				//	描画座用に変換しておく.
				this.w_pos = work.course_obj.convCrsDis2Pos(this.crs_pos);

				this.exec_mode++;
			}
			break;

		case 1:	//	実行処理.
			//	移動処理.
			
			//	補間処理.
            var v_value = work.db_lap_distance; 

            var offset = document.getElementById("test_id").value;

            if (isFinite(offset))
            {
            	v_value += Number(offset);
            }

			//var v_value = document.getElementById("test_id").value; //テキストフォームの値
			var target = work.course_obj.limitDis(v_value);

			if (target < this.crs_pos)
			{
				target = 0;
				this.crs_pos = 0;
			}

			// 異常なV更新
			if (v_value == 0 && this.warning_v == 0)
			{
				if( this.old_crs_v > 500 && this.old_crs_v < 240000 )
				{
					// old_vがおかしい
					this.warning_v = this.old_crs_v;
					this.warning_speed = this.old_speed;
					//	描画座用に変換する.
					this.warning_w_pos = work.course_obj.convCrsDis2Pos(this.warning_v);
				}
			}

			this.crs_pos += (target - this.crs_pos)*0.02;
			//this.crs_pos = v_value; //テキストフォームの値

			//	リミッター.
			this.crs_pos = work.course_obj.limitDis(this.crs_pos);

			//	V座標の更新.
			this.updateCrsV(work);

			//	描画座用に変換する.
			this.w_pos = work.course_obj.convCrsDis2Pos(this.crs_pos);

			// 速度.
			this.velocity += (work.db_ground_speed　- this.velocity)*0.03;

			// ギヤ.
			this.gear = work.db_gear;

			// ブレーキ.
			this.d_brake = work.db_brake_status;
			
			// Lap distance
			this.d_lap_distance = work.db_lap_distance;

			// 旧V
			if (this.warning_v == 0)
			{
				this.old_crs_v = v_value;
				this.old_speed = this.velocity;
			}
			break;
		}
	};


	//	V座標の更新.
	this.updateCrsV = function(work) {
		this.old_crs_v = this.crs_v;

		//	V座標を更新する.
		this.crs_v = work.course_obj.convDistoV(this.crs_pos);
		//	ラップタイムを更新.
		this.current_time += work.delta_t;

		//	変化を知るために前回のラップ数を保存.
		this.old_lap_cnt = this.lap_cnt;

		//	コントロールラインを通過したらラップタイムを記録する.
		if(this.old_crs_v > (work.course_obj.getTotalCrsV()/2) && this.crs_v < (work.course_obj.getTotalCrsV()/2)) {
			this.lap_time = this.current_time;
			this.current_time = 0;
			this.lap_cnt++;
		}
	};


		//	描画処理.
	this.draw = function(ctx, scale) {
		if(this.exec_mode == 1) {

		 	// ウィンドウ.
		 	var window_w = 180;
		 	var window_h = 70;
		 	var target_x = this.w_pos.x * scale + 20.0;
		 	var target_y = this.w_pos.y * scale -20.0;

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
			ctx.moveTo(this.w_pos.x * scale, this.w_pos.y * scale);
			ctx.lineTo(window_x, window_y);
			ctx.stroke();

		 	ctx.fillStyle = 'rgba(32, 32, 32, 0.7)';
            ctx.beginPath();
		 	ctx.fillRect(window_x, window_y - window_h, window_w, window_h);

    		//	テキスト描画.
    		var l_pad = 5;
    		ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';

    		//	自車のときの表示.
    		if(this.car_num == 0) {

    			ctx.font="20px Arial";
    			ctx.fillText("GT-R",  window_x + l_pad, window_y - window_h + 20);
    			ctx.fillText((this.velocity).toFixed(0) + "km/h",  window_x + l_pad, window_y - window_h + 20*2);
    			ctx.fillText(this.d_lap_distance + "m",  window_x + l_pad, window_y - window_h + 20*3);
    			ctx.font="18px Arial";
    			ctx.fillText("Gear:" + this.gear, window_x + 90, window_y-window_h + 20*2);
    		}


			//	●の描画.
			if(this.d_brake == 0) {
				ctx.fillStyle = 'rgba(0, 128, 0, 1.0)';
			} else {
				ctx.fillStyle = 'rgba(255, 0, 128, 1.0)';		//	減速中.
			}
			ctx.beginPath();
			ctx.arc(this.w_pos.x * scale, this.w_pos.y * scale, 8, 0, Math.PI*2, false);
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
			ctx.arc(this.w_pos.x * scale, this.w_pos.y * scale, this.anim_rate*30, 0, Math.PI*2, false);
		 	ctx.stroke();

		 	// warning
		 	if (this.warning_v > 0)
		 	{
		 		this.drawWraningV (ctx, scale);
		 	}
		}
	};

	// warning
	this.drawWraningV = function(ctx, scale) {
		if(this.exec_mode == 1) {

		 	// ウィンドウ.
		 	var window_w = 180;
		 	var window_h = 70;
		 	var window_x = this.warning_w_pos.x * scale + 20.0;
		 	var window_y = this.warning_w_pos.y * scale -20.0;

		 	ctx.strokeStyle = 'rgba(32, 32, 32, 0.7)';
		 	ctx.lineWidth = 2;

            ctx.beginPath();
			ctx.moveTo(this.warning_w_pos.x * scale, this.warning_w_pos.y * scale);
			ctx.lineTo(window_x, window_y);
			ctx.stroke();

		 	ctx.fillStyle = 'rgba(32, 32, 32, 0.7)';
            ctx.beginPath();
		 	ctx.fillRect(window_x, window_y - window_h, window_w, window_h);

    		//	テキスト描画.
    		var l_pad = 5;
    		ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';

    		//	自車のときの表示.
    		if(this.car_num == 0) {

    			ctx.font="20px Arial";
    			ctx.fillText("GT-R",  window_x + l_pad, window_y - window_h + 20);
    			ctx.fillText((this.warning_speed).toFixed(0) + "km/h",  window_x + l_pad, window_y - window_h + 20*2);
    			ctx.fillText(this.warning_v + "m",  window_x + l_pad, window_y - window_h + 20*3);
    			ctx.font="18px Arial";
    			ctx.fillText("STOP?", window_x + 90, window_y-window_h + 20*2);
    		}


			//	●の描画.
			ctx.fillStyle = 'rgba(255, 0, 128, 1.0)';
			
			ctx.beginPath();
			ctx.arc(this.warning_w_pos.x * scale, this.warning_w_pos.y * scale, 8, 0, Math.PI*2, false);
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
			ctx.arc(this.warning_w_pos.x * scale, this.warning_w_pos.y * scale, this.anim_rate*30, 0, Math.PI*2, false);
		 	ctx.stroke();
		 }
	};
};



CarObject.prototype = {
	car_num				: 0,
	w_pos				: new Vector2(),	//	ワールド座標.


	crs_pos				: 0,				//	コース上の位置(実距離)
	old_crs_pos			: 0,				//	前回のコース上の位置.
	velocity			: 0,				//	移動速度.
	gear                : 1,				//  ギヤ.

	old_speed           : 0,
	warning_v           : 0,
	warning_speed       : 0,
	warning_w_pos       : new Vector2(),	//  ワーニング座標.

	crs_v				: 0,				//	V座標.
	old_crs_v			: 0,				//	前回のV座標.

	current_time		: 0,				//	現在のタイム.
	lap_time			: 0,				//	ラップタイム.
	lap_cnt				: 0,				//	ラップカウント.
	old_lap_cnt			: 0,

	// アニメ.
	anim_rate           : 0,
	anim_cnt            : 0,
	window_pos          : new Vector2(),

	//	デバッグ用ワーク.
	debug_flag			: "",				//	デバッグ表示切替用.
	d_brake				: 0,				//	デバッグ用加減速.

	exec_mode			: 0,
	};
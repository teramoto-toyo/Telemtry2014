//	コースオブジェクト.

var CourseObject = function() {

	this.exec_mode		= 0;					//	実行モード.

	this.crs_data		= null;					//	コースの形状データ.
	this.crs_center		= null;					//	コースの中心座標列.
	this.crs_v			= null;					//	V座標列.
	this.total_v		= 0;					//	V座標での全長(CSVデータの先頭に入っている).

	this.enemy_line		= new EnemyLine();		//	敵車ライン.

	//	コース座標の最大、最小値(描画用).
	this.crs_min		= new Vector2();
	this.crs_max		= new Vector2();

	//	描画スケール.
	this.draw_scale_x	= 1.0;
	this.draw_scale_y	= 1.0;
	//	描画オフセット.
	this.draw_offset_x	= 3200;
	this.draw_offset_y	= 0;


	//	移動テスト.
	this.car_v			= 0.0;
	this.car_dis		= 0.0;
	this.trg_vel		= 0.0;
	this.car_tan		= null;

	//	初期化.
	this.initialize = function() {
		
	};

	//	コース全長の取得.
	this.getTotalDistance = function() {
		return parseFloat(this.enemy_line.line_data.total_dis);
	};
	this.getTotalCrsV = function() {
		return this.enemy_line.getTotalCrsV();
	};

	//	コースの長さにリミッターをかける.
	this.limitDis = function(crs_pos) {
		if(crs_pos > this.getTotalDistance()) {
			crs_pos -= this.getTotalDistance();
		}
		if(crs_pos < 0) {
			crs_pos += this.getTotalDistance();
		}
		return crs_pos;
	};

	//	V座標にリミッターをかける.
	this.limitV = function(crs_v) {
		if(crs_v > this.getTotalCrsV()) {
			crs_v -= this.getTotalCrsV();
		}
		if(crs_v < 0) {
			crs_v += this.getTotalCrsV();
		}
		return crs_v;
	};

	//	距離の差分を求める.
	this.calcDifferenceDis = function(d0, d1) {
		var	dis = d0 - d1;

		if(dis > (this.getTotalDistance() / 2)) dis -= this.getTotalDistance();
		else if(dis < (-this.getTotalDistance() / 2)) dis += this.getTotalDistance();

		return dis;
	};

	//	指定された地点をまたいでいるかどうか調べる.
	this.checkCrossDis = function(trg, old, now) {
		//	V座標の変化量 = 今回 - 前回.
		var	ddis = this.calcDifferenceDis(now, old);

		var	old_ddis = this.calcDifferenceDis(old, trg);
		var now_ddis = this.calcDifferenceDis(now, trg);

		//	順方向にまたいでいる場合.
		if((ddis > 0.0) && (old_ddis < 0.0) && (now_ddis >= 0.0)) {
			return 1;
		}
		//	逆方向にまたいでいる場合.
		if((ddis < 0.0) && (old_ddis > 0.0) && (now_ddis <= 0.0)) {
			return -1;
		}
		return 0;
	};

	//	目標速度を取得.
	this.getTargetVelocity = function(dis) {
		return this.enemy_line.line_data.getTargetVelocity(dis);
	};

	//	目標速度を取得(ダウンフォースあり版).
	this.getTargetVelocity2 = function(dis, cl, mass) {
		//	まずはダウンフォースなしの目標速度を求める.
//		var		trg_vel = this.enemy_line.line_data.getTargetVelocity(dis);

		

	};

	//	目標速度を取得(ループさせないで１回で出す方法).
	this.getTargetVelocity3 = function(dis, mu, cl, mass) {
		//	コーナーの半径を求める.
		var r = this.enemy_line.line_data.getCurvature(dis);

		//	sqrt( μｍｇ／(ｍ／ｒ－μρＳＣl／２) ) で出せるらしい.
		var		vel = mu * mass * Gravity();
//		vel /= mass * r - 
	};

	//	実距離からV座標に変換.
	this.convDistoV = function(dis) {
		return this.enemy_line.convDistoV(dis);
	};

	//	距離にコース全長でリミッターをかける.
	this.limitCrsDis = function(dis) {
		if(dis > this.getTotalDistance()) {
			dis -= this.getTotalDistance();
		}
		if(dis < 0) {
			dis += this.getTotalDistance();
		}

		return dis;
	};

	//	メッセージ処理.
	this.execCommand = function(command) {
		switch(command[0]) {
		case "RESTART":
//				console.log("CarObj:RESTART");
			break;
		}
	};

	//	実行処理.
	this.exec = function(work) {
		//	モードで処理を分ける.
		switch(this.exec_mode) {
		case 0:			//	読み込み開始.
			loadCSV("data/nur24h.csv");
			this.exec_mode++;
			break;

		case 1:			//	コースデータ読み込み待ち.
			if(enableData == true) {
				//	読み込みデータを設定.
				this.initCourseCSVData(csvData);

				//	描画スケールをシステムに渡す.
				work.draw_scale = this.draw_scale_x;

				//	ラインデータを読み込み.
				enableData = false;
				loadCSV("data/nur24h_line.csv");
				this.exec_mode++;
			}
			break;

		case 2:			//	ラインデータ読み込み待ち.
		
			if(enableData == true) {
				this.initCourseLineData(csvData);
				this.exec_mode++;

				//	読み込みが終わったのでモードを進める.
				work.game_mode = GAME_MODE.SETUP_RACE;
			}
		}
	};

	//	描画処理.
	this.draw = function(ctx, work) {
		//	データがまだなければ何も描画しない.
		if(this.exec_mode < 3) return;

		ctx.strokeStyle = 'rgba(0, 120, 222, 1.0)';
		ctx.lineWidth = 6;

		ctx.beginPath();

		//	最初の点.
		ctx.moveTo(this.drawScaleX(this.crs_center[0].x), this.drawScaleY(this.crs_center[0].y));

		for(var lp1 = 1; lp1 < this.crs_center.length; lp1++) {
			ctx.lineTo(this.drawScaleX(this.crs_center[lp1].x), this.drawScaleY(this.crs_center[lp1].y));
		}

		//	最後の点.
		ctx.lineTo(this.drawScaleX(this.crs_center[0].x), this.drawScaleY(this.crs_center[0].y));

		ctx.stroke();

		//	走行ラインの描画.
		//this.enemy_line.drawLine(ctx, this.drawScaleX(1.0));

		//	コースのオーバーレイ描画.
		//var size = fc.controller.getValue(0);
		var size = 1210;
		if (sys_work.load_img)
		{
			ctx.drawImage(sys_work.overlay_img, -size/2.0-466, -size/2.0, size, size);
			//ctx.drawImage(sys_work.overlay_img, -sys_work.SCR_W/2, -sys_work.SCR_H/2, sys_work.SCR_W, sys_work.SCR_H);
		}
	};

	//	CSVのコースデータを読み込み.
	this.initCourseCSVData = function(csv) {
		//	配列を保存.
		this.crs_data = csv;

		this.crs_center = new Array();
		this.crs_v		= new Array();

		//	コースの座標値の最小、最大値.
		var		crs_min = new Vector2();	crs_min.x =  Number.MAX_VALUE; crs_min.y =  Number.MAX_VALUE;
		var		crs_max = new Vector2();	crs_max.x = -Number.MAX_VALUE; crs_max.x = -Number.MAX_VALUE;

		//	中心点を出しておく.
		//	0:V座標 1-3:左端の座標XYZ 4-6:右端の座標XYZ.
		for(var lp1 = 0; lp1 < this.crs_data.length; lp1++) {
//			console.log(this.crs_data[lp1]);
			var	vec = new Vector2();
			vec.x = (parseFloat(this.crs_data[lp1][1]) + parseFloat(this.crs_data[lp1][4])) / 2 - this.draw_offset_x;
			vec.y = (parseFloat(this.crs_data[lp1][3]) + parseFloat(this.crs_data[lp1][6])) / 2;

//			console.log(vec.x + ", " + vec.y);

			//	最大、最小値を調べる.
			if(crs_min.x > vec.x) crs_min.x = vec.x;
			if(crs_min.y > vec.y) crs_min.y = vec.y;
			if(crs_max.x < vec.x) crs_max.x = vec.x;
			if(crs_max.y < vec.y) crs_max.y = vec.y;

			this.crs_center.push(vec);

			//	V座標も保存.
			var crs_v = new Number();

			crs_v = parseFloat(this.crs_data[lp1][0]);
			this.crs_v.push(crs_v);
		}

		//	V座標の最初のデータを最後にコピーする.
		var crs_v = this.crs_v[0];
		this.crs_v.push(crs_v);				//	データを最後に追加.
		this.crs_v[0] = 0.0;				//	先頭のV座標をクリア.


		//	座標の最大、最小値を保存.
		this.crs_min.set(crs_min);
		this.crs_max.set(crs_max);

		//	大きさを調べる.
		var	crs_size = new Vector2();
		crs_size.x = crs_max.x - crs_min.x;
		crs_size.y = crs_max.y - crs_min.y;

		//	表示用スケールを求める.
		//var scale_offset_original = 300;
		var scale_offset = 1100;
		this.draw_scale_x	= sys_work.SCR_W / (crs_size.x + scale_offset);
		this.draw_scale_y	= sys_work.SCR_H / (crs_size.y + scale_offset);

		//	小さいほうに合わせる.
		if(this.draw_scale_x < this.draw_scale_y) this.draw_scale_y = this.draw_scale_x;
		else this.draw_scale_x = this.draw_scale_y;

		//	V座標を取得.
		this.total_v = this.crs_data[0][0];				//	データの先頭に入っている.
	};

	//	走行ラインデータの読み込み.
	this.initCourseLineData = function(csv) {
		//	敵車ラインにデータを設定する.
		this.enemy_line.initCSVLineData(csv);
	};

	//	実距離から座標に変換する.
	this.convCrsDis2Pos = function(dis) {
		var		crs_v = this.enemy_line.convDistoV(dis);
		return this.convCrsV2Pos(crs_v);
	};

	//	V座標からワールド座標に変換.
	this.convCrsV2Pos = function(v) {
		v = this.limitDis(v) 
		//	V座標のテーブルのどこかを二分探索で求める.
		var n0 = binary_search(this.crs_v, v);
		var n1 = n0 + 1;
		var nn = n1;

		//	座標データ用に最後のデータの場合はインデックスを０にしておく.
		if(nn >= this.crs_data.length) nn = 0;

		//	データ間での割合を求める.
		var ratio = (v - this.crs_v[n0]) / (this.crs_v[n1] - this.crs_v[n0]);

		//	座標を求める.
		var pos = new Vector2();

		pos.x = (this.crs_center[nn].x - this.crs_center[n0].x) * ratio + this.crs_center[n0].x;
		pos.y = (this.crs_center[nn].y - this.crs_center[n0].y) * ratio + this.crs_center[n0].y;

//		console.log("v:" + v + " num:" + n0);

		return pos;
	};

	//	描画スケール変換.
	this.drawScaleX = function(org_x) {
		return org_x * this.draw_scale_x;
	};

	this.drawScaleY = function(org_y) {
		return org_y * this.draw_scale_y;
	};

	//	GPS座標からワールド座標に変換.
	this.convGPSV2Pos = function(lat, lon) {
	    // 元オーバーレイ画像内での座標.
        //sw google.maps.LatLng(50.314978, 6.904200), // 左下
        //ne google.maps.LatLng(50.389978, 7.021200)  // 右上
        var w_rate = (lon - 6.904200)/(7.021200 - 6.904200); //0-1.0
        var h_rate = (50.389978 - lat)/(50.389978 - 50.314978); //0-1.0
        //左上原点でレート作成
		var img_size = 1130;
		//	座標を求める.
		var pos = new Vector2();
        // 中心原点と画像とキャンバスの差を補正.
		pos.x = (w_rate - 0.5)*img_size;
		pos.y = (h_rate - 0.5)*img_size;
		return pos;
	};
};


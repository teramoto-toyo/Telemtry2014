//	敵車ライン(スプラインデータ).

var EnemyLine = function() {
	this.line_data		= new Spline2D();			//	スプラインデータ.
	this.crs_v			= [];						//	V座標.

	//	ライン描画パラメータ.
	this.draw_line_width	= 1.0;				//	線の太さ.
	this.draw_line_col		= 'rgba(255, 192, 0, 1.0)';

	//	ラインにCSVデータを設定する.
	this.initCSVLineData = function(csv) {
		//	スプラインのポイントを生成する.
		this.line_data.createPoint(csv.length);

		//	データを設定していく.
		for(var lp1 = 0; lp1 < csv.length; lp1++) {
			this.line_data.cp_arr[lp1].pos[0] = parseFloat(csv[lp1][1]);		//	X座標.
			this.line_data.cp_arr[lp1].pos[1] = parseFloat(csv[lp1][3]);		//	Z座標.
			this.line_data.cp_arr[lp1].sp[0]  = parseFloat(csv[lp1][4]);		//	スプラインのX軸パラメータ.
			this.line_data.cp_arr[lp1].sp[1]  = parseFloat(csv[lp1][6]);		//	スプラインのY軸パラメータ.
			this.line_data.cp_arr[lp1].dis    = parseFloat(csv[lp1][8]);		//	実距離.

			//	V座標を保存していく.
			this.crs_v.push(parseFloat(csv[lp1][7]));
		}

		//	全長を設定.
		this.line_data.total_dis = csv[csv.length-1][8];			//	とりあえずV座標で.
	};

	//	座標の読み出し.
	this.getPos = function(dis) {
		return this.line_data.getSpline(dis);
	};

	//	座標の読み出し(V座標).
	this.getPosV = function(v) {
		//	V座標から実距離に変換する.
		var dis = convVtoDis(v);

		return getPos(dis);
	};

	//	V座標の全長.
	this.getTotalCrsV = function() {
		return this.crs_v[this.crs_v.length-1];
	};

	//	実距離からV座標に変換.
	this.convDistoV = function(dis) {
		//	距離テーブルの場所を２分探索で求める.
		var n0 = searchSplineTable(this.line_data.cp_arr, dis);
		var n1 = n0 + 1;

		//	実距離での割合を求める.
		var ratio = (dis - this.line_data.cp_arr[n0].dis) / (this.line_data.cp_arr[n1].dis - this.line_data.cp_arr[n0].dis);

		//	V座標に直す.
		var v = (this.crs_v[n1] - this.crs_v[n0]) * ratio + this.crs_v[n0];

		return v;
	};

	//	V座標から実距離に変換.
	this.convVtoDis = function(v) {
		//	V座標のリミッター.
		if(v > this.crs_v[this.crs_v.length-1]) {
			v -= this.crs_v[this.crs_v.length-1];
		}

		//	V座標のテーブルの場所を２分探索で求める.
		var n0 = binary_search(this.crs_v, v);
		var n1 = n0 + 1;
		if(n1 >= this.line_data.cp_arr.length) {
			console.log(n0 + ", " + n1 + " v:" + v);
		}

		//	V座標での割合を求める.
		var ratio = (v - this.crs_v[n0]) / (this.crs_v[n1] - this.crs_v[n0]);

		//	距離に直す.
		var dis = (this.line_data.cp_arr[n1].dis - this.line_data.cp_arr[n0].dis) * ratio + this.line_data.cp_arr[n0].dis;

		//	とりあえずチェック.
//		console.log("V:" + v + " num:" + n0 + " v:" + this.crs_v[n0] + " dis:" + this.line_data.cp_arr[n0].dis);

		return dis;
	};

	//	ラインの描画.
	this.drawLine = function(ctx, scale) {
		var		pos0, pos1 = null;
		var		lw	= this.draw_line_width;						//	スプラインの幅.

		//	スプラインを描いてみる.
		pos0 = new Vector2(); pos1 = new Vector2();

		//	最初の点.
		pos0 = this.getPos(0.0);
//		ctx.fillStyle = 'rgba(255, 192, 0, 1.0)';
//		ctx.beginPath();
//		ctx.arc(pos0.x * scale, pos0.y * scale, lw, 0, Math.PI*2, false);
//		ctx.fill();

		ctx.strokeStyle = this.draw_line_col;
		ctx.lineWidth	= lw;
		ctx.beginPath();
		ctx.moveTo(pos0.x * scale, pos0.y * scale);

		for(var dis = 10.0; dis < this.line_data.total_dis; dis += 10.0) {
			pos1 = this.getPos(dis);

			//	線の描画.
			ctx.lineTo(pos1.x * scale, pos1.y * scale);

			//	すき間を丸でふさぐ.
//			ctx.fillStyle = 'rgba(255, 192, 0, 1.0)';
//			ctx.beginPath();
//			ctx.arc(pos1.x * scale, pos1.y * scale, lw/2, 0, Math.PI*2, false);
//			ctx.fill();

			//	次の点.
			pos0.set(pos1);
		}

		//	最後の点.
		pos1 = this.getPos(0.0);
		ctx.lineTo(pos1.x * scale, pos1.y * scale);
		ctx.stroke();
	};
};

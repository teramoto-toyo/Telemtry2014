//	スプラインの計算ルーチン.

//	スプラインの制御点クラス.
var SplinePoint = function() {
	this.pos	= [ 0, 0 ];						//	座標値.
	this.sp		= [ 0, 0 ];						//	スプラインパラメータ.
	this.dis	= 0.0;							//	基準パラメータ.

	//	計算用ワーク.
	this.h		= 0.0;
	this.d		= 0.0;
	this.w		= 0.0;

	//	座標の設定.
	this.setPos = function(pos) {
		this.pos[0] = pos.x;
		this.pos[1] = pos.y;
	};

	//	基準長さの設定.
	this.setLength = function(len) {
		this.len = len;
	};
};

//	スプラインの値を取得する.
function getSpline(cp, dis, xyz) {

	//  テーブルの場所を探索する.
	var idx = searchSplineTable(cp, dis);

	//  パラメータの取得.
	var p0 = idx;
	var p1 = idx + 1;

	var h = cp[p1].dis - cp[p0].dis;
	var d = dis - cp[p0].dis;
	if(h < 0.0) h = cp[cp.length-1].dis - cp[p0].dis;

	//  スプラインの３次式に代入して答えを求める.
	s = (((cp[p1].sp[xyz] - cp[p0].sp[xyz]) * d / h + cp[p0].sp[xyz] * 3.0) * d
		+ ((cp[p1].pos[xyz] - cp[p0].pos[xyz]) / h
		- (cp[p0].sp[xyz] * 2.0 + cp[p1].sp[xyz]) * h)) * d + cp[p0].pos[xyz];

	return s;
};

//	ラインの傾きを求める.
function getTangent(cp, dis, xyz) {
	//	テーブルの場所を探索.
	var p0 = searchSplineTable(cp, dis);
	var p1 = p0 + 1;

	var h	= cp[p1].dis - cp[p0].dis;
	var d	= dis - cp[p0].dis;

	var s	= (3.0 * (cp[p1].sp[xyz] - cp[p0].sp[xyz]) * d / h + 6.0 * cp[p0].sp[xyz]) * d
			+ ((cp[p1].pos[xyz] - cp[p0].pos[xyz]) / h - (cp[p0].sp[xyz] * 2.0 + cp[p1].sp[xyz]) * h);

	return s;
};

//	曲率を求める.
function getCurvature(cp, dis, xyz) {
	//	テーブルの場所を探索.
	var p0 = searchSplineTable(cp, dis);
	var p1 = p0 + 1;

	//	２次導関数の式に値を入れて曲率を求める.
	//	s = 6(u(i+1) - u(i)) * (t - x(i)) / (x(i+1) - x(i)) + 6u(i)
	var s	= (cp[p1].sp[xyz] - cp[p0].sp[xyz]) * (dis - cp[p0].dis) /
				(cp[p1].dis - cp[p0].dis) + cp[p0].sp[xyz];
		s	= s * 6.0;

	return s;
};

//	テーブルの場所を探索する.
function searchSplineTable(cp, dis) {

	var		max_dis = cp[cp.length-1].dis;
	var		i, j, k;

	//  範囲に収める.
	if(dis > max_dis) dis = max_dis;

	//  スプラインのノードを２分探索で求める.
	i = 0; j = cp.length - 1;
	while (i < j) {
		k = Math.floor((i + j) / 2);
		if(cp[k].dis < dis)
			i = k + 1;
		else
			j = k;
	}

	if (i > 0) i--;

	return i;
};


//	スプラインのパラメータを計算する.
function createSplineTableOpen(cp, xyz) {

	//	点の数を調べる.
	var		max_cnt = cp.length - 1;
	var		p0, p1, p2, t;

	//	カーブの両端では傾きy''(x)/6 = 0;
	cp[0].sp[xyz] = 0.0;
	cp[max_cnt].sp[xyz] = 0.0;

	//	距離の差分と右辺のデータを作っておく.
	for(var lp1 = 0; lp1 < max_cnt; lp1++) {
		cp[lp1].h	= cp[lp1+1].dis - cp[lp1].dis;
		cp[lp1+1].d = (cp[lp1+1].pos[xyz] - cp[lp1].pos[xyz]) / cp[lp1].h;
	}

	//	最初の点.
	cp[1].sp[xyz] = cp[2].d - cp[1].d - cp[0].h * cp[0].sp[xyz];
	cp[1].d = 2.0 * (cp[2].dis - cp[0].dis);

	//	上の式から両辺を引いて左辺の項を消す.
	for(var lp1 = 1; lp1 < max_cnt - 1; lp1++) {
		p0 = lp1;
		p1 = lp1 + 1;
		p2 = lp1 + 2;

		t = cp[lp1].h / cp[lp1].d;
		cp[p1].sp[xyz] = cp[p2].d - cp[p1].d - cp[p0].sp[xyz] * t;		//  右辺の値(v[i] -  v[i-1] * (a[i] / a[i-1]).
		cp[p1].d = 2.0 * (cp[p2].dis - cp[p0].dis) - cp[p0].h * t;		//  左辺u[n]の係数(b[n] - a[n] * b[n-1] / a[n-1]).

//		console.log(lp1 + ":" + cp[p0].sp[xyz]);
	}

	//	下の式から順番に解を求めていく.
	p0 = max_cnt - 1;
	p1 = max_cnt;
	cp[p0].sp[xyz] -= cp[p0].h * cp[p1].sp[xyz];
	for(var lp1 = max_cnt-1; lp1 > 0; lp1--) {
		p0 = lp1; p1 = lp1+1;
		cp[p0].sp[xyz] = (cp[p0].sp[xyz] - cp[p0].h * cp[p1].sp[xyz]) / cp[p0].d;

//		console.log(lp1 + ":" + cp[p0].sp[xyz]);
	}
};

var		d_flag = false;

//	スプラインのパラメータを計算する(閉曲線).
function createSplineTable(cp, xyz) {
	var		size = cp.length - 1;
	var		p0, p1, p2, t;

	//	点の数が足りなければテーブルは作らない.
	if(size < 3) return;

	//	方程式のテーブルを作成(h, w).
	for(var lp1 = 0; lp1 < size; lp1++) {
		p0 = cp[lp1];
		p1 = cp[lp1+1];
		cp[lp1].h	= p1.dis - p0.dis;
		cp[lp1].w	= (p1.pos[xyz] - p0.pos[xyz]) / cp[lp1].h;
	}
	cp[size].w = cp[0].w;								//	ループしているので最初と最後を同じにする.

//	if(d_flag == false) { console.log("テーブル作成１"); printTable(cp); }

	//	２つ目の項の係数を作成.
	for(var lp1 = 1; lp1 < size; lp1++) {
		p0 = cp[lp1-1];
		p2 = cp[lp1+1];
		cp[lp1].d = 2 * (p2.dis - p0.dis);
	}
	cp[size].d = 2 * (cp[size-1].h + cp[0].h);			//	最後の点の式.

//	if(d_flag == false) { console.log("テーブル作成２"); printTable(cp); }

	//	右辺の式を作成.
	for(var lp1 = 1; lp1 <= size; lp1++) {
		p0 = cp[lp1];
		p0.sp[xyz] = cp[lp1].w - cp[lp1-1].w;
	}
//	if(d_flag == false) { console.log("テーブル作成３"); printTable(cp); }

	cp[1].w			= cp[0].h;
	cp[size-1].w	= cp[size-1].h;
	cp[size].w		= cp[size].d;
	for(var lp1 = 2; lp1 < size-1; lp1++) {
		cp[lp1].w = 0.0;
	}
//	if(d_flag == false) { console.log("テーブル作成４"); printTable(cp); }

	//	連立方程式を解く.
	//	左辺の左端の項を上から消していく.
	for(var lp1 = 1; lp1 < size; lp1++) {
		p0		= cp[lp1];
		p1		= cp[lp1+1];
		t		= cp[lp1].h / cp[lp1].d;
		p1.sp[xyz]	= p1.sp[xyz] - p0.sp[xyz] * t;
		cp[lp1+1].d	= cp[lp1+1].d - cp[lp1].h * t;
		cp[lp1+1].w	= cp[lp1+1].w - cp[lp1].w * t;
	}
	p0 = cp[0];
	p1 = cp[size];
	cp[0].w = cp[size].w;
	p0.sp[xyz] = p1.sp[xyz];
//	if(d_flag == false) { console.log("解１"); printTable(cp); }

	//	左辺の右端の項を下から消していく.
	for(var lp1 = size-2; lp1 >= 0; lp1--) {
		p0		= cp[lp1];
		p1		= cp[lp1+1];
		t		= cp[lp1].h / cp[lp1+1].d;
		p0.sp[xyz]	= p0.sp[xyz] - p1.sp[xyz] * t;
		cp[lp1].w	= cp[lp1].w - cp[lp1+1].w * t;
	}
//	if(d_flag == false) { console.log("解２"); printTable(cp); }

	//	最初と最後の答え.
	p0 = cp[0]; p1 = cp[size];
	t = p0.sp[xyz] / cp[0].w;
	p0.sp[xyz] = t;
	p1.sp[xyz] = t;

	//	答えを上から順に求めていく.
	for(var lp1 = 1; lp1 < size; lp1++) {
		p0 = cp[lp1];
		p0.sp[xyz] = (p0.sp[xyz] - cp[lp1].w * t) / cp[lp1].d;
	}

	// if(d_flag == false) {
		// console.log("解３");
		// printTable(cp);
		// d_flag = true;
	// }

};


//	計算内容の表示.
var printTable = function(cp) {
	for(var lp1 = 0; lp1 < cp.length; lp1++) {
		console.log(lp1 + ", " + cp[lp1].h + ", " + cp[lp1].d + ", " + cp[lp1].w);
	}
};


//	スプラインクラス.
var Spline2D = function() {
	this.cp_arr		= new Array();				//	カーブ用の点.
	this.total_dis	= 0.0;

	//	描画パラメータ.
	this.draw_width = 4.0;						//	線の幅.
	this.draw_color = 'rgba(0, 128, 255, 1.0)';

	//	スプラインの点を生成する.
	this.createPoint = function(max) {
		if(this.cp_arr != undefined) {
			delete this.cp_arr;
		}
		this.cp_arr = new Array(max);

		//	点を生成して代入する.
		for(var lp1 = 0; lp1 < max; lp1++) {
			this.cp_arr[lp1] = new SplinePoint();
		}
	};

	//	スプラインの全長を設定する.
	this.setTotalDis = function(dis) {
		this.total_dis = dis;
	};

	//	点に座標と距離を設定する.
	this.setPosDis = function(num, pos, dis) {
		this.cp_arr[num].setPos(pos);
		this.cp_arr[num].dis = dis;
		console.log("setPosDis(" + num + ") : " + dis);
	};

	//	点に座標を設定する.
	this.setPos = function(num, pos) {
		this.cp_arr[num].setPos(pos);
	};

	//	スプラインのパラメータを計算する.
	this.createSplineTableOpen = function() {
		createSplineTableOpen(this.cp_arr, 0);
		createSplineTableOpen(this.cp_arr, 1);
	};

	//	スプラインのパラメータ(閉曲線)を計算する.
	this.createSplineTable = function() {
		createSplineTable(this.cp_arr, 0);
		createSplineTable(this.cp_arr, 1);
	};

	//	スプラインの座標を取得.
	this.getSpline = function(dis) {
		var pos = new Vector2();
		pos.x = getSpline(this.cp_arr, dis, 0);
		pos.y = getSpline(this.cp_arr, dis, 1);
		return pos;
	};

	//	接線を求める.
	this.getTangent2 = function(dis) {
		var	ret = new Vector2();
		ret.x = getTangent(this.cp_arr, dis, 0);
		ret.y = getTangent(this.cp_arr, dis, 1);
		return ret;
	};

	//	曲率を求める.
	this.getCurvature2 = function(dis) {
		var	ret = new Vector2();

		ret.x = getCurvature(this.cp_arr, dis, 0);
		ret.y = getCurvature(this.cp_arr, dis, 1);

		//	接線を求める,
		var tan = this.getTangent2(dis);
		//	外積を取って左右を調べる,
		var sgn = tan.crossProduct(ret);

		if(sgn < 0) return ret.length() * -1.0;

		return ret.length();
	};

	//	旋回速度を求める.
	this.getTargetVelocity = function(crs_dis) {
		//	曲率を取得,
		var cur = this.getCurvature2(crs_dis);
		var vel;

		//	曲率から推奨速度を求める,
		if(Math.abs(cur) > (1.0/700.0)) {
			vel = Math.sqrt(1.0 / Math.abs(cur) * 9.8) * 3.6;
		} else {
			//	半径700m以上は直線とみなす.
			vel = 300.0;
		}

		return vel;
	};

	//	スプラインの描画.
	this.drawSpline = function(ctx, scale) {
		var		pos0, pos1 = null;
		var		lw	= this.draw_width;						//	スプラインの幅.

		//	スプラインを描いてみる.
		pos0 = new Vector2(); pos1 = new Vector2();

		//	最初の点.
		pos0.x = getSpline(this.cp_arr, 0, 0);
		pos0.y = getSpline(this.cp_arr, 0, 1);
		ctx.fillStyle = this.draw_color;
		ctx.beginPath();
		ctx.arc(pos0.x * scale, pos0.y * scale, lw, 0, Math.PI*2, false);
		ctx.fill();

		for(var dis = 1.0; dis < this.cp_arr[this.cp_arr.length-1].dis; dis += 1.0) {
			pos1.x = getSpline(this.cp_arr, dis, 0);
			pos1.y = getSpline(this.cp_arr, dis, 1);

			//	線の描画.
			ctx.strokeStyle = this.draw_color;
			ctx.lineWidth	= lw;
			ctx.beginPath();
			ctx.moveTo(pos0.x * scale, pos0.y * scale);
			ctx.lineTo(pos1.x * scale, pos1.y * scale);
			ctx.stroke();

			//	すき間を丸でふさぐ.
			ctx.fillStyle = this.draw_color;
			ctx.beginPath();
			ctx.arc(pos1.x * scale, pos1.y * scale, lw/2, 0, Math.PI*2, false);
			ctx.fill();

			//	次の点.
			pos0.set(pos1);
		}
	};

	//	デバッグ用.
	this.debugPrint = function() {
		var		cp;

		for(var lp1 = 0; lp1 < this.cp_arr.length; lp1++) {
			cp = this.cp_arr[lp1];
			console.log(lp1 + " : " + cp.dis + " x:" + cp.pos[0] + " y:" + cp.pos[1]);
		}

		console.log("length:" + this.cp_arr[this.cp_arr.length-1].dis);

		//	スプラインの描画座標.
		var		pos = new Vector2();
		for(var dis = 1.0; dis < this.cp_arr[this.cp_arr.length-1].dis; dis += 20.0) {
			pos.x = getSpline(this.cp_arr, dis, 0);
			pos.y = getSpline(this.cp_arr, dis, 1);

			console.log("dis:" + dis + " : " + pos.x + " ," + pos.y);
		}
	};
};



/*
 * 	２Ｄベクトル
 */

//	2Dベクトル.
var Vector2 = function(x, y) {
	//	メンバ.
	this.x		= 0;
	this.y		= 0;
	if(x != undefined) this.x = x;
	if(y != undefined) this.y = y;

	//	値を設定.
	this.set	= function(arg0, arg1) {
		switch(arguments.length) {
		case 1:
			this.x = arg0.x;
			this.y = arg0.y;
			break;
		case 2:
			this.x = arg0; this.y = arg1;
			break;
		default:
		}
	};

	//	加算.
	this.add	= function(arg0, arg1) {
		if(arguments.length == 1) {
			this.x	+= arg0.x;
			this.y	+= arg0.y;
		} else {
			this.x	+= arg0;
			this.y	+= arg1;
		}
	};

	//	減算.
	this.sub	= function(vec) {
		this.x	-= vec.x;
		this.y	-= vec.y;
	};

	//	スケール.
	this.scale	= function(val) {
		this.x	*= val;
		this.y	*= val;
	};

	//	ベクトルの長さ.
	this.length	= function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	};

	//	ベクトルの正規化.
	this.normalize	= function() {
		var		len = this.length();
		if(len > 0) {
			this.x	/= len;
			this.y	/= len;
		}
	};

	//	内積を取る.
	this.dotProduct	= function(vec) {
		return this.x*vec.x + this.y*vec.y;
	};

	//	外積を取る.
	this.crossProduct = function(vec) {
		return this.x * vec.y - this.y * vec.x;
	};

	//	回転.
	this.rotate = function(rot) {
		var		nx, ny;
		nx = this.x * Math.cos(rot) - this.y * Math.sin(rot);
		ny = this.x * Math.sin(rot) + this.y * Math.cos(rot);

		this.x = nx; this.y = ny;
	};
};



//	２線分の交差判定.
var CrossPoint = function(a, b, c, d) {
	this.ab = new Vector2();
	this.ac = new Vector2();
	this.cd = new Vector2();
	this.ret = undefined;

	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;

	//	判定用のベクトルを作る.
	this.ab.set(b); this.ab.sub(a);		//	AB
	this.ac.set(c); this.ac.sub(a);		//	AC
	this.cd.set(d); this.cd.sub(c);		//	CD

	//	CDに対する外積を取る.
	this.c0 = this.ab.crossProduct(this.cd);
	this.ca = this.ac.crossProduct(this.ab);
	this.cb = this.ac.crossProduct(this.cd);

	//	内分比を求める.
	this.r0 = this.ca / this.c0;
	this.r1 = this.cb / this.c0;

	//	平行な場合.
	if(this.c0 < 0.000001 && this.c0 > -0.000001) return;

	//	交差してない場合.
	if(this.r0 < 0 || this.r0 > 1.0) return;
	if(this.r1 < 0 || this.r1 > 1.0) return;

	//	点AからベクトルABをs0/s1倍したところが交点になる.
	this.ret = new Vector2();
	this.ret.set(this.ab);
	this.ret.scale(this.r1);
	this.ret.add(a);

	//	交差点を返す.
	this.getCrossPoint = function() { return this.ret; };

	//	戻す点を求める.
	this.getMovePos = function() {
		//	垂直なベクトルを求める.
		var sv = new Vector2();
		sv.x =  this.cd.y;
		sv.y = -this.cd.x;
		sv.normalize();

		var vec = new Vector2();
		vec.set(sv);
		vec.scale(this.ab.dotProduct(sv));
		vec.scale(1.0-this.r1);

		vec.add(this.d);

		return vec;
	};

};

//	交差判定のサブルーチン.
function getCrossPoint(a, b, c, d) {
	var ab = new Vector2();
	var ac = new Vector2();
	var cd = new Vector2();
	var ret = new Vector2();

	//	判定用のベクトルを作る.
	ab.set(b); ab.sub(a);		//	AB
	ac.set(c); ac.sub(a);		//	AC
	cd.set(d); cd.sub(c);		//	CD

	//	CDに対する外積を取る.
	var c0 = ab.crossProduct(cd);
	var ca = ac.crossProduct(ab);
	var cb = ac.crossProduct(cd);

	//	内分比を求める.
	var r0 = ca / c0;
	var r1 = cb / c0;

	//	平行な場合.
	if(c0 < 0.000001 && c0 > -0.000001) return false;

	//	交差してない場合.
	if(r0 < 0 || r0 > 1.0) return false;
	if(r1 < 0 || r1 > 1.0) return false;

	//	点AからベクトルABをs0/s1倍したところが交点になる.
	ret.set(ab);
	ret.scale(r1);
	ret.add(a);

	return ret;
};

//	当たり判定ルーチン.
var checkCrossPoint = function() {
	this.pa		= new Vector2();			//	移動ベクトル始点.
	this.pb		= new Vector2();			//	移動ベクトル終点.
	this.pc		= new Vector2();			//	壁座標.
	this.pd		= new Vector2();

	this.ret	= new Vector2();			//	戻す座標.
	this.n_vec	= new Vector2();			//	壁の法線.

	this.r_dis	= 0.4;						//	当たった後に戻す距離.

	//	元の座標を設定.
	this.setPosition = function(a, b, c, d) {
		this.pa.set(a);		this.pb.set(b);
		this.pc.set(c);		this.pd.set(d);
	};

	//	当たった場合に壁の法線方向に戻す(１回目の当たり判定用).
	this.checkHit = function() {
		var ab = new Vector2();
		var ac = new Vector2();
		var cd = new Vector2();

		//	判定用のベクトルを作る.
		ab.set(this.pb); ab.sub(this.pa);		//	AB
		ac.set(this.pc); ac.sub(this.pa);		//	AC
		cd.set(this.pd); cd.sub(this.pc);		//	CD

		//	CDに対する外積を取る.
		var c0 = ab.crossProduct(cd);
		var ca = ac.crossProduct(ab);
		var cb = ac.crossProduct(cd);

		//	内分比を求める.
		var r0 = ca / c0;
		var r1 = cb / c0;

//		console.log("r0:" + r0 + " r1:" + r1 + " c0:" + c0);

		//	平行な場合.
		if(c0 < 0.000001 && c0 > -0.000001) return false;

		//	交差してない場合.
		if(r0 < 0 || r0 > 1.0) return false;
		if(r1 < 0 || r1 > 1.0) return false;

		//	当たっているので戻す点を求める.

		//	壁の法線を求める.
		var p0p1 = new Vector2();
		p0p1.set(this.pd);
		p0p1.sub(this.pc);
		p0p1.normalize();

		this.n_vec.set(-p0p1.y, p0p1.x);			//	逆の場合は(y, -x) になる.

		//	移動ベクトルの壁の法線方向の成分を求める.
		this.ret.set(this.n_vec);
		var s = ab.dotProduct(this.n_vec);
		this.ret.scale(-s * (1.0 - r1));
		this.ret.add(this.pb);

		//	ちょっと内側に入れる.
		var	r_vec = new Vector2();
		r_vec.set(this.n_vec);
		r_vec.scale(this.r_dis);
		this.ret.add(r_vec);

		return true;
	};

	//	当たった場合に移動ベクトルの手前で止める.
	this.checkHit2 = function() {
		var ab = new Vector2();
		var ac = new Vector2();
		var cd = new Vector2();

		//	判定用のベクトルを作る.
		ab.set(this.pb); ab.sub(this.pa);		//	AB
		ac.set(this.pc); ac.sub(this.pa);		//	AC
		cd.set(this.pd); cd.sub(this.pc);		//	CD

		//	CDに対する外積を取る.
		var c0 = ab.crossProduct(cd);
		var ca = ac.crossProduct(ab);
		var cb = ac.crossProduct(cd);

		//	内分比を求める.
		var r0 = ca / c0;
		var r1 = cb / c0;

//		console.log("r0:" + r0 + " r1:" + r1 + " c0:" + c0);

		//	平行な場合.
		if(c0 < 0.000001 && c0 > -0.000001) return false;

		//	交差してない場合.
		if(r0 < 0 || r0 > 1.0) return false;
		if(r1 < 0 || r1 > 1.0) return false;

		//	当たっているので戻す点を求める.
		//	点AからベクトルABをs0/s1倍したところが交点になる.
		this.ret.set(ab);
		this.ret.scale(r1);

		//	内側に入れるベクトルを求める.
		var r_vec = new Vector2();
		r_vec.set(ab);
		r_vec.normalize();
		r_vec.scale(-this.r_dis);

		//	内側に入れる.
		this.ret.add(r_vec);

		//	移動ベクトルの始点を足して戻す座標にする.
		this.ret.add(this.pa);

		return true;
	};
};



//	当たり判定のテスト.
var HitTest = function() {
	this.p0		= new Vector2();			//	壁ベクトル.
	this.p1		= new Vector2();

	this.c0		= new Vector2();			//	移動ベクトル.
	this.c1		= new Vector2();

	this.n_vec	= new Vector2();			//	壁の法線.

	this.ret	= new Vector2();			//	戻すべき点.

	this.cc		= 0;
	this.ca		= 0;
	this.cd		= 0;

	this.debug_flag = false;

	//	初期化.
/*	this.p0.set(63.156132912039766, 47.42553740855503);
	this.p1.set(53.236158602188425, 54.27280128266047);

	this.c0.set(62.45194120650051, 46.69651519802704);				//	始点.
	this.c1.set(63.88083061152398, 48.841292726749884);				//	終点.
*/
	this.p0.set(71.14919329468282, 38.40323733655775);
	this.p1.set(63.156132912039766, 47.42553740855503);

	this.c0.set(62.59106429864741, 46.60048546113899);				//	始点.
	this.c1.set(64.04558678393923, 48.690917332709745);				//	終点.

	//	戻す位置を求める.
	this.calcCrossPoint = function() {
		//	当たっているかどうかを調べる.
		var ab = new Vector2();
		var ac = new Vector2();
		var cd = new Vector2();

		//	判定用のベクトルを作る.
		ab.set(this.c1); ab.sub(this.c0);
		ac.set(this.p0); ac.sub(this.c0);
		cd.set(this.p1); cd.sub(this.p0);

		//	外積を取る.
		var c0 = ab.crossProduct(cd);
		var ca = ac.crossProduct(ab);
		var cd = ac.crossProduct(cd);

		//	内分比を求める.
		var r0 = ca / c0;
		var r1 = cd / c0;

		//	デバッグ用.
		this.cc = c0; this.ca = ca; this.cd = cd;

		if(this.debug_flag == false) {
			console.log("r0:" + r0 + " = " + ca + " / " + c0);
		}

		//	とりあえず交差しているとする.


		//	壁の法線を求める.
		var p0p1 = new Vector2();
		p0p1.set(this.p1);
		p0p1.sub(this.p0);
		p0p1.normalize();

		this.n_vec.set(-p0p1.y, p0p1.x);			//	逆の場合は(y, -x) になる.

		//	移動ベクトルの壁の法線方向の成分を求める.
		this.ret.set(this.n_vec);
		var s = ab.dotProduct(this.n_vec);
		this.ret.scale(-s * (1.0 - r1));
		this.ret.add(this.c1);

		//	ちょっと内側に入れる.
		var	r_vec = new Vector2();
		r_vec.set(this.n_vec);
		r_vec.scale(0.0);
		this.ret.add(r_vec);

		if(this.debug_flag == false) {
			console.log("s:" + s + " ret:" + this.ret.x + ", " + this.ret.y);
		}

		if(this.debug_flag == false) {
			this.debug_flag = true;
		}
	};

	//	描画.
	this.draw = function(ctx) {
		var scale = 10.0;
		var ofs_x = -50;
		var ofs_y = -50;

		//	壁のライン(緑).
		ctx.strokeStyle = 'rgba(0, 128, 0, 1.0)';
		ctx.lineWidth	= 1;
		ctx.beginPath();
		ctx.moveTo((this.p0.x + ofs_x) * scale, (this.p0.y + ofs_y) * scale);
		ctx.lineTo((this.p1.x + ofs_x) * scale, (this.p1.y + ofs_y) * scale);
		ctx.stroke();

		//	移動ベクトル(青).
		ctx.strokeStyle = 'rgba(0, 0, 196, 1.0)';
		ctx.beginPath();
		ctx.moveTo((this.c0.x + ofs_x) * scale, (this.c0.y + ofs_y) * scale);
		ctx.lineTo((this.c1.x + ofs_x) * scale, (this.c1.y + ofs_y) * scale);
		ctx.stroke();

		//	法線ベクトル(赤).
		ctx.strokeStyle = 'rgba(196, 0, 0, 1.0)';
		ctx.beginPath();
		ctx.moveTo(this.p0.x, this.p0.y);
		ctx.lineTo(this.p0.x + this.n_vec.x * 50, this.p0.y + this.n_vec.y * 50);
		ctx.stroke();

		//	戻す位置(紫).
		ctx.strokeStyle = 'rgba(196, 0, 196, 1.0)';
		ctx.beginPath();
		ctx.moveTo((this.c1.x + ofs_x) * scale, (this.c1.y + ofs_y) * scale);
		ctx.lineTo((this.ret.x + ofs_x) * scale, (this.ret.y + ofs_y) * scale);
		ctx.stroke();
	};
};


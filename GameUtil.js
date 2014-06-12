//	角度変換.
function Deg2Rad(deg) {
	return deg * Math.PI / 180;
}
function Rad2Deg(rad) {
	return rad * 180 / Math.PI;
}

//	回転数の変換.
function OmegaToRpm(omega) { return omega / (Math.PI*2) * 60.0; }
function RpmToOmega(rpm) { return rpm * (Math.PI*2) / 60.0; }

//	速度の変化.
function KmhToMs(kmh) { return kmh / 3.6; }
function MsToKmh(ms) { return ms * 3.6; }

//	重力加速度.
function Gravity() {
	return 9.80665;
}

//	空気密度.
function AirDensity() {
	return 1.225;
}

//	馬力とkgfの関係
function PsKgf() {
	return 75.0;
}

//	HSV->RGB色変換(h:0-360 s:0-255 v:0-255).
function Hsv2Rgb(h, s, v) {

	//	ｈのリミッター.
	while(h < 0) {
		h += 360;
	}
	h = h % 360;

	//	特別な場合.
	if(s <= 0) {
		return {'r':v, 'g':v, 'b':v };
	}

	//	0 - 1.0 に変換.
	s = s / 255;

	var i = Math.floor(h / 60) % 6;
	var f = (h / 60) - i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);

	switch(i) {
	case 0:		r = v; g = t; b = p; break;
	case 1:		r = q; g = v; b = p; break;
	case 2:		r = p; g = v; b = t; break;
	case 3:		r = p; g = q; b = v; break;
	case 4:		r = t; g = p; b = v; break;
	case 5:		r = v; g = p; b = q; break;
	}

	return {'r':Math.round(r), 'g':Math.round(g), 'b':Math.round(b) };
}

//	２分探索の比較関数.
function cmp_default(a, b) { return a == b ? 0 : (a < b ? -1 : 1); };

//	２分探索.
function binary_search(array, value, getVal, cmp) {
	//	値の取得関数.
	if(!getVal) getVal = function(array, num) { return array[num]; }
	//	比較関数の設定.
	if(!cmp) cmp = cmp_default;

	var head = 0;
	var tail = array.length - 1;
	while(head <= tail) {
		var where = Math.floor((head + tail) / 2);
		if(value < getVal(array, where)) tail = where - 1;
		else head = where + 1;
	}

	if(head > 0) head--;
	return head;
}

//	継承用関数.
function extend(Child, Parent) {
	function F() {};
	F.prototype = Parent.prototype;
	Child.prototype = new F();

	Child.prototype.constructor = Child;
	Child.prototype.uber = Parent.prototype;
	Child.prototype.uber.constructor = Parent;
	return Child;
}


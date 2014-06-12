//	スライダーコントロール.

var fc = new BoostParamController();

function BoostParamController() {
	this.gOID		= 0;
	this.controller	= null;
}

function addEventHandler(o,evtName,evtHandler) {
  typeof(attachEvent)=='undefined'?o.addEventListener(evtName,evtHandler,false):o.attachEvent('on'+evtName,evtHandler);
}

function removeEventHandler(o,evtName,evtHandler) {
  typeof(attachEvent)=='undefined'?o.removeEventListener(evtName,evtHandler):o.detachEvent('on'+evtName,evtHandler);
}

/* コントローラ */
function Controller(o) {
	var	self = this;

	this.o			= o;
	this.controls	= [];
	this.cb			= [];
	this.options	= [];
	this.fbIE		= null;

	//	スライダーの値を更新.
	this.updateExsample = function() {

	};

	//	スライダーから値を読み取る.
	this.getValue = function(num) {
		return this.controls[num].value;
	};

	//	スライダーに値を設定する.
	this.setValue = function(num, value) {
		this.controls[num].setValue(value);
	};

	//	デストラクタ.
	this.destructor = function() {
		for (var i = self.controls.length; i--; ) {
			self.controls[i].destructor();
		}
/*
		for ( i = self.cb.length; i--; ) {
			self.cb.onclick = null;
			self.cb[i] = null;
		}
		for ( i = self.options.length; i--; ) {
			self.options[i] = null;
		}
*/
/*
		if (fc.isIE) {
			self.fbIE.onmouseover = null;
			self.fbIE.onmouseout = null;
			self.fbIE = null;
		}
*/
		self.cb = null;
		self.options = null;
		self.controls = null;
		self.functionExample = null;
		self.o = null;
	};


	var	dd_num = 3;
	var items = parseInt(this.o.length / dd_num);

	//	スライダーの登録.
	for (var i = 0; i < items; i++) {
		this.controls[this.controls.length] = new Slider(this.o[(dd_num*i)+dd_num-1].getElementsByTagName('div')[1], this.o[(dd_num * i) + 1], this.o[(dd_num*i)+dd_num-1].getElementsByTagName('div')[0]);
	}

/*	this.cb = [document.getElementById('disabled-0'), document.getElementById('disabled-1')];
	for ( i = this.cb.length; i--; ) {
		this.cb[i]._index = i;
		this.cb[i].onclick = this.cbClick;
	}
*/
/*
	this.cb[1].checked = false;
	this.options = [document.getElementById('opt-random0'), document.getElementById('opt-random1')];
	this.options[0].checked = false;
	this.options[1].checked = true;
*/
/*
	if (fc.isIE) {
		this.fbIE = document.getElementById('fireButton');
		this.fbIE.onmouseover = function() {
			this.className = 'hover';
		};
		this.fbIE.onmouseout = function() {
			this.className = '';
		};
	};
*/
}



//	スライダー本体.
function Slider(o, oV, oB) {
	var self = this;
	this.o		= o;
	this.oV		= oV;
	this.oB		= oB;
	this.scale	= parseInt(oV.innerHTML.toString().substr(2));
	this.oID	= 'sc'+(fc.gOID++);
	this.offX	= 0;
	this.x		= 0;
	this.xMin	= 0 - 10;
	this.xMax	= self.o.parentNode.offsetWidth - 10;
	this.value	= 0;
	this.timer	= null;
	this._className	= this.o.className;
	this.tween	= [];
	this.frame	= 0;

	this.over = function() {
		this.className = self._className+' hover';
		event.cancelBubble = true;
		return false;
	};

	this.out = function() {
		this.className = self._className;
		event.cancelBubble = true;
		return false;
	};

	this.down = function(e) {
		var e = e? e: event;
		self.offX = e.clientX - self.o.offsetLeft;
		addEventHandler(document, 'mousemove', self.move);
		addEventHandler(document, 'mouseup', self.up);
		return false;
	};

	this.barClick = function(e) {
		var e = e ? e : event;
		self.slide(self.x, e.clientX - self.o.parentNode.parentNode.offsetLeft - self.o.offsetWidth);
	};

	this.move = function(e) {
		var e = e ? e : event;
		var x = e.clientX - self.offX;
		if (x > self.xMax) {
			x = self.xMax;
		} else if (x < self.xMin) {
			x = self.xMin;
		}
		if (x != self.x) {
			self.moveTo(x);
			self.doUpdate();
		}
		e.stopPropgation ? e.stopPropagation() : e.cancelBubble = true;
		return false;
	};

	//	マウスのボタンが離された.
	this.up = function(e) {
		removeEventHandler(document, 'mousemove', self.move);
		removeEventHandler(document, 'mouseup', self.up);
//		fc.controller.updateExample();
		console.log(self.value);
	};

	//	クリックしたところまでアニメーションさせる.
	this.slide = function(x0, x1) {
//		self.tween = fc.animator.createTween(x0, x1);
//		fc.animator.enqueue(self, self.animate, fc.controller.updateExample);
//		fc.animator.start();
	};

	this.moveTo = function(x) {
		self.x = x;
		self.o.style.marginLeft = x + 'px';
	};

	this.animate = function() {
		self.moveTo(self.tween[self.frame].data);
		self.doUpdate(50);
		if (self.frame++ >= self.tween.length - 1) {
			self.active = false;
			self.frame = 0;
			if (self._oncomplete)
				self._oncomplete();
			self.doUpdate();
			return false;
		}
		return true;
	};

	this.doUpdate = function(t) {
		if (!self.timer)
			self.timer = setTimeout(self.update, t || 20);
	};

	this.update = function() {
		self.timer = null;
		self.value = 1 + parseInt(self.x / self.xMax * (self.scale - 1));
		if (self.value < 1)
			self.value = 1;
		if (self.oV.innerHTML != self.value)
			self.oV.innerHTML = self.value;
	};

	this.randomize = function() {
		self.slide(self.x, parseInt(Math.random() * self.xMax));
	};

	//	値をスライダーに設定する.
	this.setValue = function(val) {
		self.x = parseInt(val / (self.scale - 1) * self.xMax);
		self.value = val;
		self.moveTo(self.x);
		self.doUpdate();
	};

	this.destructor = function() {
		self.o.onmouseover = null;
		self.o.onmouseout = null;
		self.o.onmousedown = null;
		self.o = null;
		self.oV = null;
		self.oB.onclick = null;
		self.oB = null;
	};

	if (fc.isIE) {
		// IE is lame, no :hover
		this.o.onmouseover = this.over;
		this.o.onmouseout = this.out;
	}

	this.o.onmousedown = this.down;
	this.oB.onclick = this.barClick;
	self.update();

}


function demoInit() {
//	document.getElementById('hideStuff').checked = false;
	fc.controller = new Controller(document.getElementById('controls').getElementsByTagName('dd'));
}

function demoDestuctor() {
	if (fc.controller) {
		fc.controller.destructor();
	}
	fc.controller = null;
}

addEventHandler(window, 'load', demoInit);
addEventHandler(window, 'unload', demoDestuctor);






var JsSlider = function(slider, out, input) {
	this.slider		= slider;
	this.output		= out;
	this.input		= input;

	this.root		= document.documentElement;
	this.dragging	= false;
	this.value		= this.output.value;
	this.width		= this.input.clientWidth / 2;

	//	値の設定.
	this.setValue = function() {
		//	つまみのサイズ（input.clientWidth）だけ位置を調整.
		this.input.style.left = (this.value - this.input.clientWidth / 2) + 'px';
		this.output.value = this.value;
	};
	this.setValue();

	//	目盛り部分をクリックしたとき.
	this.slider.onclick = function(evt) {
		this.dragging = true;
		document.onmousemove(evt);
		document.onmouseup();

		console.log("slider.onclick");
	};

	//	ドラッグ開始.
	this.input.onmousedown = function(evt) {
		this.dragging = true;
		console.log("input.onmousedown");

		return false;
	};

	//	ドラッグ終了.
	document.onmouseup = function(evt) {
		if(this.dragging) {
			this.dragging = false;
			this.output.value = this.value;
		}
	};

	//	マウスの移動.
	document.onmousemove = function(evt) {
		if(this.dragging) {
			//	ドラッグ途中.
			if(!evt) {
				evt = window.event;
			}
			var left = evt.clientX;
			var rect = this.slider.getBoundingClientRect();
			//	マウス座標とスライダーの位置関係で値を決める.
			this.value = Math.round(left - rect.left - this.width);
			//	スライダーからはみ出したとき.
			if(this.value < 0) {
				this.value = 0;
			} else if(this.value > this.slider.clientWidth) {
				this.value = this.slider.clientWidth;
			}
			this.setValue();
			return false;
		}
	};

};

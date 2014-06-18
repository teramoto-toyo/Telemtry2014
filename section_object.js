//本体
var SectionObject = function() {

	var init = false;
	
	var v_list = [
				  [0,		135,	0,	0,  0,  0,  0,  0,  0,  5, 0], //
	              [1600,	135,	0,	0,  0,  0,  0,  0,  0,  0, 0], //
	              [2700,	290,	0,	-10, 20,  0,  0,  0,  0,  0, 0], //
	              [4150,	345,	0,	0,  0,  0,  0,  0,  0,  0, 0], //
	              [5900,	215,	0,	0,  0,  0,  0,  0,  0,  0, 0], //
	              [7900,	220,	0,	0,  0,  0,  0,  0,  0,  0, 0], //
	              [9700,	315,	0,	0,  0,  0,  0,  0,  0,  0, 0], //
	              [13000,	330,	0,	0,  0,  0,  0,  0,  0,  0, 0], //
	              [15200,	330,	0,	0,  0,  0,  0,  0,  0,  0, 0], //
	              [17100,	310,	0,	0,  0,  0,  0,  0,  0,  0, 0], //
	              [18900,	120,	0,	0,  0,  0,  0,  0,  0,  0, 0], //
	              [20700,	30,	    1,	0,  0,  0,  0,  0,  0,  0, 0], //
	              [21900,	145,	0,	0,  0,  0,  0,  0,  0,  0, 0], //
	              [25000,	135,	0,	0,  0,  0,  0,  0,  0,  0, 0], //
	              ];

	//	初期化.
	this.initialize = function() {
	};
	
	//JSONデータを元に描画する
	//

	this.getXYfromV = function(v) {
	  var x = 100 + 100 * Math.floor(Math.random() * 8);
	  var y = 100 + 100 * Math.floor(Math.random() * 6);
	  
	  return {
	    "x": x,
	    "y": y
	  };
	};

	this.drawSectionMarker = function(ctx, i, x, y, angle, text) {
	  ctx.save();
	  ctx.translate(x, y);
	  ctx.rotate(angle * Math.PI / 180);
	  
	  ctx.strokeStyle = 'rgb(10, 10, 10)';
	  ctx.lineWidth = 1;
	  
	  ctx.translate(-x, -y);

	  // まっすぐ線
	  ctx.beginPath();
	  ctx.moveTo(x, y);
	  ctx.lineTo(x, y - 20);
	  ctx.closePath();
	  ctx.lineWidth = 2;
	  ctx.stroke();
	  
	  // △
	  ctx.beginPath();
	  ctx.moveTo(x, y - 20);

	  if (v_list[i][2])
	  {
	  	ctx.lineTo(x - 10, y - 15);
	  }
	  else
	  {
	  	ctx.lineTo(x + 10, y - 15);
	  }

	  ctx.lineTo(x, y - 10);
	  ctx.closePath();
	  ctx.fillStyle = 'rgb(10, 10, 10)';
	  ctx.fill();
	  //ctx.stroke();
	  	  
	  ctx.restore();

	  if (text != null) {
	  	ctx.save();

	  	ctx.translate(x, y);
	    ctx.rotate(angle * Math.PI / 180);

		ctx.translate(15, - 30);

	    ctx.rotate(-angle * Math.PI / 180);
	    	    
	    ctx.font = '20px Arial';
	    ctx.fillStyle = 'rgba(10, 10, 10, 0.7)';


	    var ofs_x = v_list[i][3];
	    var ofs_y = v_list[i][4];

	    ctx.fillText(text,ofs_x, ofs_y);

	    ctx.restore();
	  }
	};
	

	this.drawSpeedMarker = function(ctx, i, x, y, angle, text, is_highspeed) {
	  ctx.save();

	  ctx.translate(x, y);
	  ctx.rotate(angle * Math.PI / 180);
	  
	  ctx.strokeStyle = 'rgba(200, 0, 0, 0.7)';
	  ctx.lineWidth = 1;
	  
	  ctx.translate(-x, -y);

	  // まっすぐ線
	  ctx.beginPath();
	  ctx.moveTo(x, y);
	  ctx.lineTo(x, y - 25);
	  ctx.closePath();
	  ctx.lineWidth = 2;
	  ctx.stroke();
	  
	  // ○
	  ctx.fillStyle = 'rgba(200, 0, 0, 0.7)';
	  ctx.beginPath();
	  ctx.arc(x, y -40 , 15, 0, Math.PI*2, false);
	  //ctx.fill();
	  ctx.stroke();
	  	  
	  ctx.restore();

	  if (text != null) {
	  	ctx.save();

	  	ctx.translate(x, y);
	    ctx.rotate(angle * Math.PI / 180);

		ctx.translate(15, - 30);

	    ctx.rotate(-angle * Math.PI / 180);
	    	    
	    ctx.font = '14px Arial';
	    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';


	    var ofs_x = v_list[i][9];
	    var ofs_y = v_list[i][10];

	    ctx.fillText(text,ofs_x, ofs_y);

	    ctx.restore();
	  }
	};


	this.exec = function(work) {

		this.updateVcoord(work);	

		if(work.game_mode > GAME_MODE.LOAD_COURSE) {

			if (!init)
			{
				// 最初だけ座標更新
				this.w_pos_list.length = 0; 

				for (var i = 0; i < v_list.length; i++)
				{
					var v = v_list[i][0];
					var w_pos = work.course_obj.convCrsDis2Pos(v);
					this.w_pos_list.push(w_pos);
				}
				init = true;
			}

			this.max_pos_list.length = 0;
			this.min_pos_list.length = 0;

			for (var i = 0; i < v_list.length; i++)
				{
					v = v_list[i][5];
					w_pos = work.course_obj.convCrsDis2Pos(v);
					this.max_pos_list.push(w_pos);

					v = v_list[i][7];
					w_pos = work.course_obj.convCrsDis2Pos(v);
					this.min_pos_list.push(w_pos);
				}
		}
//		console.log(w_pos);
	};


	this.updateVcoord = function(work) {
		if(work.section_json) {
			for (i =0; i < 12; i++) {
				v_list[i][5] = work.section_json[i].max_speed_v; // 最高速V
				v_list[i][6] = work.section_json[i].max_speed; // 最高速
				v_list[i][7] = work.section_json[i].min_speed_v; // ボトムV
				v_list[i][8] = work.section_json[i].min_speed; // ボトム速度
			}
		}
	}

	
	this.draw = function(ctx, scale) {
	  
	  for (var i = 0; i < this.w_pos_list.length; i++) {
		var x = this.w_pos_list[i].x * scale;
		var y = this.w_pos_list[i].y * scale;

	    //var angle = document.getElementById("test_id").value;
	    var angle = v_list[i][1];
	    var text = (i + 1).toString();
	    var textOffsetX = 30;
	    var textOffsetY = 30;
	    
	    this.drawSectionMarker(ctx, i, x, y, angle, text);

	    // 最高速
	    if (v_list[i][6] > 0)
	    {
			x = this.max_pos_list[i].x * scale;
			y = this.max_pos_list[i].y * scale;

			var speed = v_list[i][6]; 

	    	this.drawSpeedMarker(ctx, i, x, y, angle, speed, true);
	    }
	  }
	};

};

SectionObject.prototype = {
	w_pos_list			: new Array(),
	max_pos_list			: new Array(),
	min_pos_list			: new Array(),
}
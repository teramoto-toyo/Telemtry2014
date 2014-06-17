//本体
var SectionObject = function() {
	
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

	this.drawSectionMarker = function(ctx, x, y, angle, text, textOffsetX, textOffsetY) {
	  ctx.save();
	  ctx.translate(x, y);
	  
	  ctx.rotate(angle * Math.PI / 180);
	  
	  var size = 20;
	  var r = (size / 2);
	  
	  ctx.translate(-x, -y);
	  
	  ctx.beginPath();
	  ctx.moveTo(x, y - r);
	  ctx.lineTo(x + r, y + r);
	  ctx.lineTo(x - r, y + r);
	  ctx.closePath();
	  ctx.fillStyle = 'rgb(0, 0, 0)';
	  ctx.fill();
	  
	  ctx.restore();
	  
	  if (text != null) {
	    var textX = (x + textOffsetX);
	    var textY = (y + textOffsetY);
	    
	    ctx.beginPath();
	    ctx.moveTo(x, y);
	    ctx.lineTo(textX, textY);
	    ctx.closePath();
	    ctx.lineWidth = 2;
	    ctx.stroke();
	    
	    ctx.font = '20px Arial';
	    ctx.fillText(text, textX, textY);
	  }
	};
	
	this.exec = function(work) {
		if(work.game_mode > GAME_MODE.LOAD_COURSE) {
			this.w_pos_list.length = 0; 
			for(i = 1; i<=12; i++) {
				var w_pos = work.course_obj.convCrsDis2Pos(i*2000);
				this.w_pos_list.push(w_pos);
			}
		}
//		console.log(w_pos);
	};
	
	this.draw = function(ctx, scale) {
	  
	  for (var i = 0; i < this.w_pos_list.length; i++) {
		var x = this.w_pos_list[i].x * scale + 20.0;
		var y = this.w_pos_list[i].y * scale - 20.0;

	    var angle = Math.floor(i * 360);
	    var text = "Marker No." + (i + 1).toString();
	    var textOffsetX = 30;
	    var textOffsetY = 30;
	    
	    this.drawSectionMarker(ctx, x, y, angle, text, textOffsetX, textOffsetY);
	  }
	};

};

SectionObject.prototype = {
	w_pos				: new Vector2(),	//	ワールド座標.
	w_pos_list			: new Array()
}
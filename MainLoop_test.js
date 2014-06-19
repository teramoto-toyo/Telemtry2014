//	ゲームモードのenum.
var GAME_MODE = {
	INIT		: 0,			//	初期化中.
	LOAD_COURSE	: 1,			//	コース読み込み.
	SETUP_RACE	: 2,			//	レース準備.
	GORACE		: 3				//	レース中.
};

//	システム共通ワーク.
var	SystemWork = function() {
	//	画面サイズ.
	this.SCR_W		= 980;
	this.SCR_H		= 980;
	this.SCR_HH     = 1300;  // スクリーンサイズ.

	//	Canvasと描画コンテキスト.
	this.canvas		= null;
	this.ctx		= null;
	this.draw_scale	= 3.0;					//	描画スケール.
	this.draw_offset	= new Vector2(0, 0);

	this.frame_cnt		= 0;

	//this.interval		= 1000/50;			//	ループ間隔(ms)
	this.interval		= 1000/60;			//	ループ間隔(ms)
	this.db_interval	= 1000;				//	DBアクセスループ間隔(ms)
	this.db_cnt			= 0;
	this.oc_int			= 3000;				//	敵車データ間隔(ms)
	this.oc_cnt			= 0;
	this.loop_timer		= 0;
	this.current_time	= 0;
	this.diff_time		= 0;
	this.next_time		= 0;
	this.timer			= 0;
	//this.delta_t		= 1/50;				//	固定時間.
	this.delta_t		= 1/60;				//	固定時間.

	this.pause			= false;			//	ポーズフラグ.


	//	ゲームオブジェクト.
	this.game_obj		= new Array();

	//	モード.
	this.game_mode		= GAME_MODE.INIT;

	//	ゲーム用ワーク.
	this.first_flag		= false;

	//	コースのオーバーレイ.
	this.overlay_img	= new Image();
	this.load_img		= false;

	//  メーター.
	//this.needle_img = new Image();
	//this.meter_img = new Image();

	//	DBデータ.
	this.db_lap_distance = 0.0;
	this.db_throttle_pos = 0.0;
	this.db_brake_status = 0;
	this.db_gear = 1;
	this.db_steered_angle = 0.0;
	this.db_engine_rpm = 0;
	this.db_fuel_used = 0.0;
	this.db_eng_temp = 0.0;
	this.db_eng_oil_temp = 0.0;
	this.db_gbox_oil_temp = 0.0;
	this.db_brake_temp_f = 0.0;
	this.db_brake_temp_r = 0.0;
	this.db_ground_speed = 0.0;
	this.db_g_lat = 0.0;
	this.db_g_long = 0.0;
	this.db_datetime = '0000-00-00 00:00:00';

	// グラフ用途
	this.eng_tmp_array = new Array();
	this.eng_oil_array = new Array();
	this.gbox_oil_array = new Array();

	this.g_array = new Array();

	//順位

	this.top3 = new Array (3);
	this.class_fr = new Array(2);


	//	コントロール.
	this.course_obj		= null;				//	コース表示オブジェクト.
	this.car_obj		= null;				//	クルマオブジェクト.
	this.meter_obj      = null;				//  メーターオブジェクト.
	this.other_car_obj  = null;				//  他の車取得.
	this.section_obj	= null;
	
	
	//セクションデータ
	this.section_json = null;
};

var	sys_work = new SystemWork();			//	ワークの生成.






//	表示開始.
window.onload = function() {

	//	Canvasの取得.
	sys_work.canvas = document.getElementById('cvs');
	if(!sys_work.canvas.getContext) {
		return false;
	}
	//	描画コンテキストを取得.
	sys_work.ctx = sys_work.canvas.getContext('2d');

	//	初期化.
	initialize();




	//	メインループ.
	var	main_loop = function() {
		//	前のフレームからの経過時間を調べる.
		sys_work.current_time	= new Date();
		sys_work.diff_time = sys_work.current_time - sys_work.loop_timer;

		//	今の時間を保存する.
		sys_work.loop_timer = sys_work.current_time;

		//	キーデータ更新.
		//sys_work.keyinput.update();

		//	ポーズ切り替え.
		//if(sys_work.keyinput.trigger & sys_work.keyinput.pause) {
		//	sys_work.pause = sys_work.pause? false: true;
		//}

		//	実行処理.
		//if(sys_work.pause == false || (sys_work.keyinput.trigger & sys_work.keyinput.step)) {
			//	GameObjを実行する.
			for(var lp1 = 0; lp1 < sys_work.game_obj.length; lp1++) {
				sys_work.game_obj[lp1].exec(sys_work);
			}

			//	カウンタ更新.
			sys_work.frame_cnt++;
			sys_work.db_cnt++;
			sys_work.oc_cnt++;

        // DB更新処理.
        //if (sys_work.db_cnt > (sys_work.db_interval / sys_work.interval))
        //{
        //    updateData();
        //    sys_work.db_cnt = 0;
        //}
		

		//	描画処理.
		sys_work.ctx.clearRect(0, 0, sys_work.SCR_W, sys_work.SCR_HH);
		
		//	変換マトリクスを設定.
		sys_work.ctx.setTransform(1, 0, 0, 1, 0, 0);
		sys_work.ctx.translate(	sys_work.SCR_W/2 - sys_work.draw_offset.x * sys_work.draw_scale,
								sys_work.SCR_H/2 - sys_work.draw_offset.y * sys_work.draw_scale);			//	画面の中心.

		//	GameObjの描画処理.
		for(var lp1 = 0; lp1 < sys_work.game_obj.length; lp1++) {
			sys_work.game_obj[lp1].draw(sys_work.ctx, sys_work.draw_scale);
		}

		//	fpsの描画.
		sys_work.ctx.setTransform(1, 0, 0, 1, 0, 0);
		//sys_work.ctx.fillStyle = 'rgba(0, 128, 128, 1.0)';
		//sys_work.ctx.fillText("version 2 cnt:" + sys_work.frame_cnt + " fps:" + (1000.0/sys_work.diff_time).toFixed(2) + "yellows" + sys_work.other_car_obj.yerllows.length  , 10, 20);
		
		var ust = new Date(sys_work.db_datetime);

        var local_time = new Date ();
        local_time.setTime (ust.getTime() + (2 * 60 * 60 * 1000));

		var now = new Date();
		sys_work.ctx.font="10px Arial";
		if ((now.getTime() - local_time.getTime()) < 5*60*1000)
		{
			sys_work.ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
			sys_work.ctx.fillText("last update(race local):" + local_time.toLocaleString(), 10, 10);
		}
		else
		{
			sys_work.ctx.fillStyle = 'rgba(255, 0, 0, 1.0)';
			sys_work.ctx.fillText("last update(race local):" + local_time.toLocaleString() + "  telemetry sysytem maybe stopped....", 10, 10);
		}
			
		sys_work.ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    	sys_work.ctx.font="40px Arial";
		sys_work.ctx.fillText(conv2fixed(now.getUTCHours() + 1) + ":" + conv2fixed(now.getMinutes()-1) + ":" + conv2fixed(now.getSeconds()-1), 10, 50);

		

		//	キーの描画.
//		sys_work.ctx.fillText("up:" + sys_work.keyinput.up + " left:" + sys_work.keyinput.left, 10, 30);
//		sys_work.ctx.fillText("level:" + sys_work.keyinput.level.toString(16)
//							+ " trigger:" + sys_work.keyinput.trigger.toString(16), 10, 40);

		//	intervalの間隔を空けてループ.
		clearTimeout(sys_work.timer);

		sys_work.current_time = new Date();										//	現在時間.
		sys_work.diff_time = sys_work.current_time - sys_work.loop_timer;		//	ループ内の経過時間.
		sys_work.next_time = sys_work.interval - sys_work.diff_time;			//	次のループまでの時間.
		if(sys_work.next_time < 0) sys_work.next_time = 0;						//	処理落ちしていたらすぐに実行.

		return sys_work.timer = setTimeout(main_loop, sys_work.next_time);
	};
	
	// DB更新開始.
	updateData();
	
	//サブループ
	var count = 0;
	var subLoop = function() {
    	if(count >= 0) {
    	    setTimeout(subLoop, 1000);
		}
		
		//セクション情報更新
		$.getJSON("get_db_section_JSON.php", function(ret_json) {
			sys_work.section_json = ret_json;
		});
		
		//セクションテーブル更新
		if(sys_work.section_json) {
			$('#section_data_table').empty();
			$('#section_data_table').append(
				$("<tr></tr>")				.append($('<th class="name"></th>').text("Name"))
				.append($('<th></th>').text("Lap"))
				.append($('<th></th>').text("Driver"))
				.append($('<th></th>').text("Max"))
				.append($('<th></th>').text("Min"))
				.append($('<th></th>').text("Max G"))
				.append($('<th colspan="4" class="tire"></th>').text("Tire Temp FL/FR/RL/RR"))
				.append($('<th colspan="4" class="tire"></th>').text("Tire Press FL/FR/RL/RR"))
				.append($('<th class="name"></th>').text("datetime"))
			);
			
			jQuery.each(sys_work.section_json, function() {
				$('#section_data_table').append(
					$("<tr></tr>")					.append('<td class="name">' + this.section_index + ' : ' + this.section_name + '</td>')
					.append('<td>' + this.lap_number + '</td>')
					.append('<td>' + this.driver_index + '</td>')
					.append('<td>' + this.max_speed + '</td>')
					.append('<td>' + this.min_speed + '</td>')
					.append('<td>' + this.max_g + '</td>')
					.append('<td>' + this.tyre_temp_fl.toFixed(1) + '</td>')
					.append('<td>' + this.tyre_temp_fr.toFixed(1) + '</td>')
					.append('<td>' + this.tyre_temp_rl.toFixed(1) + '</td>')
					.append('<td>' + this.tyre_temp_rr.toFixed(1) + '</td>')
					.append('<td>' + this.tyre_press_fl + '</td>')
					.append('<td>' + this.tyre_press_fr + '</td>')
					.append('<td>' + this.tyre_press_rl + '</td>')
					.append('<td>' + this.tyre_press_rr + '</td>')
					.append('<td>' + this.datetime + '</td>')

				);
			});
		}
	};
	subLoop();
	
	//	ループ開始.
	clearTimeout(sys_work.timer);
	return sys_work.timer = setTimeout(main_loop, sys_work.interval);
};

// ２桁にする
function conv2fixed(value)
{
  var temp = "0" + (value + 1);
  var ret = temp.substr(temp.length - 2);
  return ret;
}



//	オブジェクトのコマンド実行.
function execCommand(command) {
	for(var lp1 = 0; lp1 < sys_work.game_obj.length; lp1++) {
		sys_work.game_obj[lp1].execCommand(command);
	}
};

//	制御点の座標初期化.
function initialize() {

	//	オブジェクトの生成.
	//	コース.
	sys_work.course_obj = new CourseObject();
	sys_work.course_obj.initialize();
	sys_work.game_obj.push(sys_work.course_obj);
	
	//  アザーカー.
	//sys_work.other_car_obj = new OtherCarObject();
	//sys_work.other_car_obj.initialize();
	//sys_work.game_obj.push(sys_work.other_car_obj);


	//  メータ.
	sys_work.meter_obj = new MeterObject();
	sys_work.meter_obj.initialize();
	sys_work.game_obj.push(sys_work.meter_obj);

	//	セクション
	sys_work.section_obj = new SectionObject();
	sys_work.section_obj.initialize();
	sys_work.game_obj.push(sys_work.section_obj);

	//	クルマ.
	sys_work.car_obj = new CarObject();
	sys_work.car_obj.initialize();
	sys_work.game_obj.push(sys_work.car_obj);


	//	ゲームモード初期化.
	sys_work.game_mode = GAME_MODE.INIT;

	//	画像のロード.
	sys_work.overlay_img.src = "Nur_Layout_with_no.png?" + new Date().getTime();
	//sys_work.needle_img.src = "needle.png";
	//sys_work.meter_img.src = "meter.png";

    /* 画像が読み込まれるのを待ってから処理を続行 */
    sys_work.overlay_img.onload = function() {
      //sys_work.ctx.drawImage(overlay_img, 0, 0);
      sys_work.load_img = true;
    }
	
	
};

//	リスタートボタンが押されたときの処理.
function RestartRace() {
	//	レースのリスタート.
	var	com	= { 0 : "RESTART" };
	execCommand(com);
	//updateData();
};



//	DBからの情報更新.
function updateData() {
        var jsonp = './get_db_JSON.php';
        var request = $.ajax({url:jsonp, 
                                cache:false,
                                context:this

                            }
                            ).then(
        						function(data) { on_loaded(data); },
        						function(data) { updateData(); }
       						);
  //sendRequest(on_loaded, '', 'GET', './get_db_JSON.php', true, true);
}

// ------------------------------
//　JSONデータ取得完了のコールバックf
// ------------------------------
function on_loaded(oj) {
//	console.log("on_loaded start....");
	// JSONデータをevalでメモリ上に展開
	//var text = decodeURIComponent(oj.responseText);
	
	eval('var res = ' + oj);

	// 最新のデータをチェック
	if(sys_work.db_datetime == res.marker[0].datetime) {
		// 新しいデータがない
	}
	else {
		// 新しいデータが増えていた場合
		sys_work.db_lap_distance = res.marker[0].lap_distance;
		sys_work.db_throttle_pos = res.marker[0].throttle_pos;
		sys_work.db_brake_status = res.marker[0].brake_status;
		sys_work.db_gear = res.marker[0].gear;
		sys_work.db_steered_angle = res.marker[0].steered_angle;
		sys_work.db_engine_rpm = res.marker[0].engine_rpm;
		sys_work.db_fuel_used = res.marker[0].fuel_used;
		sys_work.db_eng_temp = res.marker[0].eng_temp;
		sys_work.db_eng_oil_temp = res.marker[0].eng_oil_temp;
		sys_work.db_gbox_oil_temp = res.marker[0].gbox_oil_temp;
		sys_work.db_brake_temp_f = res.marker[0].brake_temp_f;
		sys_work.db_brake_temp_r = res.marker[0].brake_temp_r;
		sys_work.db_ground_speed = res.marker[0].ground_speed;
		sys_work.db_g_lat = res.marker[0].g_lat;
		sys_work.db_g_long = res.marker[0].g_long;
		sys_work.db_datetime = res.marker[0].datetime;


		// グラフ用途
		sys_work.eng_tmp_array.push(sys_work.db_eng_temp);
		sys_work.eng_oil_array.push(sys_work.db_eng_oil_temp);
		sys_work.gbox_oil_array.push(sys_work.db_gbox_oil_temp);
		// グラフ１０個分
		if (sys_work.eng_tmp_array.length>100)
		{
			sys_work.eng_tmp_array.shift();
			sys_work.eng_oil_array.shift();
			sys_work.gbox_oil_array.shift();
		}

		var g_val = new Vector2();
		g_val.y = sys_work.db_g_long;
		g_val.x = sys_work.db_g_lat;

		sys_work.g_array.push (g_val);
		if (sys_work.g_array.length > 60)
		{
			sys_work.g_array.shift();
		}
	}
//	console.log(res.marker[0].datetime);
	sleep(1000);
	updateData();
}	// end - on_loade



// settimeout使用
function sleep(time) {
  setTimeout(this.after, time);
}

function after(){
  //alert("2s経過");
}

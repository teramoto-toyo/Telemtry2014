/*
 * 元オブジェクト.
 */

function GameObject() {
}

//	共通メソッド.
GameObject.protptype = {
	//	システムワーク.
	sys_work:		null,

	//	共通ワーク.
	exec_flag:		true,					//	実行メソッド呼び出しフラグ.
	draw_flag:		true,					//	描画メソッド呼び出しフラグ.
	mode:			0,						//	実行モード.

	//	初期化.
	initialize:		function() { mode = 0; },
	//	メッセージ処理.
	execCommand:	function(command) {},
	//	実行処理.
	exec:			function(work) {},
	//	描画処理.
	draw:			function(ctx, scale) {},

	//	システムワークの取得.
	getSW: function() {
		if(this.sys_work === null) {
			this.sys_work = sys_work;
		}
		return this.sys_work;
	}
};


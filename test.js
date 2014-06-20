window.onload = function() {
  updateData();
}



//	DBからの情報更新.
function updateData() {
  sendRequest(on_loaded, '', 'GET', './get_db_JSON.php', true, true);

	// ------------------------------
	//　JSONデータ取得完了のコールバックf
	// ------------------------------
	function on_loaded(oj) {
		console.log("on_loaded start....");
		// JSONデータをevalでメモリ上に展開
		var text = decodeURIComponent(oj.responseText);
		eval('var res = ' + text);
			// 新しいデータが増えていた場合
			// test.
		console.log(res.marker[0].datetime);
		updateData();
	}	// end - on_loaded
}
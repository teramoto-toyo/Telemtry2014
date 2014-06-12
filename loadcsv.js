//	CSVファイルの読み込み.

var	enableData = false;
var csvData = null;


function loadCSV(path) {
	var httpObj = createXMLHttpRequest(handleResult);
	enableData = false;
	if(httpObj) {
		httpObj.open("GET", path, true);		//	httpの非同期リクエスト.
		httpObj.send(null);
	}
};

//	CSVファイルが読み込まれたときの処理.
function handleResult() {
	if((this.readyState == 4) && (this.status == 200)) {
		var text = getAjaxFilter()(this.responseText);
		csvData = parseCSV(text);

		enableData = true;
	}
};

//	CSVを配列に読み込む.
function parseCSV(str) {
	var CR = String.fromCharCode(13);
	var LF = String.fromCharCode(10);

	var	lines = str.split(CR+LF);
	var readData = new Array();

	for(var lp1 = 0; lp1 < lines.length; lp1++) {
		var cells = lines[lp1].split(",");
		if(cells.length != 1) readData.push(cells);
	}
	return readData;
};

//	XMLHttpRequestを生成する.
function createXMLHttpRequest(cbFunc) {
	var XMLhttpObject = null;
	try {
		XMLhttpObject = new XMLHttpRequest();
	} catch(e) {
		//	IEで実行する場合のコード.
		try {
			XMLhttpObject = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			try {
				XMLhttpObject = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {
				return null;
			}
		}
	}

	//	httpリクエストが成功した時に呼ばれるコールバックを設定する.
	if(XMLhttpObject) XMLhttpObject.onreadystatechange = cbFunc;
	return XMLhttpObject;
};


function getAjaxFilter() {
	if(navigator.appVersion.indexOf("KHTML") > -1) {
		return function(t) {
			var esc = escape(t);
			return (esc.indexOf("%u") < 0 && esc.indexOf("%") > -1) ? decodeURIComponent(esc) : t;
		};
	} else {
		return function(t) {
			return t;
		};
	}
};



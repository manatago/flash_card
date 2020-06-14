$(function(){
	//読み込み先のディレクトリ指定
	var csv_dir_path=$('#flash_card').attr('dir_path');
	//読み込むTSVファイル名
	var file_name=$('#flash_card').attr('name');
	//flashカードのデータを入れるための文字列
	var data_str ='';
	//flashカードのデータを入れるための配列
	var d = new Array;
	//初期値
	var start;
	var num = 0;
	var interval_id;
	var disp;
	var interval_time=4000;
	if($('#flash_card').attr('interval')){
		interval_time=Number($('#flash_card').attr('interval'));
	}
	var fsize=45;
	//指定ファイルを読み込む
	get_data(file_name);
	//TSVファイルを配列に変換
	data_str_to_array();
	//audioを描画
	put_audios();
	//STYLEを指定
	flash_card_style();
	console.log(d);

	function put_audios(){
		for(var i=0;i<d.length;i++){
				var url=csv_dir_path+'data/mp3/'+d[i][1];
				var audio = $('<audio>');
				audio.attr('src',url);
				$('#flash_card').append(audio);			
		}
	}


	function flash_card_style(){
		$('#flash_card').parent().css('width','100%');
		$('#flash_card').css({
											'max-width':'500px',
											'height':'280px',
											'padding':'0',
											'background-image':'url(https://support.gakuto.co.jp/wp-content/uploads/2020/06/flash_card.png)',
											'background-repeat':'no-repeat',
											'background-size':'contain',
											'margin':'0 auto'
										});
		//表示エリアの追加
		disp = $('<div>');
		disp.css({
							'max-width':'500px',
							'margin':'0 auto',
							'padding':'15px 0 0 25%',
							'height':'150px',
							'font-size':fsize+'px'
		});
		disp.on('click',function(){
			clearInterval(interval_id);
			start.prop('disabled',false);
		});
		$('#flash_card').append(disp);
		$('#flash_card').css('padding','10 20px');
		//ボタンの追加
		start = $('<button>');
		start.html('再生');
		start.css('display','block');
		start.css('margin-left','auto');
		start.css('width','50%');
		start.css('border-radius','20px');
		$('#flash_card').append(start);
		start.on('click',function(){
				flash_start();
		});
	}
	function display_flash(){
		var this_num=num;
		//音声再生
		var audio = $('audio').get(this_num);
		audio.play();
		//英語を表示
		resize_font(d[this_num][0],'en');
		disp.html(d[this_num][0]);
		//遅れて日本語を表示
		setTimeout(function(){
			disp.html(d[this_num][2]);
			resize_font(d[this_num][2],'ja');
		},interval_time/2);
		num++;
		if(num>=d.length){
			clearInterval(interval_id);
			num=0;
			start.prop('disabled',false);
		}	
	}

	//フォントのリサイズ
	function resize_font(text,lang){
		if(lang==='ja'){
			if(text.length<6){
				disp.css('font-size',fsize+'px');
			}else if(text.length<8){
				disp.css('font-size',fsize*0.8+'px');
			}else if(text.length<10){
				disp.css('font-size',fsize*0.7+'px');
			}else{
				disp.css('font-size',fsize*0.5+'px');
			}
		}else if(lang==='en'){
			if(text.length<12){
				disp.css('font-size',fsize+'px');
			}else if(text.length<16){
				disp.css('font-size',fsize*0.8+'px');
			}else if(text.length<20){
				disp.css('font-size',fsize*0.7+'px');
			}else{
				disp.css('font-size',fsize*0.5+'px');
			}
		}
	}

	function flash_start(){
		display_flash();
		start.prop('disabled',true);
		interval_id = setInterval(display_flash,interval_time);	
	}

	function data_str_to_array(){
		var datas = data_str.split('\n');
		var tmp = new Array;
	 	var result= new Array;
		for(var i=0;i<datas.length;i++){
			if(datas[i]!==''){
				tmp=datas[i].split("\t");
				result.push(tmp);
			}
		}
		d = result;
	}

	//csvを取得してdata_strに格納する
	function get_data(csv_name){
		var result='';
		$.ajax({
			url:csv_dir_path+'data/tsv/'+ csv_name+'.tsv',
			async:false,
			dataType:'text',
			success:function(data){
				data_str=data;
			}
		});
	}

});

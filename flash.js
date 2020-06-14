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
		$('#flash_card').css({
											'width':'100%',
											'height':'100px',
											'padding':'1px',
											'background-color':'pink'
										});
		//表示エリアの追加
		disp = $('<div>');
		disp.css({
							'width':'100%',
							'margin':'10px auto',
							'background-color':'cyan',
							'height':'50px'
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
		start.css('margin','0 auto');
		start.css('width','100%');
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
		disp.html(d[this_num][0]);
		//遅れて日本語を表示
		setTimeout(function(){
			disp.html(d[this_num][2]);
		},interval_time/2);
		num++;
		if(num>=d.length){
			clearInterval(interval_id);
			start.prop('disabled',false);
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

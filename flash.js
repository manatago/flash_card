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
	var reset;
	var num = 0;
	var interval_id;
	var disp;
	var timeout_id;
	var interval_time=4000;
	if($('#flash_card').attr('interval')){
		interval_time=Number($('#flash_card').attr('interval'));
	}
	var fsize=60;
	if($('#flash_card').attr('fsize')){
		fsize=Number($('#flash_card').attr('fsize'));
		//console.log(fsize);
	}
	//指定ファイルを読み込む
	get_data(file_name);
	//TSVファイルを配列に変換
	data_str_to_array();
	//audioを描画
	put_audios();
	//STYLEを指定
	flash_card_style();
	//実行中かどうかのフラグ
	var start_flag = false;

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
											'width':'100%',
											'padding':'0',
											'margin':'0 auto'
										});
		//表示エリアの追加
		disp = $('<div>');
		disp.css({
							'width':'100%',
							'margin':'0 auto',
							'padding':'15px',
							'min-height':'192px',
							'font-size':fsize+'px',
							'border':'solid 2px #cccccc',
							'position':'relative'
		});
		//disp.on('click',function(){
		//	clearInterval(interval_id);
		//	start.prop('disabled',false);
		//});
		$('#flash_card').append(disp);
		$('#flash_card').css('padding','10 20px');

		add_start();
		add_reset();
	}


	function add_reset(){
		//ボタンの追加
		reset = $('<button>');
		reset.html('リセット');
		reset.css('display','block');
		reset.css('margin-left','auto');
		reset.css('width','50%');
		reset.css('border-radius','20px');
		$('#flash_card').append(reset);
		reset.on('click',function(){
				start_flag=false;
				clearInterval(interval_id);
				num=0;
				start.html('再生');
				disp.html('');
		});
	}

	function add_start(){
		//ボタンの追加
		start = $('<button>');
		start.html('再生');
		start.css('display','block');
		start.css('margin-left','auto');
		start.css('width','50%');
		start.css('margin-top','30px');
		start.css('margin-bottom','30px');
		start.css('border-radius','20px');
		$('#flash_card').append(start);
		start.on('click',function(){
				if(start_flag===false){
					flash_start();
				}else{
					console.log('stop');
					console.log(timeout_id);
					console.log(clearTimeout(timeout_id));
					//clearInterval(interval_id);
					start.html('再生');
					start_flag=false;
				}
		});
	}

/*
	function display_flash(){
		var this_num=num;
		//音声再生
		var audio = $('audio').get(this_num);
		audio.play();
		//英語を表示
		resize_font(d[this_num][0],'en');
		var st='position:absolute;bottom:0';
		disp.html("<div style='"+st+"'>"+d[this_num][0]+"</div>");
		//遅れて日本語を表示
		setTimeout(function(){
			if(start_flag===true){
				disp.html("<div style='"+st+"'>"+d[this_num][2]+"</div>");
			}
			resize_font(d[this_num][2],'ja');
		},interval_time/2);
		num++;
		if(num>=d.length){
			clearInterval(interval_id);
			num=0;
			start.prop('disabled',false);
		}	
	}
*/

	//フォントのリサイズ
	function resize_font(text,lang){
		var r = 6;
		var e=1;
		var w=$(window).width();
		if(w<500){
			r =r *1;
		}else if(w<1000){
			r=r*1.5;
		}else{
			r=r*1.7;
		}

		if(lang==='ja'){
			if(text.length<6){
				disp.css('font-size',fsize/r+'vw');
			}else if(text.length<8){
				disp.css('font-size',fsize*0.9/r+'vw');
			}else if(text.length<10){
				disp.css('font-size',fsize*0.8/r+'vw');
			}else{
				disp.css('font-size',fsize*0.7/r+'vw');
			}
		}else if(lang==='en'){
			if(text.length<12){
				disp.css('font-size',fsize/(r/e)+'vw');
			}else if(text.length<16){
				disp.css('font-size',fsize*0.9/(r/e)+'vw');
			}else if(text.length<20){
				disp.css('font-size',fsize*0.8/(r/e)+'vw');
			}else{
				disp.css('font-size',fsize*0.7/(r/e)+'vw');
			}
		}
	}

	function flash_start(){
		start.html('停止');
		start_flag=true;
		//display_flash();
		//interval_id = setInterval(display_flash,interval_time);	
		flash_message();
	}

	function flash_message(){
		//console.log(timeout_id);
		var this_num = num;
		var audio = $('audio').get(this_num);
		write_english(this_num);
		audio.play();
		$('audio').on('ended',function(){
			timeout_id=setTimeout(function(){
				write_japanese(this_num);
				num++;
				clearTimeout(timeout_id);
				console.log('aaa');
				timeout_id=setTimeout(function(){
					flash_message();
				},interval_time);
			},interval_time);
		});
	}

	//日本語を表示する
	function write_japanese(number){
		var st='position:absolute;bottom:0';
		disp.html("<div style='"+st+"'>"+d[number][2]+"</div>");
	}
	//英語を表示する
	function write_english(number){
		var st='position:absolute;bottom:0';
		disp.html("<div style='"+st+"'>"+d[number][0]+"</div>");
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

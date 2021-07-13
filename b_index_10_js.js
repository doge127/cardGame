var prop_is_master = true,prop_appsuma_id,prop_appsumt_id;

console.log('changing');
// 新修
var last_total_fen = 0;

var first_play = false;

//混乱数组
var randomArr = new Set();

// 关卡牌数目
var prop_size = 12;

// 卡对比
var compare_card = [],compareSwitch = 0;

// 倒计时區域
var prop_start_time = 5,prop_game_time = GAME_TIME,prop_game_timer;


// 分數
var prop_mark = 80;

// 關卡
var prop_rank = 1;

// 游戏次数
var prop_left_game_count = 0,myselfHelp = 0;

// 每一关卡牌大小不一样

// 卡牌列表1(暂定)
var cardList1 = [
	'panda1',
	'panda1',
	'panda1',
	'panda1',
	'panda2',
	'panda2',
	'panda2',
	'panda2',
	'panda3',
	'panda3',
	'nangua',
	'nangua'
];

var cardList2 = [
	'panda1',
	'panda1',
	'panda1',
	'panda1',
	'ghost',
	'panda2',
	'panda2',
	'panda2',
	'panda2',
	'bat',
	'bat',
	'nangua',
	'nangua',
	'ghost',
	'ghost',
	'ghost',
];

var cardList3 = [
	'panda1',
	'panda1',
	'panda1',
	'panda1',
	'panda2',
	'panda2',
	'panda3',
	'panda3',
	'panda3',
	'panda3',
	'ghost',
	'ghost',
	'zombine2',
	'zombine2',
	'boner',
	'boner',
	'witcher',
	'witcher',
	'nangua',
	'nangua',
];

var cardList4 = [
	'panda1',
	'panda1',
	'panda1',
	'panda1',
	'panda2',
	'panda2',
	'panda3',
	'panda3',
	'panda3',
	'panda3',
	'witcher',
	'witcher',
	'bat',
	'bat',
	'nangua',
	'nangua',
	'boner',
	'boner',
	'zombine',
	'zombine',
	'ghost',
	'ghost',
	'zombine2',
	'zombine2',
];

// console.log(cardList3.length,cardList4.length)


var card_data = [cardList1,cardList2,cardList3,cardList4];

var cardArr = [];

let game = {};

game.gameStart = function(){
    $('.guide_area').show();
}

game.gameOver = function(){
	// 洛丹伦
	finishGame();
	clearInterval(prop_game_timer);
}

game.gamePlayAgain = function(){
	initGame()
}

// card_area清空
// 时间重置
// 分数归零
// initGame();

function initGame(){
	$('.card_area').empty();
	prop_game_time = GAME_TIME;
	prop_mark = 0;
	prop_rank = 1;
	compare_card = [];
	// 重置卡组
	prop_size = 12;
	randomArr = new Set();
	createRandomArr(prop_size);
	// 卡组匹配
	matchingString(card_data[0]);
	$('#score').text(prop_mark);
	$('#second').text(prop_game_time);
	game_time();
}

//audio为变量(给audio标签创个id再赋值给audio即可)
//iphone兼容
document.addEventListener("WeixinJSBridgeReady", function () {
    //音频播放
	document.getElementById('audio').play();
}, false);

var audio = document.getElementById('audio');

$(".music").click(function() {
	if ($(".music").hasClass("m_active")) {
		$(".music").removeClass("m_active");
		audio.pause();
		$(".music_bg").hide();
		isplay = false;
	} else {
		$(".music").addClass("m_active");
		audio.play();
		$(".music_bg").show();
		isplay = true;
	}
});

$(function(){
	//html代码
	
	// .gameTime{background:url(img/time_bg.png) no-repeat 0 0/100% 100%}
    let styleHtml = `
        <style>
            .game_page{background:url(img/game_bg.jpg) no-repeat 0 0/100% 100%}
            .guide_area{background:url(img/guide_bg.png) no-repeat 0 0/100% 100%}
            .start_time{background:url(img/start_clock.png) no-repeat 0 0/100% 100%}
            .addMark{background:url(img/addMark_bg.png) no-repeat 0 0/100% 100%}
            .deviceMark{background:url(img/deviceMark_bg.png) no-repeat 0 0/100% 100%}
        </style>
    `;

    $('head').append(styleHtml);

    //html代码

    // 賦值分數
    // $('.mark span').text(prop_mark);
    $('#score').text(prop_mark)
    // $('.gameTime span').text(prop_game_time);

    $('#second').text(prop_game_time)
    
    // 混乱数生成
    createRandomArr(prop_size);
    
    // 卡组匹配
    matchingString(card_data[0]);
    
    $('.guide_area .btn_close').click(function(){
        $('.guide_area').hide();
        game_time();
		// start_time(prop_start_time);
    });
    


});

// n个不循环的混乱数
function createRandomArr(size){
	var singleRandNum = parseInt(Math.random() * size + 1);
	randomArr.add(singleRandNum);

	if(randomArr.size < size){
		createRandomArr(size)
	}
}

// 匹配卡组
function matchingString(card){

	cardArr = [];
	for(let item of randomArr.values()){
		// console.log(item)
		cardArr.push(card[item - 1]);
	}

	// console.log(...cardArr);

	domCreate();
}

// 显示
function domCreate(){
	var card_html = ``;

	for(var i = 0 ; i < cardArr.length; i++){
		var val = cardArr[i];
		card_html += `
			<div class="card" card-key="${val}">
				<img src="img/card_bg.png" alt="" class="zheng_card flipInY">
				<img src="img/${val}.png" alt="" class="fan_card flipOutY"  style="display:none;">
			</div>
		`
	}
	
	$('.card_area').append(card_html);

	$(".card").on('click',function(){

		if($(this).hasClass('sel')){
        	
        }else{
			compare_card.push($(this));
        }
		
		// 动效
        if( $(this).find('.zheng_card').hasClass('flipInY') ){
            paiAni($(this),'open');
            $(this).addClass('sel');
        }

        // else{
        //     paiAni($(this),'close');
        //     $(this).removeClass('sel');
        // }

        if(compare_card.length == 2){
        	cardCompare(compare_card);
        	compare_card = [];
        }

		// console.log(compare_card);

		// if(compareSwitch <= 2){			

		// 	compareSwitch = 0;
		// }

		// compareSwitch++;

	});

}

// 对比俩卡
var cardCompare = arr => {

	// console.log(arr[0].attr('card-key'),arr[1].attr('card-key'));

	if(arr[0].attr('card-key') == arr[1].attr('card-key')){
		$('.addMark').fadeIn();

		// 正确
		setTimeout(()=>{
			arr[0].css('opacity',0);
			arr[1].css('opacity',0);
		}, 500);

		setTimeout(() => {
			$('.addMark').hide();
		}, 800);

		prop_mark = prop_mark + ADD_FUN;
		prop_game_time = prop_game_time + ADD_TIME;
		// return true;
		
		// 通關的下一關
		setTimeout(() => {
			rankCheck();
		}, 500);
		
	}else{
		$('.deviceMark').fadeIn();
		// 错误
		setTimeout(()=>{
			paiAni(arr[0],'close');
			paiAni(arr[1],'close');

			$(arr[0]).removeClass('sel');
			$(arr[1]).removeClass('sel');
		}, 500);

		setTimeout(() => {
			$('.deviceMark').hide();
		}, 800);

		// return false;
		prop_mark = prop_mark - LESS_FUN;
		prop_mark = prop_mark < 0 ? 0 : prop_mark;

		if(prop_game_time <= 0 ){
			// 游戏结束
			finishGame();
		}else{
			prop_game_time = prop_game_time - LESS_TIME;
		}

	}


    // $('.gameTime span').text(prop_game_time);
    $('#second').text(prop_game_time);
    // $('.mark span').text(prop_mark);
    $('#score').text(prop_mark)
}

// 卡动效集成
function paiAni(obj,statue){
	// open  close
	if(statue == 'open'){
		obj.find('.zheng_card').removeClass('flipInY').addClass('flipOutY').hide();
        obj.find('.fan_card').removeClass('flipOutY').show().addClass('flipInY');
	}else{
		obj.find('.zheng_card').removeClass('flipOutY').show().addClass('flipInY');
        obj.find('.fan_card').removeClass('flipInY').addClass('flipOutY').hide();
	}
}

// 开始倒计时
function start_time(time){
	clearInterval(prop_game_timer);
	$('.start_time_area').show();
	paiAni($('.card'),'open');

	var start_timer = setInterval(()=>{
		time--;
		$('.start_time').text(time);
		console.log('执行');
		if(time <= 0){
			paiAni($('.card'),'close');
			$('.start_time_area').hide();
			game_time();
			clearInterval(start_timer);
		}
	}, 1000);

}

// 遊戲倒計時
function game_time(){
	prop_game_timer = setInterval(() => {
		prop_game_time <= 0 ? 0 : prop_game_time--;
		console.log(prop_game_time);
        // $('.gameTime span').text(prop_game_time);
        $('#second').text(prop_game_time);
		if(prop_game_time <= 0){
			game.gameOver();
		}
	},1000);
}

// 關卡切換
function rankCheck(){
	console.log($('.sel').length);
	if($('.sel').length == prop_size){
		//	關卡記錄
		prop_rank++;

		if(prop_rank <= 4){

			prop_size = 12 + (prop_rank - 1) * 4;

			console.log('prop_size',prop_size);

			// 混乱数生成
			createRandomArr(prop_size);

			// 清空卡牌
			$('.card_area').empty();


			// 卡组匹配
			matchingString(card_data[prop_rank - 1]);

			// 重置記憶時間
			// prop_start_time = 5;
			// $('.start_time').text(prop_start_time);
			// start_time(prop_start_time);

			if(prop_rank == 2){
				$('.card_area').css('margin','3.5rem auto 0');
			}

			if(prop_rank == 3){
				$('.card_area').css('margin','4rem auto 0');
				// $('.card,.card_blank').css({'width':'3.025rem','height':'5.075rem'})
				$('.card,.card_blank').css({'width':'4.025rem','height':'6.075rem'})
			}

			if(prop_rank == 4){
				$('.card_area').css('margin','3.5rem auto 0');
				$('.card').eq(11).after('<div class="card_blank"></div>');
				// $('.card,.card_blank').css({'width':'3.025rem','height':'5.075rem'})
				$('.card,.card_blank').css({'width':'4.025rem','height':'6.075rem'})
			}
		
		}else{
			game.gameOver();
			// console.log('通關了你這憨憨');
		}

	}

}

// 遊戲結束
function finishGame(){
	clearInterval(prop_game_timer);
	prop_game_timer = 0;
	$('#second').text(prop_game_timer)
	// 结果信息代入(记录分数)
	alert('游戏结束,感谢参与')
	// func_set_game_fun(prop_mark)

	// 查询排名
	// func_get_myRank();
}

//获取地址参数
/**
 * @return {string}
 */
function GetQueryString(name) {
    var reg = new RegExp("&?" + name + "(?:=|:)([^\$&,]*)",'gi');
    // console.log(reg)
    // console.log(decodeURIComponent(window.location.search.substr(1)))
    var id = '' ;
    decodeURIComponent(window.location.search.substr(1)).replace(reg,function($1,$2){
        // console.log(arguments)
        // console.log($2)
        id =$2;
    });
    // console.log(id)
    return id;
}



$(function () {

	// prop_appsumt_id = GetQueryString('appsumt_id');
    // prop_appsuma_id = GetQueryString('master_id');

    // func_get_config();

 

	

	

	

	


    

})


// $(function(){
// 	// $('.result_area .btn_close').click(function(){
// 	// 	$('.result_area').hide();
// 	// });
// });








// 后台接口
// function func_get_config() {
//     var url = 'zz_api__bapi__act_get_config';

//     $.ajax({
//         dataType: "json",
//         url: url,
//         data: {},
//         //////////////////////////////////////////////////
//         success: function success(data, textStatus, jqXHR) {
//             setTimeout(function () {
//                 func_get_config__success(data, textStatus, jqXHR);
//             }, 100);
//         },
//         //////////////////////////////////////////////////
//         error: function error(data, textStatus, jqXHR) {
//             alert("系统繁忙，请稍后再试");
//         }
//     });
// }

// function func_get_config__success(data, textStatus, jqXHR){
// 	if(data.errcode == 0){
		
// 		console.log(data);
// 		console.log(window.location.search);
// 		if(data.act_status == '已结束'){
// 			// alert('活動已結束');
// 			$('.act_end_area').show();
// 			// return false;
// 		}else{


// 			if (data.master == '' || data.master.wxuser_openid == data.wx_user.wxuser_openid) {
// 				console.log('是主人');
// 				// get_last
// 				func_get_last()
// 			}else{
// 				console.log('是好友');
// 				// func_help;
// 				prop_is_master = false;
// 				func_help();

// 			}
// 		}

// 	}else if (data.errcode == -233) {
//         window.location.href = data.url;
//     } else {
//         alert(data.errcode,data.errmsg);
//     }
// }

// // get_last
// // zz_api__bapi__launch_get_last
// function func_get_last() {
//     var url = 'zz_api__bapi__launch_get_last';

//     $.ajax({
//         dataType: "json",
//         url: url,
//         data: {},
//         //////////////////////////////////////////////////
//         success: function success(data, textStatus, jqXHR) {
//             setTimeout(function () {
//                 func_get_last__success(data, textStatus, jqXHR);
//             }, 100);
//         },
//         //////////////////////////////////////////////////
//         error: function error(data, textStatus, jqXHR) {
//             alert("系统繁忙，请稍后再试");
//         }
//     });
// }

// function func_get_last__success(data, textStatus, jqXHR){
// 	if(data.errcode == 0){
// 		console.log(data);
// 		prop_appsuma_id = data.master.appsuma_id;
//         prop_appsumt_id = data.master_task.appsumt_id;

//         if(data.master_is_help){
//     		// 获取游戏次数
//     		func_get_gameCount();
//         }

//         if(prop_is_master && !data.master_is_help){
//         	func_help();
//         }

//         // 分享按钮
//         $('#btn_share').click(function(){
//             // window.location.href = 'a__item_file__s_index';
//             console.log('a__wx_share_re?page=' + encodeURIComponent('a__item_file__s_index?master_id:' + prop_appsuma_id + ',appsumt_id:' + prop_appsumt_id));
//             window.location.href = 'a__wx_share_re?page=' + encodeURIComponent('a__item_file__s_index?master_id:' + prop_appsuma_id + ',appsumt_id:' + prop_appsumt_id);
//             // window.location.href = 'a__item_file__s_index?master_id:' + prop_appsuma_id + ',appsumt_id:' + prop_appsumt_id;
//         });

//     	$('.btn_again').click(function(){
			
// 			// 
// 			var res_count = prop_left_game_count - 1;
// 			if(prop_left_game_count == 0){
// 				$('#toast').toast('你已经没有游戏机会了,邀请好友一起搞“鬼”可获得游戏机会哦',2000);
// 			}else{
// 				window.location.reload();
// 			}
// 		});

// 	}else{
// 		if(data.errcode == -100){
// 			func_launch();
// 		}else{
// 			console.log(data.errcode,data.errmsg);
// 		}
// 	}
// }

// // func_launch
// // zz_api__bapi__launch
// function func_launch() {
//     var url = 'zz_api__bapi__launch';

//     $.ajax({
//         dataType: "json",
//         url: url,
//         data: {
//         	master_help:'autoHelp'
//         },
//         //////////////////////////////////////////////////
//         success: function success(data, textStatus, jqXHR) {
//             setTimeout(function () {
//                 func_launch__success(data, textStatus, jqXHR);
//             }, 100);
//         },
//         //////////////////////////////////////////////////
//         error: function error(data, textStatus, jqXHR) {
//             alert("系统繁忙，请稍后再试");
//         }
//     });
// }

// function func_launch__success(data, textStatus, jqXHR){
// 	if(data.errcode == 0){
// 		func_get_last();
// 	}else{
// 		console.log(data.errcode,data.errmsg);
// 	}
// }



// //好友助力 
// // zz_api__bapi__help
// function func_help() {
//     var url = 'zz_api__bapi__help';

//     $.ajax({
//         dataType: "json",
//         url: url,
//         data: {
//         	master_id:prop_appsuma_id
//         },
//         //////////////////////////////////////////////////
//         success: function success(data, textStatus, jqXHR) {
//             setTimeout(function () {
//                 func_help__success(data, textStatus, jqXHR);
//             }, 100);
//         },
//         //////////////////////////////////////////////////
//         error: function error(data, textStatus, jqXHR) {
//             alert("系统繁忙，请稍后再试");
//         }
//     });
// }

// function func_help__success(data, textStatus, jqXHR){
// 	if(data.errcode == 0){
// 		console.log(data);

// 		if(prop_is_master){
// 			myselfHelp++;
// 			if(myselfHelp < 3){
// 				func_help();
// 			}else{
// 				func_get_gameCount();
// 			}
// 		}else{
// 			prop_is_master = true;
// 			func_get_last();
// 		}

// 	}else{
// 		console.log(data.errcode,data.errmsg);
// 		if(!prop_is_master){
// 			func_get_last();
// 		}
// 	}
// }

// // console.log(new Date().getTime());

// // 记录分数
// // zz_api__bapi__data_set_game_fun
// function func_set_mark() {
//     var url = 'zz_api__bapi__data_set_game_fun';

//     $.ajax({
//         dataType: "json",
//         url: url,
//         data: {
//         	fun:last_total_fen,
//         	pid:new Date().getTime()
//         },
//         //////////////////////////////////////////////////
//         success: function success(data, textStatus, jqXHR) {
//             setTimeout(function () {
//                 func_set_mark__success(data, textStatus, jqXHR);
//             }, 100);
//         },
//         //////////////////////////////////////////////////
//         error: function error(data, textStatus, jqXHR) {
//             alert("系统繁忙，请稍后再试");
//         }
//     });
// }

// function func_set_mark__success(data, textStatus, jqXHR){
// 	if(data.errcode == 0){
// 		console.log(data);

// 		if(first_play){
// 			func_get_myRank();
// 		}

// 		// 新修
// 		// func_get_myRank();

// 	}else{
// 		console.log(data.errcode,data.errmsg);
// 	}
// }



// // 查询自己排名
// // zz_api__bapi__data_get_ranking
// function func_get_myRank() {
//     var url = 'zz_api__bapi__data_get_ranking';

//     $.ajax({
//         dataType: "json",
//         url: url,
//         data: {},
//         //////////////////////////////////////////////////
//         success: function success(data, textStatus, jqXHR) {
//             setTimeout(function () {
//                 func_get_myRank__success(data, textStatus, jqXHR);
//             }, 100);
//         },
//         //////////////////////////////////////////////////
//         error: function error(data, textStatus, jqXHR) {
//             alert("系统繁忙，请稍后再试");
//         }
//     });
// }

// function func_get_myRank__success(data, textStatus, jqXHR){
// 	if(data.errcode == 0){
// 		console.log(data);
// 		var {appsud_int_00} = data.data;
// 		$('.nowMark span').text(prop_mark);
// 		$('.mas_rank span').text(data.count);

// 		if(appsud_int_00 > prop_mark){
// 			$('.maxMark span').text(appsud_int_00);
// 		}else{
// 			$('.maxMark span').text(prop_mark);
// 		}


// 		if(data.count == -1){
// 			last_total_fen = prop_mark;
// 			first_play = true;
// 			func_set_mark();
// 		}else{
// 			// 不是第一次
// 			if(!first_play){
// 				// 洛丹伦
// 				last_total_fen = appsud_int_00 + prop_mark;
// 				if(prop_left_game_count > 0){
// 					// 调整
// 					func_set_mark();
// 				}
// 			}
			
// 		}

// 		if(appsud_int_00 <= 0){
			
// 		}


		

// 		$('.result_area').show();

// 	}else{		
// 		console.log(data.errcode,data.errmsg);
// 	}
// }



// // 游戏次数
// // zz_api__bapi__data_game_count
// function func_get_gameCount() {
//     var url = 'zz_api__bapi__data_game_get_game_left_count';

//     $.ajax({
//         dataType: "json",
//         url: url,
//         data: {},
//         //////////////////////////////////////////////////
//         success: function success(data, textStatus, jqXHR) {
//             setTimeout(function () {
//                 func_get_gameCount__success(data, textStatus, jqXHR);
//             }, 100);
//         },
//         //////////////////////////////////////////////////
//         error: function error(data, textStatus, jqXHR) {
//             alert("系统繁忙，请稍后再试");
//         }
//     });
// }

// function func_get_gameCount__success(data, textStatus, jqXHR){
// 	if(data.errcode == 0){
// 		console.log(data);
// 		prop_left_game_count = data.left;

// 		if(prop_left_game_count == 0){
// 			$('.guide_area').hide();
// 			$('.result_area').show();
// 			$('.nowMark').css('opacity','0');
// 			func_get_myRank();
// 			$('.left_game_count span').text(prop_left_game_count);
// 		}else{
// 			$('.left_game_count span').text(prop_left_game_count - 1);
// 		}

// 	}else{
// 		func_get_myRank();
// 		console.log(data.errcode,data.errmsg);
// 	}
// }


// toast
$(function(){
    ;(function($) {
        var style="<style>#toast{position: fixed;top: 0;left: 0;right: 0;bottom: 0;display: flex;display: -webkit-flex;justify-content:center;align-items: center;z-index:9999;}.toast_cont{padding:.5rem 1rem;border-radius: 5px;max-width:10rem;color: white;text-align: center;font-size: 0.7rem;background: rgba(0,0,0,0.9);}</style>";
        var html = '<div id="toast" style="display:none;"><div class="toast_cont"></div></div>';
        $('body').append(html);
        $('head').append(style);
        $.fn.toast = function(content,time) {
            var t = $(this);
            t.find(".toast_cont").html(content);
            t.fadeIn();
            
            setTimeout(function(){
                t.fadeOut();
            },time)
        }       
    })($);
    
});


// 预加载
(function () {

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
    }
    var loader = function (imgList, callback, timeout) {
        timeout = timeout || 5000;
        imgList = isArray(imgList) && imgList || [];
        callback = typeof(callback) === 'function' && callback;

        var total = imgList.length,
            loaded = 0,
            imgages = [],
            _on = function () {
                loaded < total && (++loaded, callback && callback(loaded / total));
            };

        if (!total) {
            return callback && callback(1);
        }

        for (var i = 0; i < total; i++) {
            imgages[i] = new Image();
            imgages[i].onload = imgages[i].onerror = _on;
            imgages[i].src = imgList[i];
        }

        /**
         * 如果timeout * total时间范围内，仍有图片未加载出来（判断条件是loaded < total），通知外部环境所有图片均已加载
         * 目的是避免用户等待时间过长
         */
        setTimeout(function () {
            loaded < total && (loaded = total, callback && callback(loaded / total));
        }, timeout * total);

    };
	
	    "function" === typeof define && define.cmd ? define(function () {
	        return loader
    }) : window.imgLoader = loader;
})();
		// 预加载的背景图片链接
		var images=[
            "img/game_bg.jpg",
            "img/guide_bg.png",
            "img/start_clock.png",
            // "img/time_bg.png",
            "img/addMark_bg.png",
            "img/deviceMark_bg.png",
            "img/bat.png",
            "img/boner.png",
            "img/ghost.png",
            "img/panda1.png",
            "img/panda2.png",
            "img/panda3.png",
            "img/witcher.png",
            "img/zombine.png",
            "img/zombine2.png",
		];
		//获取页面中的所有img
		 var imgs = document.images;
		 for (var i = 0; i < imgs.length; i++) {
		    images.push(imgs[i].src);
		 }
		console.log(images.length);
	   	imgLoader(images, function (percentage) {
	        setTimeout(function(){
	        	var percentT = percentage * 100;
	        	$('.load-num').html('即将进入...' + (parseInt(percentT)) + '%');
	        	if (percentage == 1) {
		        	setTimeout(function(){
		           		 $('#page-ft').hide();
		           		 $('.guide_area').show();
		        	},500);
		        }
	        },200)
	    });



    
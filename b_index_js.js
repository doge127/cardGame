console.log('b_index_js')

func_init_rem();

var prop_appsumt_id = func_get_query('appsumt_id');
var prop_appsuma_id = func_get_query('master_id');

var prop_is_master;  //是否主人
var prop_game_count = 0;  //游戏次数
var prop_chou_count = 0;  //抽奖次数

var game_key = {};  //防刷分


$(function () {

	//$('.container').css('background', `${PROP_BG_COLOR} url({$APP_SUPER_IMG_ROOT}/b_g_bg.jpg) no-repeat left top/100% auto`);

	$('.start_bottom_tips')
		.find('strong')
		.html(PROP_CHOU_FUN);


	// func_get_config(); //页面加载完获取配置


	const bgm = document.getElementById('bgm');
	if (bgm) {
		bgm.src = PROP_BGM;
		$(".music_icon").css("background", `url("{$APP_SUPER_IMG_ROOT}/b_music_icon_off.png") no-repeat center / cover`);
		$('.music_icon').click(function () {
			if ($(this).hasClass('active')) {
				bgm.pause();
				$(this).removeClass('active').css("background", `url("{$APP_SUPER_IMG_ROOT}/b_music_icon_off.png") no-repeat center / cover`);
			} else {
				bgm.play();
				$(this).addClass('active').css("background", `url("{$APP_SUPER_IMG_ROOT}/b_music_icon_on.png") no-repeat center / cover`);;
			}
		});

		if (typeof WeixinJSBridge === 'object') {
			// 苹果支持
			WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
				$('.music_icon').click();
			});
		} else {
			$('.music_icon').click();
		}
	}

});


//获取最后一条发起记录
function func_get_last() {
	var url = func_appsu_url('zz_api__bapi__launch_get_last');
	$.ajax({
		dataType: 'json',
		url: url,
		data: {},
		//////////////////////////////////////////////////
		success: function success(data, textStatus, jqXHR) {
			setTimeout(function () {
				func_get_last__success(data, textStatus, jqXHR);
			}, 100);
		},
		//////////////////////////////////////////////////
		error: function error(data, textStatus, jqXHR) {
			alert('系统繁忙，请稍后再试');
		},
	});
}

function func_get_last__success(data, textStatus, jqXHR) {
	console.log(data);
	console.log(textStatus);
	console.log(jqXHR);

	if (data.errcode == 0) {
		prop_appsuma_id = data.master.appsuma_id;
		prop_appsumt_id = data.master_task.appsumt_id;

		//分享
		$('#btn_share').click(function () {
			location.href = (
				'a__wx_share_re?page=' +
				encodeURIComponent(
					'a__item_file__s_index?master_id:' +
					prop_appsuma_id +
					',appsumt_id:' +
					prop_appsumt_id,
				)
			)
		});

		// 有发起过活动 
		func_get_game_left_count();
		func_get_chou_left_count();

	} else if (data.errcode == -100) {
		// 没有发起记录
		func_launch();
	} else {
		alert(data.errmsg);
	}
}


//发起活动
function func_launch() {
	var url = func_appsu_url('zz_api__bapi__launch');

	$.ajax({
		dataType: 'json',
		url: url,
		data: {
			master_help: PROP_AUTO_HELP,
		},
		success: function success(data, textStatus, jqXHR) {
			setTimeout(function () {
				func_launch__success(data, textStatus, jqXHR);
			}, 100);
		},
		error: function error(data, textStatus, jqXHR) {
			alert('系统繁忙，请稍后再试');
		},
	});
}

function func_launch__success(data, textStatus, jqXHR) {
	console.log(data);
	console.log(textStatus);
	console.log(jqXHR);

	if (data.errcode == 0) {
		//发起过活动 -> 获取最后一条数据
		func_get_last();

	} else if (data.errcode == -30301234) {
		setTimeout(function () {
			func_launch();
		}, g_super_delay);
	}
	else {
		alert(data.errmsg);
	}
}


//
function func_get_game_left_count() {
	var url = func_appsu_url('zz_api__bapi__data_game_get_game_left_count');

	$.ajax({
		dataType: 'json',
		url: url,
		data: {},
		success: function success(data, textStatus, jqXHR) {
			setTimeout(function () {
				func_get_game_left_count_success(data, textStatus, jqXHR);
			}, 100);
		},
		error: function error(data, textStatus, jqXHR) {
			alert('系统繁忙，请稍后再试');
		},
	});
}

function func_get_game_left_count_success(data, textStatus, jqXHR) {
	console.log(data);
	prop_game_count = data.left;
	// left 游戏次数
	$('.has_game_count')
		.find('strong')
		.html(prop_game_count);
	if (prop_game_count > 0) {
		$('#btn_start_game').click(function () {
			if (prop_game_count > 0) {
				//隐藏弹框 开始游戏
				$('.game_front_page').hide();

				if (typeof game != 'undefined') {
					game.gameStart();
				}

				if (typeof cocos_init != 'undefined') {
					cocos_init();
				}

				$(".test_score").css("display", "block")
			}
		});
	} else {
		$('#btn_start_game')
			.addClass('filter')
			.click(function () {
				func_alert_callb(PROP_B_CONFIG.no_game_tips);
			});
	}
}

//
function func_get_chou_left_count() {
	var url = func_appsu_url('zz_api__bapi__chou_left_count');

	$.ajax({
		dataType: 'json',
		url: url,
		data: {
			fun: PROP_CHOU_FUN,
		},
		success: function success(data, textStatus, jqXHR) {
			setTimeout(function () {
				func_get_chou_left_count_success(data, textStatus, jqXHR);
			}, 100);
		},
		error: function error(data, textStatus, jqXHR) {
			alert('系统繁忙，请稍后再试');
		},
	});
}

function func_get_chou_left_count_success(data, textStatus, jqXHR) {
	console.log(data);
	prop_chou_count = data.count > 0 ? data.count : 0;

	$('.has_chou_count')
		.find('strong')
		.html(prop_chou_count);
	if (prop_chou_count > 0) {
		$('#to_chou').click(function () {
			location.href = ('a__item_file__c_index')
		});
	} else {
		$('#to_chou')
			.addClass('filter')
			.click(function () {
				func_alert_callb(PROP_B_CONFIG.no_chou_tips);
			});
	}
}


//记录游戏分数
function func_set_game_fun(fun) {
	var url = func_appsu_url('zz_api__bapi__data_set_game_fun');

	$.ajax({
		dataType: 'json',
		url: url,
		data: {
			fun: fun,
			pid: Date.now(),
			type: 'max'
		},
		success: function success(data, textStatus, jqXHR) {
			setTimeout(function () {
				func_set_game_fun_success(data, textStatus, jqXHR);
			}, 100);
		},
		error: function error(data, textStatus, jqXHR) {
			alert('系统繁忙，请稍后再试');
		},
	});
}

function func_set_game_fun_success(data, textStatus, jqXHR) {
	console.log(data);
	if (data.errcode == 0) {
		let intFen = data.list.appsud_int_00;
		prop_game_count--;
		//游戏次数大于0
		if (prop_game_count > 0) {
			if (PROP_CHOU_FUN <= intFen) {
				//达到分数
				$(".t_over_show").attr('type', 'win');
				$('.t_game_success').show();
				$(".t_game_user_info").css(
					'background',
					'url({$APP_SUPER_IMG_ROOT}/b_index_s_title.png) 0 0/100% 100% no-repeat',
				)
				$('.b_btn_game_finish').removeClass('filter').click(function () {
					location.href = ('a__item_file__c_index')
				});
				prop_chou_count++
			} else {
				$('.t_game_failure').show();
				$(".t_over_show").attr('type', 'fail');
				console.log("挑战失败")
				$(".t_game_user_info").css(
					'background',
					'url({$APP_SUPER_IMG_ROOT}/b_index_b_title.png) 0 0/100% 100% no-repeat',
				)
				$('.t_content3 span').html(prop_game_count);
				if (prop_chou_count <= 0) {
					$('.b_btn_game_finish').addClass('filter').unbind('click')
				}
			}
			//再玩一次
			$('.b_btn_continue').off().click(function () {
				$(
					'.t_game_over,.t_game_failure, .t_game_success,.t_game_invite',
				).hide();

				if (typeof game != 'undefined') {
					game.gamePlayAgain();
				}

				if (typeof cocos_init != 'undefined') {
					cocos_restart();
				}
			});

		} else {
			if (PROP_CHOU_FUN <= intFen) {
				$('.t_game_success').show();
				$(".t_over_show").attr('type', 'win');
				$(".t_game_user_info").css(
					'background',
					'url({$APP_SUPER_IMG_ROOT}/b_index_s_title.png) 0 0/100% 100% no-repeat',
				)
				$('.b_btn_game_finish').removeClass('filter').click(function () {
					location.href = ('a__item_file__c_index')
				});
				$('.b_btn_continue').unbind('click').addClass("filter")
			} else {
				$('.t_game_invite').show();
				$(".t_over_show").attr('type', 'invite');
				$(".t_game_user_info").css(
					'background',
					'url({$APP_SUPER_IMG_ROOT}/b_index_b_title.png) 0 0/100% 100% no-repeat',
				)
			}
		}
		$('.b_btn_share').click(function () {
			location.href = (
				'a__wx_share_re?page=' +
				encodeURIComponent(
					'a__item_file__s_index?master_id:' +
					prop_appsuma_id +
					',appsumt_id:' +
					prop_appsumt_id,
				)
			)
		});
		$('.achieve').html(PROP_CHOU_FUN);
		$('.t_fen').html(intFen);
		console.log("游戏结束+000000000000000000")
		$('.t_game_over').show();
	} else {
		alert(data.errmsg);
	}
}


//获取用户最高分数
function func_get_ranking(fun) {
	var url = func_appsu_url('zz_api__bapi__data_get_ranking');

	$.ajax({
		dataType: 'json',
		url: url,
		data: {},
		success: function success(data, textStatus, jqXHR) {
			setTimeout(function () {
				func_get_ranking_success(data, fun, textStatus, jqXHR);
			}, 100);
		},
		error: function error(data, textStatus, jqXHR) {
			alert('系统繁忙，请稍后再试');
		},
	});
}

function func_get_ranking_success(data, fun, textStatus, jqXHR) {
	console.log(data);
	console.log(fun);
	if (data.errcode == 0) {
		if (data.count != '暂无') {
			$('.best_good').html(
				`最佳成绩为：${
				fun > data.data.appsud_int_00 ? fun : data.data.appsud_int_00
				}分`,
			);
		} else {
			$('.best_good').html(
				`最佳成绩为：${fun}分`,
			);
		}
	} else {
		alert(data.errmsg);
	}
}


//获取应用配置信息
function func_get_config() {
	var url = func_appsu_url('zz_api__bapi__act_get_config');

	$.ajax({
		dataType: 'json',
		url: url,
		data: {},
		success: function success(data, textStatus, jqXHR) {
			setTimeout(function () {
				func_get_config__success(data, textStatus, jqXHR);
			}, 100);
		},
		error: function error(data, textStatus, jqXHR) {
			alert('系统繁忙，请稍后再试');
		},
	});
}

//获取配置 -> 判断游戏时间等 	
function func_get_config__success(data, textStatus, jqXHR) {
	console.log(data);
	console.log(textStatus);
	console.log(jqXHR);
	// shareData = {};
	if (data.errcode == 0) {
		if (data.act_status == '已结束') {
			func_alert_callb('活动已经结束啦\n祝您生活愉快');
			wx.closeWindow();
			return;
		}

		if (typeof cocos_init != 'undefined') {
			window.GlobalConfig_in.avatarUrl = data.wx_user.wxuser_headimgurl;
			window.GlobalConfig_in.avaName = data.wx_user.wxuser_nickName;
		}

		if (!data.is_sub) {
			$('.fix_is_sub').show();
		}
		console.log(
			'$master_id:' + prop_appsuma_id + '$appsumt_id:' + prop_appsumt_id,
		);
		console.log(window.location.search);
		$('.avatar, .tip_user_header, .t_game_user_header').prop(
			'src',
			data.wx_user.wxuser_headimgurl,
		);

		//微信名称等渲染
		$('.tip_user_name, .t_game_user_name').html(data.wx_user.wxuser_nickName);
		if (
			data.master == '' ||
			data.master.wxuser_openid == data.wx_user.wxuser_openid
		) {
			console.log('是主人');
			prop_is_master = true;
			//获取 最后一条数据
			func_get_last();


		} else {
			console.log('是好友');

			func_help(prop_appsuma_id);
		}

	} else if (data.errcode == -233) {
		location.href = (data.url)
	} else {
		alert(data.errmsg);
	}
}


//好友帮忙
function func_help(_master_id) {
	var url = func_appsu_url('zz_api__bapi__help');

	$.ajax({
		dataType: 'json',
		url: url,
		data: {
			master_id: _master_id,
		},
		success: function success(data, textStatus, jqXHR) {
			setTimeout(function () {
				func_help__success(data, textStatus, jqXHR);
			}, 100);
		},
		error: function error(data, textStatus, jqXHR) {
			alert('系统繁忙，请稍后再试');
		},
	});
}

function func_help__success(data, textStatus, jqXHR) {
	console.log(data);
	console.log(textStatus);
	console.log(jqXHR);
	func_get_last();
}


//
function func_insert_game_key() {
	var url = func_appsu_url('zz_api__bapi__launch_insert_game_key');

	$.ajax({
		url: url,
		type: 'get',
		data: {
			game_id: Date.now(),
		},
		success: function success(data) {
			func_insert_game_key_success(data);
		},
		error: function error(data) {
			console.log(data);
		},
	});
}

function func_insert_game_key_success(data) {
	console.log(data);
	if (!data.errcode) {
		game_key.game_date = data.game_date;
		game_key.game_id = data.game_id;
	} else {
		alert('系统繁忙，请稍后再试');
	}
}

;(function (doc, win) {
	console.log('func_init_rem');
	var doc = document;
	var win = window;
	var docEl = doc.documentElement, resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function ()
	{
		var clientWidth = docEl.clientWidth;
		if (!clientWidth) return;
		docEl.style.fontSize = 20 * (clientWidth / 375) + 'px';
		if (window.innerHeight / window.innerWidth > 1.8)
		{
			document.body.className = 'fullScreen'
		} else
		{
			document.body.className = ''
		}
	};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window);

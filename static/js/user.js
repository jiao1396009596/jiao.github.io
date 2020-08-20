/// <reference path="/files/js/jquery.min.js" />
/// <reference path="/files/js/jquery.ui.min.js" />
/// <reference path="../share/common.js" />

//<!--no-cache-->
//
var userID = '';
//

//
var access_control = $.parseJSON('{"vcode_length":"5","vcode_resetps_email":"1","vcode_email_graph":"0","vcode_fontsize":"12","vcode_color1":"#b3d7ff","vcode_sms_graph":"0","vcode_reg_sms":"0","vcode_limit_time":"60","vcode_color2":"#0060ca","vcode_login_graph":"0","verification_login":"0","vcode_reg_graph":"1","vcode_font":"Verdana","verification_ip_reg_limit":"3","vcode_color3":"#d22000","verification_manual":"0","vcode_reg_email":"0","vcode_color0":"#ffffff","vcode_resetps_sms":"0","verification_order":"0"}');
//


var swin = $("#swin"), suwin = $("#suwin");

if (userID != '') {
    //
    $(".intkj").html('<div class="welcome-container welcome-user"><div class="userinfo-container" id="userinfo"><div class="username-container"><span class="link-spacing"></span> <a href="process.aspx?c=go&url=' + escape('?c=userinfo') + '" class="username-text" id="usernameText" target="_blank"><span class="username-text-show text-overflow"></span>' +
    //
    //
					 ' <span id="userId">(ID:)</span></a></div>' +
    //
					 '<div class="user-panel hide" id="userPanel" style="height:261px"><div class="pay-box"><span><span>余额不足了？</span></span> <a href="/idcSystem.aspx?c=finance" target="_blank">充值</a></div><div class="user-panel-body"><ul class="shortcut-menu-list"><li class="shortcut-menu-item"><a class="user-icon-01" href="/idcSystem.aspx?c=myservice" target="_blank">产品管理 <span class="user-record-count" id="serverCount">0</span></a></li><li class="shortcut-menu-item"><a class="user-icon-03" href="/idcSystem.aspx?c=tklist" target="_blank">消息中心 <span class="user-record-count" id="msgCount">0</span></a></li><li class="shortcut-menu-item"><a class="user-icon-04" href="/idcSystem.aspx?c=tklist&submit=yes" target="_blank">提交工单</a></li><li class="shortcut-menu-item"><a class="user-icon-02" href="/idcSystem.aspx?c=ut" target="_blank">帐户升级</a></li></ul>' +
					 '<div class="user-panel-bottom"><span class="auth-status" style="display:inline">已实名认证</span> <a class="new-auth" href="_blankauth/newAuth" target="_blank" style="display:none">实名认证&gt;&gt;</a> <a class="exit-btn pull-right" href="javascript:userLogout(\'\');">退出</a></div></div></div></div></div>' +
                     '');
}

function userLogin(action, rurl) {
    if (rurl == '') rurl = top.location.toString();
    if (rurl.length > 3 && rurl.substring(0, 3) == '?c=') rurl = 'process.aspx?c=go&url=' + escape(rurl);

    if (action == 0) {
        var imgUrl = 'page.aspx?c=imgcode&t=login';
        var str = '<form style="line-height:15px" id="lform" action="process.aspx?c=login">&nbsp;<br />' +
                  '<p><strong>用户名：</strong><input style="width:200px" type="text" name="uname"/></p><br />' +
                  '<p><strong>密　码：</strong><input style="width:200px" type="password" name="ps"/><input name="rurl" type="hidden" value="' + rurl + '" /></p><br />' +
                  '<p id="checkcode"><strong>验证码：</strong><input type="text"  style="width:130px" name="vcode_graph" style="vertical-align:middle;" /> <img style="vertical-align:middle;cursor:pointer;" src="' + imgUrl + '&' + new Date() + '" id="ccImg" alt="" title="双击换一张！"/></p>' +
                  '</form>';
        swin.html(str);
		swin.find("form").submit(function(){userLogin(1, rurl);});
        swin.find("input").keydown(function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                userLogin(1, rurl);
            }
        });
        swin.find("input:first").focus();
        swin.find('#ccImg').dblclick(function () { $(this).attr('src', imgUrl + '&' + new Date()); });
        if (access_control.vcode_login_graph != '1') swin.find('#checkcode').remove();
        swin.dialog({ title: "客户登录", autoOpen: false, resizable: false, width: 368, modal: true, buttons: { "登 录": function () { userLogin(1, rurl); }, "免费注册": function () { userReg(0, rurl); }, "关 闭": function () { $(this).dialog("close"); } } }).dialog("open");
    } else {
        var cform = $("#lform");
        processing('正在登录，请稍候...');
        var delay = 0;
        var cmd = '';
        $.post(cform.attr("action"), cform.serialize(), function (rdata) {
            var rmsg = rdata.split('|');
            if (rmsg[0] == "0") {
                userID = 1;
                rdata = '<div style="display:block;">登录成功！</div>';
                delay = 800;
                if (rurl.length > 4 && rurl.substring(0, 4) == 'cmd:') {
                    setTimeout(rurl.substring(4), 1000);
                    cmd = 'close';
                }
                else cmd = 'top.location = "' + rurl + ' ";';
            } else {
                switch (rmsg[0]) {
                    case "Invalid_username": rdata = "您输入的用户名无效！"; break;
                    case "Invalid_checkCode": rdata = "您输入的验证码错误！"; break;
                    case "Invalid_password": rdata = "您输入的密码无效！"; break;
                    case "IP_blocked": rdata = "您的IP地址已被禁止访问！"; break;
                    case "Invalid_email": rdata = "请输入正确的电子邮箱地址！"; break;
                    case "Account_pending_verification": rdata = "您的帐户需要通过人工审核后才能登录，请耐心等待！如需帮助，请联系客服！"; break;
                    case "Account_suspended": rdata = "您的帐户已被禁用，请与客服联系！"; break;
                }
            }
            showResults(rdata, delay, cmd);
        });
        return false;
    }
}

function userLogout(rurl) {
    if (rurl == '') rurl = top.location.toString();
    if (rurl.length > 3 && rurl.substring(0, 3) == '?c=') rurl = 'process.aspx?c=go&url=' + escape(rurl);
    swin.html('您确定要退出登录吗？');
    swin.dialog({ title: "安全退出", autoOpen: false, resizable: false, width: 368, modal: true, buttons: { "确 定": function () { top.location = 'process.aspx?c=logout&rurl=' + escape(rurl) }, "取 消": function () { $(this).dialog("close"); } } }).dialog("open");
}

function userReg(action, rurl) {
    if (rurl == '') rurl = top.location.toString();
    if (rurl.length > 3 && rurl.substring(0, 3) == '?c=') rurl = 'process.aspx?c=go&url=' + escape(rurl);

    //
    var ufString = '';
    //
    if (ufString == '') ufString = '{}';
    var ufData = $.parseJSON(ufString);

    if (action == 0) {
        var str = '<form style="line-height:15px" action="process.aspx?c=reg" id="rform" onsubmit="return userReg(1,\'' + rurl + '\')" method="post">&nbsp;<br />' +
                  '<p><strong style="width:108px;">用户名称：</strong><input type="text" name="uname"/>*</p><br />' +
                  '<p><strong style="width:108px;">输入密码：</strong><input type="password" name="ps"/>*</p><br />' +
                  '<p><strong style="width:108px;">输入密码：</strong><input type="password" name="ps1"/>*</p><br />' +
                  '<p id="reg_email"><strong style="width:108px;">电子邮箱：</strong><input type="text" name="email"/>*</p><br />' +
				  '<p id="reg_mobile"><strong style="width:108px;">手机号码：</strong><input type="text" name="tel"/>*</p><br />' +
                  '<p><strong style="width:108px;">QQ&nbsp;号码：</strong><input type="text" name="QQ"/></p><br />' +
                  '<p><strong style="width:108px;">推介人id：</strong><input value="" name="referral" type="text" /></p><br />' +
                  '</form>';
        swin.html(str);
        swin.find("input").css({ "width": "260px" });
        swin.find("input:first").focus();
        swin.find("input").keydown(function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                userReg(1, rurl);
            }
        });

        if (access_control.vcode_reg_email == '1') {
            $('<br /><p><strong style="width:108px;">邮箱验证：</strong><input name="vcode_email" type="text" style="width:135px;" /> <input id="btn_emailvcode" type="button" value="发送邮件验证码" /></p>').insertAfter(swin.find("#reg_email"));
            swin.find("#btn_emailvcode").css({ "height": "auto", "line-height": "normal", "font-size": "13px" }).button().click(function () {
                sendVerificationCode('email', 'reg', 'email=' + swin.find("input[name='email']").val(), $(this));
            });
        }
        if (access_control.vcode_reg_sms == '1') {
            $('<br /><p><strong style="width:108px;">手机验证：</strong><input name="vcode_sms" type="text" style="width:135px;" /> <input id="btn_smsvcode" type="button" value="发送短信验证码" class="button_sandybrown" /></p>').insertAfter(swin.find("#reg_mobile"));
            swin.find("#btn_smsvcode").css({ "height": "auto", "line-height": "normal", "font-size": "13px" }).button().click(function () {
                sendVerificationCode('sms', 'reg', 'mobile=' + swin.find("input[name='tel']").val(), $(this));
            });
        }

        var efkID;
        $.each(ufData, function (key, value) {
            if (key.indexOf('label_') > -1 && value != '') {
                efkID = key.substring(6);
                swin.find("#rform").append('<p id="checkcode"><strong style="width:108px;">' + value + '：</strong><input style="width:260px" type="text" title="' + (ufData['readonly_' + efkID] == '1' ? '该信息注册后不能修改，恳请您认真核实是否正确！' : '') + '" name="extfield' + efkID + '"/>' + (ufData['required_' + efkID] == '1' ? '*' : '') + '</p><br />');
            }
        });


        if (access_control.vcode_reg_graph == '1') {
            var imgUrl = '/page.aspx?c=imgcode&t=reg';
            swin.find("#rform").append('<p id="checkcode"><strong style="width:108px;">　验证码：</strong><input type="text"  style="width:130px" name="vcode_graph" style="vertical-align:middle;" /> <img style="vertical-align:middle;cursor:pointer;" src="' + imgUrl + '&' + new Date() + '" id="ccImg" alt="" title="双击换一张！"/></p>');
            swin.find('#ccImg').click(function () { $(this).attr('src', imgUrl + '&' + new Date()); });
        }

        swin.find("form").tooltip({
            track: true,
            show: {
                effect: "slideDown",
                delay: 100
            },
            content: function () {
                return $(this).attr("title");
            }
        });


       
        swin.dialog({ title: "用户注册", autoOpen: false, resizable: false, width: 500, modal: true, buttons: { "提交注册": function () { userReg(1, rurl); }, "登 录": function () { userLogin(0, rurl); }, "关 闭": function () { $(this).dialog("close"); } } }).dialog("open");
    } else {
        var cform = $("#rform");
        processing('正在提交注册请求，请稍候...');
        var delay = 0;
        var cmd = '';
        $.post(cform.attr("action"), cform.serialize(), function (rdata) {
            var rmsg = rdata.split('|');
            if (rmsg[0] == "0") {
                rdata = '恭喜您已经成功注册！<br />请牢记您的用户名：<strong>' + rmsg[1] + '</strong>，密码：<strong>' + rmsg[2] + '</strong>';
                delay = 2900;
                if (rurl.length > 4 && rurl.substring(0, 4) == 'cmd:') {
                    setTimeout(rurl.substring(4), 3000);
                    cmd = 'close';
                }
                else if (rurl != '') cmd = 'top.location = "' + rurl + ' ";';
            } else {
                switch (rmsg[0]) {
                    case "Invalid_username": rdata = "用户名只能由5~30位的字母及数字组成！"; break;
                    case "Invalid_graph_vCode": rdata = "您输入的图形验证码错误！"; break;
                    case "Invalid_email_vCode": rdata = "请输入正确的邮件验证码！"; break;
                    case "Invalid_sms_vCode": rdata = "请输入正确的短信验证码！"; break;
                    case "Invalid_password_length": rdata = "密码长度不能小于6位！"; break;
                    case "Password_does_not_match": rdata = "两次输入的新密码不相同！"; break;
                    case "Invalid_email": rdata = "请输入正确的电子邮箱地址！"; break;
                    case "Username_exists": rdata = "您输入的用户名称已经存在，请更换其它名称重试！"; break;
                    case "Email_exists": rdata = "您输入的邮箱地址已经存在，请更换其它邮箱重试！"; break;
                    case "Phone_number_exists": rdata = "您输入的手机号码已被使用，请更换其它号码重试！"; break;
                    case "IP_blocked": rdata = "您的IP地址已被禁止访问！"; break;
                    case "IP_reg_limit": rdata = "您当前IP地址今天的注册次数已超系统限制！"; break;
                    case "Username_containing_banned_words": rdata = "您输入的用户名含有禁用词语，请重新选择！"; break;

                }
                if (rmsg[0].indexOf('Can not be empty') > -1) {
                    rdata = '[' + ufData['label_' + rmsg[0].substring(0, rmsg[0].indexOf('.'))] + ']不能为空！';
                }
            }
            showResults(rdata, delay, cmd);
        });
        return false;
    }
}


function payOnline(action,amount) {
    if (action == 0) {
        suwin.dialog({ title: "在线充值", autoOpen: false, resizable: false, width: 500, height: 308, modal: true, buttons: { "充 值": function () { payOnline(1, amount); }, "取 消": function () { $(this).dialog("destroy"); } } }).dialog("open");
        suwin.html(ajaxLoading());
        $.getJSON("process.aspx?c=payment&at=select&" + new Date(), function (rdata) {
            if (rdata == null) suwin.html("在线充值已禁用！");
            else {
                var str = '<strong>请选择充值接口：</strong><br /><ul style="line-height:30px; width:430px;">';
                $(rdata).each(function (i) {
                    str += '<li style="float:left; margin-right:28px;"><input type="radio" name="pmid" title="' + rdata[i].cdes + '" value="' + rdata[i].cid + '" class="radio" id="pm' + rdata[i].cid + '"/><label title="' + rdata[i].cdes + '" for="pm' + rdata[i].cid + '">' + rdata[i].sname + '</label></li>';
                });
                str += '</ul><div style="clear:both;padding-top:18px;"><strong>充值金额：</strong><input type="text" name="amount" value="' + amount + '" class="text" size="5"/> 元<br /> <br /><span class="pptext"></span></div>';
                suwin.html(str);
                suwin.find("label").css("cursor", "pointer");
                suwin.find("input:radio").click(function () { suwin.find(".pptext").html(htmlDecode($(this).attr("title"))); });
                suwin.find("input:radio:first").click();
            }
        });
    }
    else if (action == 1) {

        amount = suwin.find("input[name='amount']").val();
        if (isNaN(amount) || parseFloat(amount) < 0.01) alert("充值金额必须为大于0.01的数字");
        else {
            var pmid = suwin.find("input[name='pmid']:checked").val();
            amount = parseFloat(amount).toFixed(2);
            suwin.find(".pptext").text("正在处理，请稍候...");
            $.get("process.aspx?c=payment&&at=url&pmid=" + pmid + "&amount=" + amount + "&" + new Date(), function (rdata) {
                var rmsg = rdata.split('|');
                if (rmsg[0] == '0') {
                    suwin.html('<strong>充值金额：</strong>' + amount + ' 元<br />' +
                               '<strong>充值方式：</strong>' + suwin.find("label[for='pm" + pmid + "']").text() + '<br /> <br />' +
                               '<a href="' + rmsg[2] + '" target="_blank"><img src="/images/btn_paynow.gif" alt="马上充值" /></a>' +
                                '<input type="hidden" value="' + rmsg[1] + '"/>');
                    suwin.dialog({ title: "在线充值确认", autoOpen: false, resizable: false, width: 398, height: 268, modal: true, buttons: { "取 消": function () { $(this).dialog("close"); } } }).dialog("open");
                    suwin.find("img").click(function () {
                        suwin.dialog("option", "buttons", { "确认已完成充值": function () { payOnline(2, amount); }, "关 闭": function () { $(this).dialog("destroy"); } });
                    });
                } else {
                    switch (rmsg[1]) {
                        case 'Invalid payment method': rdata = '无效的付款方式！'; break;
                        case 'Invalid amount': rdata = '充值金额必须为大于0的数字！'; break;
                        case 'Invalid sign': rdata = '接口[' + rmsg[2] + ']验证错误，请与客服联系！'; break;
                        case 'Amount can not exceed reseller balance': rdata = '充值金额大于允许限制，请与客服联系！'; break;
                    }
                    suwin.find(".pptext").text(rdata);
                }
            });
        }
    }
    else if (action == 2) {
        processing("正在获取充值结果，请稍候...");
        var pid = suwin.find("input:first").val();
        if (pid.indexOf('_') > 0) pid = pid.substring(pid.lastIndexOf('_') + 1);
        var delay = 0;
        var cmd = '';
        $.get("process.aspx?c=payment&at=verifypay&pid=" + pid + "&" + new Date(), function (rdata) {
            if (rdata == "-1") {
                rdata = "您的充值操作还没有完成，请点击“马上充值”";
            }
            else {
                delay = 1000;
                rdata = '充值成功！您现在可以继续购买操作了...';
                cmd = 'close';
            }
            showResults(rdata, delay, cmd);
        });
    }
}

function checkout(productID, billingCycle) {
    processing('正在发送购买请求，请稍候...');
    var cmd = '';
    delay = 0;
    var cform = $('#OrderConfig');
    $.post('/idcSystem.aspx?c=order&at=checkout&pid=' + productID + '&cycle=' + billingCycle + '&' + new Date(), cform.serialize(), function (rdata) {
        var rmsg = rdata.split('|');
        if (rmsg[0] == '0') {
            rdata = "<strong>购买成功！</strong><br />系统将会尽快为您开通服务，感谢您的购买！";
            delay = 1;
            cmd = 'close';
            swin.dialog("close");
            swin.html('您已经成功购买，系统将会为您尽快完成服务开通和设置，请选择：');
            swin.dialog({ title: "购买成功", autoOpen: false, resizable: false, modal: true, buttons: { "查看和管理我的服务": function () { top.location = 'process.aspx?c=go&url=' + escape('?c=myservice'); }, "继续购买": function () { $(this).dialog("close"); } } }).dialog("open");
        }
        else {
            switch (rmsg[1]) {
                case "Outstock": rdata = '此产品已经销售完毕，请选择其它产品！'; break;
                case "You only get to apply once": rdata = '每位客户只能申请一次试用！'; break;
                case "Payment is incorrect": rdata = '您选择的付款方式或付款周期有误！'; break;
                case "Invalid coupon code": rdata = '您输入的优惠码无效！'; break;
                case "Lack of balance": rdata = '您的余额不足于购买当前产品！'; break;
                case "Price configuration error": rdata = '产品价格配置错误！'; break;
                case "Module price error": rdata = '计费模块错误！'; break;
                case "Pending verification": rdata = '您的帐户需要验证后才能购买，请先到个人资料页面进行验证！'; break;
                case "无效的节点服务器！": rdata = "服务器资源不足!"; break;
                default: rdata = rmsg[1]; break;
            }
            delay = 0;
        }
        showResults(rdata, delay, cmd);
    });
}

function placeOrder(action, url) {
    if (action == 0) {
        if (userID == '') userLogin(0, 'cmd:placeOrder(1,"' + url + '");');
        else placeOrder(1, url);
    }
    else if (action == 1) {
        if (url.length > 3 && url.substring(0, 3) == '?c=') url = 'process.aspx?c=go&url=' + escape(url);
        top.location = url;
    }
}
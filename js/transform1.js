 // 兼容IE浏览器
function getStyle(obj, attr) {
    if (obj.currentStyle) {
      return obj.currentStyle[attr];
    } else {
      return document.defaultView.getComputedStyle(obj, null)[attr];
    }
}

function cssTransform(el,attr,val) {
	if(!el.transform){
		el.transform = {};
	}
	if(arguments.length>2) {
		el.transform[attr] = val;
		var sVal = "";
		for(var s in el.transform){
			switch(s) {
				case "rotate":
				case "skewX":
				case "skewY":
					sVal +=s+"("+el.transform[s]+"deg) ";
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
					sVal +=s+"("+el.transform[s]+"px) ";
					break;
				case "scaleX":
				case "scaleY":
				case "scale":
					sVal +=s+"("+el.transform[s]+") ";
					break;	
			}
			el.style.WebkitTransform = el.style.transform = sVal;
		}
	} else {
		val  = el.transform[attr];
		if(typeof val == "undefined" ) {
			if(attr == "scale" || attr == "scaleX" || attr == "scaleY"  ) {
				val = 1;
			} else {
				val = 0;
			}
		}
		return val;
	}
}
function navSwipe(obj) {
	var navScroll = document.querySelector('.chart-container');
	var qihao = document.querySelector('.issue-l-sort');
	var navs = document.querySelector(obj); 
	var startPoint = 0;
	var startX = 0;
	var minX = (navScroll.clientWidth - qihao.offsetWidth) - navs.offsetWidth ;
	var step = 1;
	var lastX = 0; //上次的距离
	var lastTime = 0;//上次的时间戳
	var lastDis = 0;
	var lastTimeDis = 0;
	var isMove = true;
	var isFirst = true;
	navScroll.addEventListener(
		'touchstart', 
		function(e) {
			navs.style.transition = "none";
			startPoint = e.changedTouches[0].pageX;
			startX = cssTransform(navs,"translateX");
			minX = (navScroll.clientWidth - qihao.offsetWidth) - navs.offsetWidth ;
			step = 1;
			lastX = startX;
			lastTime = new Date().getTime();
			lastDis = 0;
			lastTimeDis = 0;
		}
	);
	navScroll.addEventListener(
		'touchmove', 
		function(e) {
			var nowPoint = e.changedTouches[0].pageX;
			var dis = nowPoint - startPoint;
			var left = startX + dis;
			var nowTime = new Date().getTime();
			if(!isMove) {
				return ;
			}
			var nowPoint = e.changedTouches[0];
			var disX = nowPoint.pageX - startPoint.pageX;
			var disY = nowPoint.pageY - startPoint.pageY;
			if(isFirst) {
				isFirst = false;
				if(Math.abs(disX) < Math.abs(disY)) {
					isMove = false;
					return ;
				}
			}
			if(left > 0) {
				step = 1-left / navScroll.clientWidth; //根据超出长度计算系数大小，超出的越到 系数越小
				left = parseInt(left*step);
				left = 0;
			}
			if(left < minX) {
				var over = minX - left; // 计算下超出值
				step = 1-over / navScroll.clientWidth; //根据超出值计算系数
				over = parseInt(over*step);
				left = minX - over;
				left = minX;
			}
			lastDis = left-lastX; //距离差值
			lastTimeDis = nowTime - lastTime; //时间差值
			lastX = left;
			lastTime = nowTime;
			cssTransform(navs,"translateX",left);
		}
	);
	navScroll.addEventListener(
		'touchend', 
		function (){
			var speed = (lastDis/lastTimeDis)*120; //用距离差值/时间差值 = 速度     速度*系数 = 缓冲距离
			speed = isNaN(speed)?0:speed;
			var left = cssTransform(navs,"translateX");
			var target = left + speed ; //当前值 + 缓冲距离 = 目标点
			var type = "cubic-bezier(.34,.92,.58,.9)";
			var time = Math.abs(speed*.9);
			time = time<300?300:time;
			
			if(target > 0) {
				target = 0;
				type ="cubic-bezier(.08,1.44,.6,1.46)";
			}
			if(target < minX) {
				target = minX;
				type ="cubic-bezier(.08,1.44,.6,1.46)";
			}
			navs.style.transition = time+"ms ";
			cssTransform(navs,"translateX",target);
		}
	);
}

function scroll(obj) {
	var navScroll = document.querySelector('.chart-container');
	var qihao = document.querySelector('.issue-l-sort');
	var navs = document.querySelector(obj);
	var oDivPadding = $(".chart-container").height();//只是获取高度
	var startPoint = 0;
	var startY = 0;
	var minY = (navScroll.offsetHeight-oDivPadding-qihao.offsetHeight) -  navs.offsetHeight;
	var step = 1;
	var lastY = 0; //上次的距离
	var lastTime = 0;//上次的时间戳
	var lastDis = 0;
	var lastTimeDis = 0;
	var isMove = true;
	var isFirst = true;
	navScroll.addEventListener(
		'touchstart', 
		function(e) {
			navs.style.transition = "none";
			startPoint = e.changedTouches[0].pageY;
			startY = cssTransform(navs,"translateY");
			minY = (oDivPadding-qihao.offsetHeight) -  navs.offsetHeight;
			step = 1;
			lastY = startY;
			lastTime = new Date().getTime();
			lastDis = 0;
			lastTimeDis = 0;
		}
	);
	navScroll.addEventListener(
		'touchmove', 
		function(e) {
			var nowPoint = e.changedTouches[0].pageY;
			var dis = nowPoint - startPoint;
			var top = startY + dis;
			var nowTime = new Date().getTime();
			if(!isMove) {
				return ;
			}
			var nowPoint = e.changedTouches[0];
			var disX = nowPoint.pageX - startPoint.pageX;
			var disY = nowPoint.pageY - startPoint.pageY;
			if(isFirst) {
				isFirst = false;
				if(Math.abs(disX) > Math.abs(disY)) {
					isMove = false;
					return ;
				}
			}
			if(top > 0) {
				step = 1-top / navScroll.clientHeight; //根据超出长度计算系数大小，超出的越到 系数越小
				top = parseInt(top*step);
				top = 0;
			}
			if(top < minY) {
				var over = minY - top; // 计算下超出值
				step = 1-over / navScroll.clientHeight; //根据超出值计算系数
				over = parseInt(over*step);
				top = minY - over;
				top = minY;
			}
			lastDis = top-lastY; //距离差值
			lastTimeDis = nowTime - lastTime; //时间差值
			lastY = top;
			lastTime = nowTime;
			cssTransform(navs,"translateY",top);
		}
	);
	navScroll.addEventListener(
		'touchend', 
		function (){
			var speed = (lastDis/lastTimeDis)*120; //用距离差值/时间差值 = 速度     速度*系数 = 缓冲距离
			speed = isNaN(speed)?0:speed;
			var top = cssTransform(navs,"translateY");
			var target = top + speed ; //当前值 + 缓冲距离 = 目标点
			var type = "cubic-bezier(.34,.92,.58,.9)";
			var time = Math.abs(speed*.9);
			time = time<300?300:time;
			
			if(target > 0) {
				target = 0;
				type ="cubic-bezier(.08,1.44,.6,1.46)";
			}
			if(target < minY) {
				target = minY;
				type ="cubic-bezier(.08,1.44,.6,1.46)";
			}
			navs.style.transition = time+"ms " ;
			cssTransform(navs,"translateY",target);
		}
	);
}


//上下滑动
function mscroll(wrap,obj,callBack) {
//	var child = wrap.children[0]; 
	var qihao = document.querySelector('#qihao');
	var child = obj;
	var startPoint = 0;
	var startY = 0;
	var minY = (wrap.clientHeight-qihao.offsetHeight) - child.offsetHeight;
	var step = 1;
	var lastY = 0; 
	var lastTime = 0;
	var lastDis = 0;
	var lastTimeDis = 1;
	var isMove = true;
	var isFirst = true;
	var Tween = {
		easeOut: function(t, b, c, d){
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		backOut: function(t, b, c, d, s){
			if (typeof s == 'undefined') {
				s = 1.70158;  
			}
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		} 
	};
	cssTransform(child,"translateZ",0.01);
	wrap.addEventListener(
		'touchstart', 
		function(e) {
			minY = (wrap.clientHeight-qihao.offsetHeight) - child.offsetHeight;
			clearInterval(child.scroll);
			if(callBack&&callBack.start){
				callBack.start();
			}
			startPoint = {pageY:e.changedTouches[0].pageY,pageX:e.changedTouches[0].pageX};
			startY = cssTransform(child,"translateY");
			step = 1;
			lastY = startPoint.pageY;
			lastTime = new Date().getTime();
			lastDis = 0;
			lastTimeDis = 1;
			isMove = true;
			isFirst = true;
		}
	);
	wrap.addEventListener(
		'touchmove', 
		function(e) {
			if(!isMove) {
				return ;
			}
			var nowPoint = e.changedTouches[0];
			var disX = nowPoint.pageX - startPoint.pageX;
			var disY = nowPoint.pageY - startPoint.pageY;
			if(isFirst) {
				isFirst = false;
				if(Math.abs(disY) < Math.abs(disX)) {
					isMove = false;
					return ;
				}
			}
			var t = startY + disY;
			var nowTime = new Date().getTime();
			if(t > 0) {
				step = 1-t / wrap.clientHeight; 
				//t = parseInt(t*step);//有回弹效果
				t=0;//没有回弹效果
			}
			if(t < minY) {
				var over = minY - t; 
				step = 1-over / wrap.clientHeight;
				over = parseInt(over*step);
				//t = minY - over;//有回弹效果;
				t=minY;
			}
			lastDis = nowPoint.pageY - lastY; 
			lastTimeDis = nowTime - lastTime; 
			lastY = nowPoint.pageY;
			lastTime = nowTime;
			cssTransform(child,"translateY",t);
			if(callBack&&callBack.in){
				callBack.in();
			}
		}
	);
	wrap.addEventListener(
		'touchend', 
		function (){
			var speed = (lastDis/lastTimeDis)*120; 
			speed = isNaN(speed)?0:speed;
			var t = cssTransform(child,"translateY");
			var target = t + speed; 
			var type = "easeOut";
			var time = Math.abs(speed*.9);
			time = time<300?300:time;
			if(target > 0) {
				target = 0;
				type ="backOut";
			}
			if(target < minY) {
				target = minY;
				type ="backOut";
			}
			move(target,time,type);
			if(callBack&&callBack.end){
				callBack.end();
			}
		}
	);
	/*
		start 手指按下
		in 滑动中
		end 手指抬起
		over 滑动结束
	*/
	function move(target,time,type) {
		var t = 0;
		var b = cssTransform(child,"translateY");
		var c = target - b;
		var d = Math.ceil(time/20);
		clearInterval(child.scroll);
		child.scroll = setInterval(
			function() {
				t++;
				if(t > d) {
					clearInterval(child.scroll);
					if(callBack&&callBack.over){
						callBack.over();
					}
				} else {
					var top = Tween[type](t,b,c,d);
					cssTransform(child,"translateY",top);
					if(callBack&&callBack.in){
						callBack.in();
					}
				}
			},20
		);
	}
}
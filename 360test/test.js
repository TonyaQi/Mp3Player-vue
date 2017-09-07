window.onload = function(){
			var canvas = document.getElementById('canvas');
		if(canvas.getContext){
			var ctx = canvas.getContext('2d');
			var r = 15;
			var arr = [];
			var point = [];
			var pwdpoint = []; 
			start = function(){
				//初始化点坐标
				var count = 0;
				arr =[] ;
				point = [];
				for(var i = 0;i < 3;i++){
					for(var j = 0;j < 3;j++){
						count++;
						var obj = {
							x:80+j*80,
							y:50+i*60,
							index:count
						};
						arr.push(obj);
						point.push(obj);
					}
				}
			//9个点面板
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				for(var i=0;i < arr.length;i++){
					ctx.beginPath();
					ctx.arc(arr[i].x, arr[i].y, r, 0, Math.PI*2, true);
					ctx.strokeStyle='rgba(220, 221, 226, 1)';
					ctx.stroke();
					ctx.fillStyle='white';
					ctx.fill();
					ctx.closePath();
				}
			}
			
			drawPoint = function(){//画密码时的响应点
				for(var i=0;i < pwdpoint.length; i++){
					ctx.beginPath();
					ctx.arc(pwdpoint[i].x,pwdpoint[i].y,10,0,Math.PI*2,true);
					ctx.fillStyle='orange';
					ctx.fill();
					ctx.closePath();
				}
			}
			getPoint = function(e){//获取touch点相对于canvas的坐标
				var rect = e.currentTarget.getBoundingClientRect();
				var po = {
					x:e.touches[0].clientX - rect.left,
					y:e.touches[0].clientY - rect.top
				};
				return po;

			}
			drawLine = function(po,pwdpoint){//画密码时的出现的线
				ctx.beginPath();
				ctx.lineWidth=2;
				ctx.strokeStyle='red';
				ctx.moveTo(pwdpoint[0].x,pwdpoint[0].y);

				for(var i=1 ; i < pwdpoint.length ; i++){
					ctx.lineTo(pwdpoint[i].x,pwdpoint[i].y);
				}

				ctx.lineTo(po.x,po.y);
				ctx.stroke();
				ctx.closePath();

			}
			end = function(){//最后没连上的线消失
				/*console.log("end");*/
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				for(var i = 0 ;i < arr.length ; i++){
					ctx.beginPath();
					ctx.arc(arr[i].x, arr[i].y, r, 0, Math.PI*2, true);
					ctx.strokeStyle='rgba(220, 221, 226, 1)';
					ctx.stroke();
					ctx.fillStyle='white';
					ctx.fill();
					ctx.closePath();
				}
				drawPoint();
				ctx.beginPath();
				ctx.lineWidth=2;
				ctx.strokeStyle='red';
				ctx.moveTo(pwdpoint[0].x,pwdpoint[0].y);

				for(var i=1 ; i < pwdpoint.length ; i++){
					ctx.lineTo(pwdpoint[i].x,pwdpoint[i].y);
				}
				
				ctx.stroke();
				ctx.closePath();
			}
			updata = function(po){
				//不重新画就会出现一大片线
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				for(var i=0;i < arr.length;i++){
					ctx.beginPath();
					ctx.arc(arr[i].x, arr[i].y, r, 0, Math.PI*2, true);
					ctx.strokeStyle='rgba(220, 221, 226, 1)';
					ctx.stroke();
					ctx.fillStyle='white';
					ctx.fill();
					ctx.closePath();
				}
				drawPoint();
				drawLine(po,pwdpoint);
				for(var i=0 ; i< point.length ; i++){
					if(Math.abs(po.x - point[i].x) < r && Math.abs(po.y-point[i].y) < r){
						pwdpoint.push(point[i]);
						drawPoint();
						point.splice(i,1);//划拉过的的点不能再划了

					}
				}
			}

			var str = '' ;	//数字密码

			findpwd = function(pwdpoint){
				console.log("findpwd"+pwdpoint.length);				
				for(var i=0;i< pwdpoint.length;i++){

					str += pwdpoint[i].index;

				}
				console.log("转换结果"+str);
			}

			var step;
			
			var ftruepwd='';
			var struepwd='';
			
			checkpwd = function(pwd1,pwd2){

				console.log(pwd1);
				console.log(pwd2);
				return pwd1 === pwd2;
			}

			updatapwd = function(){//设置密码
				console.log("updatapwd");
				window.localStorage.removeItem('truepwd');
				pwdpoint = [] ;//输入的密码数组清空
				str=''; //数字密码清空
				step=0; //未设置密码状态 1设置了一次 2设置成功
				console.log(step);
				ftruepwd=''; //第一次密码清空
			 	struepwd=''; // 第二次密码清空
				document.getElementById('say').innerHTML = '请绘制解锁图案' ;
				start();//重新画一次
			}
			
			setpwd = function(){
				findpwd(pwdpoint);//先转化成数字密码
				console.log(step);
				if(str.length<5 && step!=2 &&flag==1){//短
					console.log("<5");
					console.log("数字密码短"+str);
					updatapwd();//相等于重新设置密码
					document.getElementById('say').innerHTML = '密码太短，至少需要5个点' ; 
				}else if(str.length >= 5 && step!=2){
					if(step==1 &&flag == 1){//已经有第一次密码了
						if(checkpwd(ftruepwd,str)){//第一次密码和获取到的数字密码相等
							console.log(">5==");
							struepwd = str;//把获取到的数字密码赋值给第二次密码
							window.localStorage.setItem('truepwd',struepwd);//赋值
							document.getElementById('say').innerHTML = '保存成功' ;
							console.log("成功"); 
							start();
							pwdpoint = [] ;
							str='';
							step = 2;//已经有保存的密码了
							console.log(step);
							document.getElementById('check').click();
						}
						else {//没匹配上
							console.log(">5!=");
							step=0;//相等于未设置
							updatapwd();
							document.getElementById('say').innerHTML = '两次输入的不一样' ; 
						}
					}
					else if(step!=2 && flag==1){//没设置密码呢还
						console.log(step+"再次输入");
						step=1;//这次就算设置了
						ftruepwd = str ;//给第一个密码赋值
						console.log("fpwd"+ftruepwd);
						document.getElementById('say').innerHTML = '请再次输入手势密码' ; 
						start();
						pwdpoint = [] ;
						str='';
					}
				}
			}
			open = function(){
				str='';
				console.log(step+"验证");
				console.log(flag+"flag");
				if(step==2 && flag==0 && pwdpoint.length>0){
				findpwd(pwdpoint);
				console.log("open"+str);
				if(checkpwd(str,window.localStorage.getItem('truepwd'))){
					document.getElementById('say').innerHTML='密码正确';	
				}
				else{
					document.getElementById('say').innerHTML='密码错误';
					start();
					pwdpoint = [];

				}	
				}
				else if(flag==0 && step !=2){
				document.getElementById('say').innerHTML='请先设置密码';
				start();
				pwdpoint = [] ;
				str='';
			}
			}
			start();
			var touchflag;
			canvas.addEventListener("touchstart",function(e){
				e.preventDefault();// 某些android 的 touchmove不宜触发 所以增加此行代码
				var po = getPoint(e);
				for(var i=0;i<point.length;i++){	
					if(Math.abs(po.x-point[i].x) < r && Math.abs(po.y-point[i].y) < r)
					{
						touchflag=true;
						pwdpoint.push(point[i]);
						drawPoint();
						point.splice(i,1);
					}
				}
			},false);
			canvas.addEventListener("touchmove",function(e){
				if(touchflag){
					updata(getPoint(e));
				}
			},false);
			canvas.addEventListener("touchend",function(e){
				if(touchflag){
					touchflag = false;
					end();
				}
			},false);
			var flag;
			var set = document.getElementById('set');
			if(set.checked){
				flag=1;
				document.getElementById('say').innerHTML = '绘制解锁图案' ; 
				console.log("do");
				updatapwd();
				canvas.addEventListener("touchend",setpwd);
			}
			document.getElementById('set').addEventListener('click',function sset(){
				flag=1;
				document.getElementById('say').innerHTML = '绘制解锁图案' ; 
				console.log("do");
				updatapwd();
				canvas.addEventListener("touchend",setpwd);

			});
			document.getElementById('check').addEventListener('click',function ccheck(){
				flag=0;
				document.getElementById('say').innerHTML = '请输入密码' ; 
				canvas.addEventListener("touchend",open);
			});
		}
			
}
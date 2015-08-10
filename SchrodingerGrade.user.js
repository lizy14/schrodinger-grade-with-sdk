// ==UserScript==
// @name          Schrodinger's Grade
// @author        Zhaoyang - http://200404.sinaapp.com/
// @namespace     200404_Schrodinger_Grade
// @description   薛定谔的查分
// @version       0.1.1
// @include       *://*.tsinghua.edu.cn*bks_yxkccj*
// @include       *://*.tsinghua.edu.cn*yjs_yxkccj*
// @include       *://*.tsinghua.edu.cn*bks_cjdcx*
// @include       *://*.tsinghua.edu.cn*yjs_cjdcx*
// @include       *://*.tsinghua.edu.cn*cj.cjCj*
// @include       *://*.tsinghua.edu.cn*bks_bxqkc*
// @include       *://*.tsinghua.edu.cn*bks_Allbxqkc*

// ==/UserScript==


/********************************

ReplaceHTML

gradeStr: string,  such as '80', '***', '合格'
gradeID : integer, a unique ID for each grade, starting from 0

return: a string contaning HTML, to be displayed in place of grade

**********************************/

function ReplaceHTML(gradeStr, gradeID){
	if(gradeStr=='***'||gradeStr=='') return '暂无成绩';
	var x=parseInt(gradeStr);
	var divID="GradeBox"+gradeID;
	var onclickscript;
	if(isNaN(x)){
		onclickscript="javascript:if(confirm('成绩不是数字。是否直接显示？')) \
		document.getElementById('"+divID+"').innerHTML='" + gradeStr + "'"
	}
	else{
		onclickscript="javascript:var range=prompt('请输入区间宽度'); \
		range = parseInt(range); \
		if(range>100)range=100; \
		rand=Math.floor(Math.random() * ( range + 1)); \
		x=" + x +"; \
		a= x-rand; \
		b= x+range-rand; \
		if(b>100){b=100;a=100-range;} \
		if(a<0){a=0;b=range;} \
		document.getElementById('"+divID+"').innerHTML=a+' - '+b;";
	}
	var html="<div id=\""+divID+"\"></div><input type=\"button\" value=\"观测\" onclick=\""+onclickscript+"\"/>";
	return html;
}


//查分脚本简易 SDK 
//您只需要自己实现 ReplaceHTML 函数即可
//By Zhaoyang, 2015.2, http://200404.sinaapp.com/
function main(){
var i,j;
var tableGrade;
	{
	var tables = document.getElementsByTagName("table");
	for (i=0; i<tables.length; i++) {
		tableGrade = tables[i];
		if ((tableGrade.textContent.indexOf("课程名")!=-1)||
			(tableGrade.textContent.indexOf("Course Title")!=-1)||
			(tableGrade.textContent.indexOf("Course title")!=-1)||
			(tableGrade.textContent.indexOf("学分")!=-1)||
		    (tableGrade.textContent.indexOf("Credit")!=-1)) {
			break;
		}
	}
	if(i==tables.length){
		alert("未在当前页面中找到成绩单表格");
		return;
	}
}
//table found, stored in tableGrade

var trs = tableGrade.getElementsByTagName("tr");
var columnID=0;
{
	var columnFlag = "";
	var tdTagNames = new Array("td","th");
	for (j=0;j<tdTagNames.length;j++){
		if(columnFlag)break;
		var titles = trs[0].getElementsByTagName(tdTagNames[j]);
		for (i=0; i<titles.length; i++) {
			if ((titles[i].textContent.indexOf('成绩' )!=-1)||
			    (titles[i].textContent.indexOf('Grade')!=-1)||
				(titles[i].textContent.indexOf('Score')!=-1)) {
				columnFlag ="th";
				columnID   =i;
				break;
			}
		}
	}
	if(!columnFlag){
		alert("未在当前页面中找到'成绩'列");
		return;
	}
}
//column of grade located, index stored in columnID

for(i=1;i<trs.length;i++){
	try{
		box=trs[i].getElementsByTagName("td")[columnID];
		grade=box.innerText.replace(/^\s+|\s+$/g, "");
        console.log('[' + (i-1) + '] => "' + grade + '"');
		box.innerHTML = ReplaceHTML(grade,i-1);
	}catch(err){}
}

}
main();
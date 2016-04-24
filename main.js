var cntxt;
var dots_len_list=new Array();
var imgwidth,imgheight;
var origin_image_data;
window.addEventListener("DOMContentLoaded", function(){
	var ofo= document.getElementById('selectfile');
	ofo.addEventListener("change",function(evt){

		var tempimg = null;//結果表示用画像イメージオブジェクト
		var inputfile = evt.target.files;
		var f_reader = new FileReader();

		f_reader.readAsDataURL(inputfile[0]);

		var cnvs = document.getElementById('resultcanvas');
		cntxt = cnvs.getContext('2d');

		f_reader.onload = function(){
			tempimg = new Image();
			tempimg.onload = function(){
				imgwidth = tempimg.width;
				imgheight = tempimg.height;
				cnvs.width = imgwidth;
				cnvs.height = imgheight;
				cntxt.drawImage(tempimg,0,0);
				init_info(imgheight,imgwidth);
			}
			tempimg.src = f_reader.result;
		}	
	},false);
});


function changeValue(value) {
    document.getElementById("val").innerHTML = dots_len_list[value];
}

function excute_convert_to_dot(value){
	if(dots_len_list.length){
		cntxt.restore();
		cntxt.save();
		cntxt.putImageData(origin_image_data,0,0);
		var imagedata = cntxt.getImageData(0,0,imgwidth,imgheight);
		var imgpixdata = imagedata.data;
		convert_to_dot(imgpixdata,dots_len_list[value],imgheight,imgwidth);
		cntxt.putImageData(imagedata,0,0);
	}
}

function init_info(pict_height,pict_width){
	origin_image_data = cntxt.getImageData(0,0,imgwidth,imgheight);
	cntxt.save();
	dots_len_list=get_square_len_list(pict_height,pict_width);
	var dots_len_bar_element=document.getElementById('dots_len_bar');
	dots_len_bar_element.max=dots_len_list.length-1;
}
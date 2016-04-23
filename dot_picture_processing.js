/*dot_picture_processing.js*/

//任意のh*w長方形にx*xの正方形を隙間なく敷き詰めるときのxはhとw公約数
var convert_to_dot = function (binaryData, dot_len, pict_height, pict_width) {
	var pict_len = pict_height*pict_width;
	for(var cursor_y=0;cursor_y<pict_height;cursor_y+=dot_len){
		for(var cursor_x=0;cursor_x<pict_width;cursor_x+=dot_len){
			var max_num_of_hue_group_num=0;
			var hue_group=new Array();
			var rgb_param = new Object();
			var dots_hue;
			for(var i=0;i<6;++i){
				hue_group[i]=new Array();
			}
			for(var px_y=cursor_y; px_y<cursor_y+dot_len; ++px_y){
				for(var px_x=cursor_x; px_x<cursor_x+dot_len; ++px_x){
					var idx=(px_x + px_y * pict_width) * 4;
					var temp_hue=get_hue_by_rgb(binaryData[idx],binaryData[idx+1],binaryData[idx+2]);
					var index_of_hue_index=   (temp_hue>=330||30>temp_hue) ? 0
											: (90>temp_hue) ? 1
											: (150>temp_hue) ? 2
											: (210>temp_hue) ? 3
											: (270>temp_hue) ? 4
											: 5;
					hue_group[index_of_hue_index].push(temp_hue);
					if(!temp_hue in rgb_param){
						rgb_param[temp_hue] = new rgb_obj(binaryData[idx],binaryData[idx+1],binaryData[idx+2]);
					}
				}
			}
			for(var i=1;i<6;++i){
				max_num_of_hue_group_num=(hue_group[i].length>hue_group[max_num_of_hue_group_num].length) ? i : max_num_of_hue_group_num;
			}
			hue_group[max_num_of_hue_group_num].sort(function(a,b){
				if( a < b ) return -1;
				if( a > b ) return 1;
				return 0;
			});
			dots_hue=hue_group[max_num_of_hue_group_num][hue_group[max_num_of_hue_group_num].length/2];
			for(var px_y=cursor_y; px_y<cursor_y+dot_len; ++px_y){
				for(var px_x=cursor_x; px_x<cursor_x+dot_len; ++px_x){
					var idx=(px_x + px_y * pict_width) * 4;
					binaryData[idx]=rgb_param[dots_hue].red;
					binaryData[idx+1]=rgb_param[dots_hue].blue;
					binaryData[idx+2]=rgb_param[dots_hue].green;
				}
			}
		}
	}
}

var get_square_len_list = function(pict_height,pict_width){
	var len_longer = pict_height;
	var len_shorter = pict_width;
	var list_of_square_len = [];
	if(pict_width>len_longer){
		len_longer = pict_width;
		len_shorter = pict_height;
	}
	for(var i=1;i<=len_shorter;++i){
		if(0==len_shorter%i&&0==len_longer%i){
			list_of_square_len.push(i);
		}
	}
	return [].concat(list_of_square_len);
}

function rgb_obj(red_num, blue_num,green_num){
	this.red=red_num;
	this.blue=blue_num;
	this.green=green_num;
}

function get_hue_by_rgb(red_num, blue_num, green_num){
	var max_num=red_num;
	var min_num=red_num;
	var num_of_plus=0;
	var num_of_molecule=blue_num-green_num;
	var num_of_hue;
	if(blue_num>max_num){
		max_num=blue_num;
		num_of_molecule=red_num-blue_num;
		num_of_plus = 2;
	}
	if(green_num>max_num){
		max_num=green_num;
		num_of_molecule=green_num-red_num;
		num_of_plus=4;
	}

	min_num=(min_num>blue_num) ? blue_num : min_num;
	min_num=(min_num>green_num) ? green_num : min_num;

	num_of_hue=(max_num==min_num) ? 0 : 60*(num_of_plus+num_of_molecule/max_num-min_num);

	return (num_of_hue<0) ? num_of_hue+360 : num_of_hue;
}

/**
 * 
 */

function View() {
	this.div = null;
}

View.prototype = {

/**
 * 
 */
	getDiv: function() {
		return this.div;
	},

	setFocus: function(focus) {

	},

	setVisible: function(visible) {
		this.div.style.display = visible ? "block" : "none";
	},

	hide: function() {
		this.setVisible(false);
	},

	show: function() {

		this.setVisible(true);
	},
	
	render: function() {
		
	},

	onKeyEvent: function(key) {

	},

	moveTo: function(t, l, r, b) {
		if (typeof(this.div) === "object") {
			if (t || t === 0) this.div.style.top = t + "px";
			if (l || l === 0) this.div.style.left = l + "px";
			if (r || r === 0) this.div.style.right = r + "px";
			if (b || b === 0) this.div.style.bottom = b + "px";
		}
	}
}

function ListView(div,controller,focusViewConstructor) {
	View.call(this);
	this.index = 0;
	this.items = [];
	this.div = div;

	this.selected = 0;
	this.displaycount = 8;
	this.displaybase = 0;
	this.startY = 0;
	this.item_height = 50;
	
	this.itemindex = 0;
	
	this.focusView = focusViewConstructor ? new focusViewConstructor(this) : new FocusView(this);
	this.ctrl = controller;
	
	this.needRepaintFocus = true;
	this.needRepaintItems = true;
	this.repaintItemsDirect = null; 
	this.needDescendKeyEvent = true;
	this.render();
}

ListView.prototype = new View();

ListView.prototype.setVisible = function(visible) {
	
}

ListView.prototype.setDescendKeyEvent = function (isDown) {
	this.needDescendKeyEvent = isDown ? true : false;
}

ListView.prototype.setFocus = function(focus) {
	var item = this.items[this.selected];
	if (item) {
		item.setFocus(focus);
	}
}


ListView.prototype.painterList = function (isUp) {
	var i;
	var sum;
	var startY = this.startY;
	var items = this.items;
	var ctrl = this.ctrl;
	var len = ctrl.getCount();
	var data = ctrl.data;
	if (len < this.displaycount) {
		sum = len;
	} else {
		sum = this.displaycount;
	}
	
	if (isUp === true) {      
		//按键为方向键下，items向上移动
		var base = this.displaybase;
		var offset = 2;
		for(i = 0; i < sum; i++){
			var itemPostion = i + offset;
			var dataPostion = i + base;
			items[itemPostion] = ctrl.getView(this,items[itemPostion],dataPostion);
			items[itemPostion].moveTo(startY + i * this.item_height, null, null, null);
			//items.unshift(items.pop())
		}
		items.unshift(items.pop())
		this.repaintItemsDirect = null;
	}
	else if (isUp === false) {  //按键为方向键上，items向下移动
		
		var base = this.displaybase;
	 	var offset = 0;
		for(i = 0; i < sum; i++){
			var itemPostion = i+offset;
			var dataPostion = i+base;
			items[itemPostion] = ctrl.getView(this,items[itemPostion],dataPostion);
			items[itemPostion].moveTo(startY + i * this.item_height, null, null, null);
		}
		
		items.push(items.shift())
		this.repaintItemsDirect = null;
	}
	else {
	 	var base = this.displaybase;
	 	var offset = 1;
		for(i = 0; i < sum; i++){
			var itemPostion = i+offset;
			var dataPostion = i+base;
			items[itemPostion] = ctrl.getView(this,items[itemPostion],dataPostion);
			items[itemPostion].moveTo(startY + i * this.item_height, null, null, null);
		}
		
	}
}


ListView.prototype.focusMove = function() {
	var ctrl = this.ctrl;
	var len = ctrl.getCount();
	var pos = this.selected - this.displaybase;
	if (pos > -1 && pos < len) {
		//this.focusView.style.webkitTransition = 'top 0.3s';
		this.focusView.moveTo(parseInt(this.startY + pos * this.item_height));
	}
}

ListView.prototype.setSelected = function(postion) {
	
}

ListView.prototype.render = function() {
	if (this.needRepaintFocus) {
		this.focusMove();
	}
	if (this.needRepaintItems) {
		this.painterList(this.repaintItemsDirect);
		
	}
}

ListView.prototype.onKeyEvent = function(keycode) {
	var sel = this.selected;
	var ctrl = this.ctrl;
	var items = this.items;
	var old_sel = sel;
	var channelCount = ctrl.getCount();
	if (keycode == 40) { //down
		if (channelCount > 0) {
			sel ++;
			if (sel > channelCount - 1) {
				sel = channelCount - 1
			}
			this.index = sel;
			this.itemindex ++;
			if (sel < channelCount) {	
				this.selected = sel;
				if (this.displaybase + parseInt(this.displaycount / 2) < sel && this.displaybase + this.displaycount < channelCount) {
					this.displaybase ++;
					this.needRepaintFocus = false;
					this.needRepaintItems = true;
					this.repaintItemsDirect = true; 
				} else {
					//focus move
					this.needRepaintFocus = true;  
					this.needRepaintItems = false; 
					this.repaintItemsDirect = null; 
				}
				this.render(); 
			}
		}
		
		if (sel !== old_sel) {
			/*this.needRepaintItems = true;
			if (channelCount > this.displaycount) {
				this.repaintItemsDirect = sel > parseInt(this.displaycount / 2) ? true : false;
			} else{
				this.repaintItemsDirect = false;
			}*/
			this.onItemSelected(this, items[sel- this.displaybase + 1], sel, items[old_sel - this.displaybase + 1], old_sel);
		}
	} 
	else if (keycode == 38) { //up
		if (channelCount > 0) {
			sel--;
			if (sel < 0) sel = 0;
			this.index = sel;
			if (sel > -1) {
				this.selected = sel;
				if (this.displaybase + parseInt(this.displaycount / 2) > sel && this.displaybase > 0) {
					this.displaybase --;
					this.needRepaintFocus = false;
					this.needRepaintItems = true;
					this.repaintItemsDirect = false;
				} else {
					this.needRepaintFocus = true;
					this.needRepaintItems = false;
					this.repaintItemsDirect = null; 
				}
				
				this.render();  
			}
		}
		if (sel !== old_sel) {
	/*		this.needRepaintItems = true;
			if (channelCount > this.displaycount) {
				this.repaintItemsDirect = sel > parseInt(this.displaycount / 2) ? true : false;
			} else{
				this.repaintItemsDirect = false;
			}*/
			this.onItemSelected(this, items[sel- this.displaybase + 1], sel, items[old_sel - this.displaybase + 1], old_sel);
		}
	} else {
		
		var item = ctrl.getView(this, items[sel], sel);
		
		if (this.needDescendKeyEvent) {
			
			item.onKeyEvent(keycode, sel);
		} 
		if (keycode == 13) { //enter
			
			this.onItemClicked(this, item, sel);
		}
	}
}

ListView.prototype.onItemClicked = function (listview, itemview, postion) {
	
}

ListView.prototype.onItemSelected = function (listview, itemview_now, postion_now, itemview_old, postion_old) {
	
}


function FocusView (listview) {	
	View.call(this);
	
	var div = listview.getDiv(); 
	var focusDiv = document.createElement("div");
	focusDiv.id = "itemFocus";
	this.div = focusDiv;
	div.appendChild(focusDiv);	
	
}

FocusView.prototype = new View();
	
function ItemView() {
	View.call(this);
}

ItemView.prototype = new View();
ItemView.prototype.update = function(data) {
	
}

function Controller(viewConstructor,data) {
	this.data = data;
	this.viewConstructor = viewConstructor;
}

Controller.prototype = {
	getView: function(listview, itemview, position) {
		if (!itemview) {
			var item = new this.viewConstructor(listview, this.data[position]);
			itemview = item;
		} else {
			itemview.update(this.data[position]);
		}
		return itemview;
	},
	
	getCount: function() {
		
		return this.data.length;
	},
	
	getData: function(postion) {
		return this.data[postion];
	}
}



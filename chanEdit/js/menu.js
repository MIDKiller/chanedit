

function MenuItemView(listview, data) {
	View.call(this);

	var div = listview.getDiv(); 
	var skip = data.skip;
	var favor = data.favor;

	var menuDiv = document.createElement('div');
	menuDiv.className = 'chan-item';
	
	if (data.name) {
		var nameDiv = document.createElement('div');
		nameDiv.className = 'chan-name';
		nameDiv.innerHTML = data.name;
		menuDiv.appendChild(nameDiv);
	}
	
	this.div = menuDiv;
	
	div.appendChild(menuDiv);
}

MenuItemView.prototype = new ItemView();


function init_listview() {
	var ctrl = new Controller(MenuItemView,itemArr);
	var listview = new ListView(document.getElementById("chan_list"),ctrl,null);
	
	listview.onItemClicked = function(listview,itemview,postion) {
		// for play	or open page
		ctrl.data = itemArr;
		window.location.href = ctrl.data[postion].url;
	};
	
	listview.show();

	listview.setFocus(true);

	document.onkeydown = function(e) {
		var key = e.keyCode;
		listview.onKeyEvent(key);
	}
}
init_listview();
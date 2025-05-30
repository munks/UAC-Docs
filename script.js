let xhttp = new XMLHttpRequest();
let storage; //json 객체
let list; //List id 객체
let view; //View id 객체
let lang; //언어 설정

window.onload = function () {
	if (navigator.language != null) {
		lang = navigator.language;
	} else if (navigator.userLanguage != null) {
		lang = navigator.userLanguage;
	} else if (navigator.systemLanguage != null) {
		lang = navigator.systemLanguage;
	}
	lang = lang.toLowerCase().substring(0,2);
	if (lang == "ko") {
		lang = "koKR";
	} else {
		lang = "enUS";
	}
	
	list = document.getElementById("List");
	view = document.getElementById('ViewFrame');
	xhttp.open("GET", "data.json", true);
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			storage = JSON.parse(this.response);
			
			for (i in storage.data) {
				let title = document.createElement("details");
				let item = document.createElement("summary");
				
				title.className = "ListTitle";
				item.append(storage[lang][i].toString());
				console.log(storage[lang][i].toString());
				title.appendChild(item);
				
				for (j in storage.data[i]) {
					let name = document.createElement("div");
					name.className = "Selector";
					name.id = i.toString() + "/" + j.toString();
					name.append(storage[lang][j].toString());
					name.addEventListener("click", (e)=>{ getData(e.target.id); });
					
					title.appendChild(name);
				}
				list.append(title);
			}
		}
	};
	xhttp.send();
}

function getData (data) {
	let c = data.split('/');
	let text = "";
	let idx;
	
	for (i in storage.data[c[0]][c[1]]) {
		switch (i) {
			case 'Ranged':
			case 'Spell':
			case 'AttackSpeed':
				text += storage[lang][i] + ": " + storage.data[c[0]][c[1]][i].toString() + "%<br>";
				break;
			case 'Range':
			case 'Energy':
				text += storage[lang][i] + ": " + storage.data[c[0]][c[1]][i].toString() + "<br>";
				break;
			case 'Special':
				text += "<br>" + storage[lang][c[1] + "Special"] + "<br>";
				break;
			case 'Type':
			case 'Kind':
				idx = 0;
				text += "<br>" + storage[lang][i] + ": ";
				if (Array.isArray(storage.data[c[0]][c[1]][i])) {
					for (t in storage.data[c[0]][c[1]][i]) {
						if (idx != 0) {
							text += ", ";
						}
						text += storage[lang][storage.data[c[0]][c[1]][i][t]];
						idx++;
					}
				} else {
					text += storage[lang][storage.data[c[0]][c[1]][i]];
				}
				text += "<br>";
				break;
		}
	}
	view.innerHTML = text;
}
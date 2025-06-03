let storage; //json 객체
let list; //List id 객체
let view; //View id 객체
let lang; //언어 설정
let pslider; //플레이어 수 객체
let pval;
let pdata = [[-0.0117, -0.04, -0.04], [0.004, 0.015, 0.006]];
let dslider; //난이도 객체
let dval;
let ddata = [[0.015, 0.1, 0.3, 0.4], [0.013, 0.1, 0.085, 0]];

window.onload = function () {
	let data = {};

	if (navigator.language != null) {
		lang = navigator.language;
	} else if (navigator.userLanguage != null) {
		lang = navigator.userLanguage;
	} else if (navigator.systemLanguage != null) {
		lang = navigator.systemLanguage;
	}
	lang = lang.toLowerCase().substring(0,2);
	if (lang == 'ko') {
		lang = 'koKR';
	} else {
		lang = 'enUS';
	}
	
	list = document.getElementById('List');
	view = document.getElementById('ViewFrame');
	
	storage = JSON.parse(JSON.stringify(
				Object.assign(
						{'data': Object.assign(
							itemAccessary.data,
							itemArmor.data,
							itemWeapon.data,
							itemSpecial.data,
							explosive.data,
							undeadT3.data,
							undeadT2.data,
							undeadT1.data,
							usArmyDrone.data,
							usArmyInfantry.data,
							usArmyMechanics.data,
							campaign.data,
							structure.data,
							lunatic.data)
						}, koKR
				)));
	dataInit();

	pslider = document.getElementById('Player');
	pval = document.getElementById('PVal');
	pval.innerHTML = pslider.value;
	
	pslider.oninput = function() {
		pval.innerHTML = this.value;
		calcDiffValue();
	}

	dslider = document.getElementById('Diff');
	dval = document.getElementById('DVal');
	dval.innerHTML = dslider.value;
	
	dslider.oninput = function() {
		dval.innerHTML = this.value;
		calcDiffValue();
	}
}

function dataInit () {
	let conds;
	
	for (i in storage.data) {
		let title = document.createElement('details');
		let item = document.createElement('summary');
		
		conds = storage[lang][i] != null;
		title.className = 'ListTitle';
		if (conds && storage[lang][i].Name != null) {
			item.append(storage[lang][i].Name.toString());
		} else {
			item.append(i);
		}
		
		title.appendChild(item);
		
		for (j in storage.data[i]) {
			let name = document.createElement('div');
			name.className = 'Selector';
			name.id = i.toString() + '/' + j.toString();
			if (conds && storage[lang][i][j] != null) {
				name.append(storage[lang][i][j].toString());
			} else {
				name.append(j);
			}
			name.addEventListener('click', (e)=>{ getData(e.target.id); });
			
			title.appendChild(name);
		}
		list.append(title);
	}

	document.getElementById('DTip').dataset.title = storage[lang].DiffTip;
}

function getData (data) {
	let c = data.split('/');
	let text = '';
	let idx;
	let obj = storage.data[c[0]][c[1]];
	let txtobj = storage[lang];
	let tmp;
	let t1;
	let cond;
	
	switch (c[0]) {
		case 'UndeadT1':
		case 'UndeadT2':
		case 'UndeadT3':
			view.className = c[0].slice(6);
			break;
		default:
			view.className = '';
	}

	cond = (txtobj[c[0]] != null && txtobj[c[0]][c[1]] != null);
	text += '[' + (cond ? txtobj[c[0]][c[1]] : c[1].toString()) + ']<br>';
	if (cond && txtobj[c[0]][c[1] + 'Tip']) {
		text += txtobj[c[0]][c[1] + 'Tip'] + '<br>';
	}
	text += '<br>';
	
	for (i in obj) {
		tmp = txtobj[c[0]];
		switch (i) {
			//On Item
			case 'Ranged':
			case 'Spell':
			case 'AttackSpeed':
				text += txtobj[i] + ': ' + obj[i].toString() + '%<br>';
				break;
			case 'RangeBonus':
			case 'EnergyRegen':
				text += txtobj[i] + ': ' + obj[i].toString() + '<br>';
				break;
			case 'Special':
				text += '<br>' + txtobj[c[0]][c[1] + 'Special'] + '<br>';
				break;
			case 'Type':
				tmp = txtobj;
			case 'Kind':
				idx = 0;
				text += '<br>' + txtobj[i] + ': ';
				if (Array.isArray(obj[i])) {
					for (t in obj[i]) {
						if (idx != 0) {
							text += ', ';
						}
						text += tmp[obj[i][t]];
						idx++;
					}
				} else {
					text += tmp[obj[i]];
				}
				text += '<br>';
				break;
			//On Unit
			case 'Life':
			case 'Speed':
			case 'Armor':
				text += txtobj[i];
				text += ': <span id="' + i + '" data-' + i.toLowerCase() + '="' + obj[i].toString() + '">'
				text += obj[i].toString();
				text += '</span><br>';
				break;
			case 'Behavior':
				text += '<br>';
				if (Array.isArray(obj[i])) {
					for (t in obj[i]) {
						text += txtobj[c[0]][obj[i][t]] + ': ' + txtobj[c[0]][obj[i][t] + 'Tip'] + '<br>';
						idx++;
					}
				} else {
					text += txtobj[c[0]][obj[i]] + ': ' + txtobj[c[0]][obj[i] + 'Tip'] + '<br>';
				}
				break;
			case 'Weapon':
				text += '<br>[' + txtobj[c[0]][obj[i].Name] + ']<br>';
				for (j in obj[i]) {
					switch (j) {
						case 'Range':
							text += txtobj[j] + ': ' + ((obj[i][j] == 0) ? txtobj.Melee : obj[i][j].toString()) + '<br>';
							break;
						case 'Period':
							text += txtobj[j] + ': ' + obj[i][j].toString() + '<br>';
							break;
						case 'Damage':
							text += txtobj[j];
							text += ': <span id="Damage" data-damage="' + obj[i][j][0].toString() + '" data-random="' + obj[i][j][1].toString() + '">';
							text += obj[i][j][0].toString() + '-' + (obj[i][j][0] + obj[i][j][1]).toString();
							text += '</span><br>';
							break;
						case 'DamageType':
							text += txtobj[j] + ': ' + txtobj[obj[i][j].toString()] + '<br>';
							break;
					}
				}
				break;
		}
	}
	view.innerHTML = text;
	calcDiffValue();
}

function calcDiffValue () {
	let p = pslider.value;
	let pval = 0;
	let pidx = 0;
	let d = dslider.value;
	let didx = 0;
	let tmpval;
	let tmpval2;
	
	if (!view.className) { return; }
	
	if (p <= 3) {
		pval = 4 - p;
		pidx = 0;
	} else {
		pval = p - 3;
		pidx = 1;
	}

	didx = view.className == 'T1' ? 1 : 0;

	obj = document.getElementById('Life');
	if (obj) {
		tmpval = parseFloat(obj.dataset['life']);
		obj.innerHTML = (tmpval * (1 + (pdata[pidx][2] * pval) + (ddata[didx][2] * d))).toFixed(0);
	}
	
	obj = document.getElementById('Speed');
	if (obj) {
		tmpval = parseFloat(obj.dataset['speed']);
		obj.innerHTML = parseFloat(((tmpval + (pdata[pidx][0] * pval)) * (1 + (ddata[didx][0] * d))).toFixed(4));
	}

	obj = document.getElementById('Armor');
	if (obj) {
		tmpval = parseFloat(obj.dataset['armor']);
		obj.innerHTML = parseFloat((tmpval + (ddata[didx][3] * d)).toFixed(2));
	}

	obj = document.getElementById('Damage');
	if (obj) {
		tmpval = parseFloat(obj.dataset['damage']);
		tmpval2 = 1 + (pdata[pidx][1] * pval) + (ddata[didx][1] * d);
		obj.innerHTML = parseFloat((tmpval * tmpval2).toFixed(2)) + '-' +
							parseFloat(((tmpval * tmpval2) + (parseFloat(obj.dataset['random']) * tmpval2)).toFixed(2));
	}
}


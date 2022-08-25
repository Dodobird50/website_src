var _ = window._;

_.getEntryFromToday = function( state ) {
	return _.dataFromToday.getEntry( state );
}

_.getEntryFromYesterday = function( state ) {
	return _.dataFromYesterday.getEntry( state );
}

_.isUpdatedToday = function( state ) {
	var entry = _.dataFromToday.getEntry( state );
	var yesterdayEntry = _.dataFromYesterday.getEntry( state );
	return entry[1] - yesterdayEntry[1] > 0 || entry[3] - yesterdayEntry[3] > 0;
}

_.sevenDayAverageInNewCases = function( state, index ) {
	if ( index == undefined ) {
		if ( !_.isTimeTravelActive() ) {
			index = _.allData.length - 2;
		}
		else {
			index = _.userSettings.dataFromTodayIndex;
		}
	}
	
	if ( index < 7 ) {
		return null;
	}

	if ( !state ) {
		state = "USA";
	}

	var casesDataAnomalyInvolved = false;
	var casesDataAnomaliesForState = _.casesDataAnomalies[state];
	if ( casesDataAnomaliesForState ) {
		for ( var i = index - 6; i <= index; i++ ) {
			if ( casesDataAnomaliesForState.has( i ) ) {
				casesDataAnomalyInvolved = true;
				break;
			}
		}
	}

	if ( !casesDataAnomalyInvolved ) {
		var one, two;
		if ( state == "USA" ) {
			one = _.allData[index].n[0];
			two = _.allData[index - 7].n[0];
		}
		else {
			one = _.allData[index].getEntry( state )[1];
			two = _.allData[index - 7].getEntry( state )[1];
		}
		var ret = parseInt( ( one - two ) / 7 + 0.5 );
	}
	else {
		var numDays = 0;
		var totalNewCases = 0;
		for ( var i = index - 6; i <= index; i++ ) {
			if ( casesDataAnomaliesForState.has( i ) ) {
				continue;
			}

			numDays++;
			if ( !state || state == "USA" ) {
				totalNewCases += _.allData[i].n[0] - _.allData[i - 1].n[0];
			}
			else {
				totalNewCases += one = _.allData[i].getEntry( state )[1] - _.allData[i - 1].getEntry( state )[1];
			}
		}

		var ret = parseInt( totalNewCases / numDays + 0.5 );
	}

	if ( ret == -0 ) {
		return 0;
	}
	else {
		return ret;
	}
}

_.sevenDayAverageInNewCasesPer100000People = function( state, index ) {
	if ( index == undefined ) {
		if ( !_.isTimeTravelActive() ) {
			index = _.allData.length - 2;
		}
		else {
			index = _.userSettings.dataFromTodayIndex;
		}
	}
	
	if ( index < 7 ) {
		return null;
	}

	if ( !state ) {
		state = "USA";
	}
	
	var casesDataAnomalyInvolved = false;
	var casesDataAnomaliesForState = _.casesDataAnomalies[state];
	if ( casesDataAnomaliesForState ) {
		for ( var i = index - 6; i <= index; i++ ) {
			if ( casesDataAnomaliesForState.has( i ) ) {
				casesDataAnomalyInvolved = true;
				break;
			}
		}
	}

	if ( !casesDataAnomalyInvolved ) {
		var one, two;
		if ( state == "USA" ) {
			one = _.allData[index].n[1];
			two = _.allData[index - 7].n[1];
		}
		else {
			one = _.allData[index].getEntry( state )[2];
			two = _.allData[index - 7].getEntry( state )[2];
		}

		var average = ( one - two ) / 7;
		// Round to nearest tenth
		var ret = parseInt( average * 10 + 0.5 ) / 10;
	}
	else {
		var numDays = 0;
		var sum = 0;
		for ( var i = index - 6; i <= index; i++ ) {
			if ( casesDataAnomaliesForState.has( i ) ) {
				continue;
			}

			numDays++;
			if ( !state || state == "USA" ) {
				sum += _.allData[i].n[1] - _.allData[i - 1].n[1];
			}
			else {
				sum += one = _.allData[i].getEntry( state )[2] - _.allData[i - 1].getEntry( state )[2];
			}
		}

		var average = sum / numDays;
		// Round to nearest tenth
		var ret = parseInt( average * 10 + 0.5 ) / 10;
	}

	if ( ret == -0 ) {
		return 0;
	}
	else {
		return ret;
	}
}

_.sevenDayAverageInNewDeaths = function( state, index ) {
	if ( index == undefined ) {
		if ( !_.isTimeTravelActive() ) {
			index = _.allData.length - 2;
		}
		else {
			index = _.userSettings.dataFromTodayIndex;
		}
	}
	
	if ( index < 7 ) {
		return null;
	}

	if ( !state ) {
		state = "USA";
	}

	var deathsDataAnomalyInvolved = false;
	var deathsDataAnomaliesForState = _.deathsDataAnomalies[state];
	if ( deathsDataAnomaliesForState ) {
		for ( var i = index - 6; i <= index; i++ ) {
			if ( deathsDataAnomaliesForState.has( i ) ) {
				deathsDataAnomalyInvolved = true;
				break;
			}
		}
	}

	if ( !deathsDataAnomalyInvolved ) {
		var one, two;
		if ( state == "USA" ) {
			one = _.allData[index].n[2];
			two = _.allData[index - 7].n[2];
		}
		else {
			one = _.allData[index].getEntry( state )[3];
			two = _.allData[index - 7].getEntry( state )[3];
		}

		var average = ( one - two ) / 7;
		// Round to nearest tenth
		var ret = parseInt( average * 10 + 0.5 ) / 10;
	}
	else {
		var numDays = 0;
		var sum = 0;
		for ( var i = index - 6; i <= index; i++ ) {
			if ( deathsDataAnomaliesForState.has( i ) ) {
				continue;
			}

			numDays++;
			if ( !state || state == "USA" ) {
				sum += _.allData[i].n[2] - _.allData[i - 1].n[2];
			}
			else {
				sum += one = _.allData[i].getEntry( state )[3] - _.allData[i - 1].getEntry( state )[3];
			}
		}

		var average = sum / numDays;
		// Round to nearest tenth
		var ret = parseInt( average * 10 + 0.5 ) / 10;
	}

	if ( ret == -0 ) {
		return 0;
	}
	else {
		return ret;
	}
}

_.dateAndTimeFromCalendarFromToday = function() {
	return _.dateAndTimeFromCalendar( _.calendarFromToday );
}

_.dateAndTimeFromCalendar = function( calendar ) {
	if ( calendar[3] == undefined ) {
		return _.dateFromCalendar( calendar );
	}
	
	var date;
	var time = calendar[3] + ":";
	if ( calendar[4] >= 10 ) {
		time += calendar[4];
	}
	else {
		time += "0" + calendar[4];
	}
	
	switch ( _.languageIndex() ) {
		case 0: {
			date = calendar[1] + "/" + calendar[2] + "/" + calendar[0];
			return date + ", " + time + " ET";
		}
		case 1:
		case 3: {
			date = calendar[2] + "/" + calendar[1] + "/" + calendar[0];
			if ( _.languageIndex() == 3 ) {
				return date + ", " + time + " heure de l'Est";
			}
			else {
				return date + ", " + time + " hora del este";
			}
		}
		case 2:
		case 4: {
			date = calendar[0] + "/" + calendar[1] + "/" + calendar[2];
			if ( _.languageIndex() == 4 ) {
				return date + "、東部時" + time;
			}
			else {
				return date + "，东部时间" + time + "";
			}
		}
	}
}

_.dateFromCalendar = function( calendar ) {
	switch ( _.languageIndex() ) {
		case 0: {
			return calendar[1] + "/" + calendar[2] + "/" + calendar[0];
		}
		case 1:
		case 3: {
			return calendar[2] + "/" + calendar[1] + "/" + calendar[0];
		}
		case 2:
		case 4: {
			return calendar[0] + "/" + calendar[1] + "/" + calendar[2];
		}
	}
}

var documentTitles = ["COVID-19 tracker", "Rastreador de COVID-19", "新冠肺炎追踪器", "Traqueur de COVID-19", "COVID-19トラッカー"];
_.setTitle = function() {
	document.title = documentTitles[_.languageIndex()];
}
    
_.setUpdateNotificationInnerHTML = function() {
	var dateAndTime = _.dateAndTimeFromCalendar( _.allData[_.allData.length - 1].d );
	switch ( _.languageIndex() ) {
		case 0: {
			updateNotification.innerHTML = "An update from " + dateAndTime + " is currently in effect.";
			break;
		}
		case 1: {
			updateNotification.innerHTML = "Una actualización de " + dateAndTime + " actualmente está activa.";
			break;
		}
		case 2: {
			updateNotification.innerHTML = "一个从" + dateAndTime + "的更新正在生效。";
			break;
		}
		case 3: {
			updateNotification.innerHTML = "Une mise à jour à partir de " + dateAndTime + " est actuellement en vigueur.";
			break;
		}
		case 4: {
			updateNotification.innerHTML = "現在、" + dateAndTime + "からの更新が有効です。";
			break;
		}
	}
}

var dismissUpdateButtonInnerHTMLs = ["OK", "Bueno", "好的", "D'accord", "よし"];
_.setDismissUpdateButtonInnerHTML = function() {
	dismissUpdateButton.innerHTML = dismissUpdateButtonInnerHTMLs[_.languageIndex()];
}

var confirmLanguageButtonInnerHTMLs = ["Confirm language", "Confirmar idioma", "确认语言", "Confirmer la langue", "言語を確認する"];
_.setConfirmLanguageButtonInnerHTML = function() {
	confirmLanguageButton.innerHTML = confirmLanguageButtonInnerHTMLs[_.languageIndex()];
}

var dayModeToggleNightModeButtonInnerHTMLs = ["Switch to night mode", "Cambiar al modo nocturno", "切换到夜间模式", 
	"Passer en mode nuit", "ナイトモードに切り替えます"];
var nightModeToggleNightModeButtonInnerHTMLs = ["Switch to day mode", "Cambiar al modo de día", "切换到白天模式", 
	"Passer en mode jour", "日モードに切り替えます"];
_.setToggleNightModeButtonInnerHTML = function() {
	if ( !_.userSettings.isNightMode ) {
		toggleNightModeButton.innerHTML = dayModeToggleNightModeButtonInnerHTMLs[_.languageIndex()];
	}
	else {
		toggleNightModeButton.innerHTML = nightModeToggleNightModeButtonInnerHTMLs[_.languageIndex()];
	}
}

_.setLastUpdatedOnText = function() {
	var dateAndTime = _.dateAndTimeFromCalendarFromToday();
	if ( !_.isTimeTravelActive() ) {
		isThereAnUpdateFromYesterday = _.dataFromToday.n[0] != _.dataFromYesterday.n[0] || _.dataFromToday.n[1] != _.dataFromYesterday.n[1];
		if ( !isThereAnUpdateFromYesterday ) {
			switch( _.languageIndex() ) {
				case 0: {
					dateAndTime = dateAndTime.slice( 0, dateAndTime.indexOf( "," ) );
					lastUpdatedOn = "There is no new data for today (" + dateAndTime + ") yet. Check back later, "
						+ "or <a href='javascript:;' id='goToYesterdayLink'>go back to yesterday</a>. "
					break;
				}
				case 1: {
					dateAndTime = dateAndTime.slice( 0, dateAndTime.indexOf( "," ) );
					lastUpdatedOn = "No hay nuevos datos para hoy (" + dateAndTime + ") todavía. Vuelve más tarde, "
						+ "o <a href='javascript:;' id='goToYesterdayLink'>Viaje en el tiempo hasta ayer</a>. "
					break;
				}
				case 2: {
					dateAndTime = dateAndTime.slice( 0, dateAndTime.indexOf( "，" ) );
					lastUpdatedOn = "今天(" + dateAndTime + ")还没有新的数据。稍后再看，或者<a href='javascript:;' id='goToYesterdayLink'>"
						+ "回到昨天</a>。"
					break;
				}
				case 3: {
					dateAndTime = dateAndTime.slice( 0, dateAndTime.indexOf( "," ) );
					lastUpdatedOn = "Il n'y a pas encore de nouvelles données pour aujourd'hui (" + dateAndTime 
						+ "). Revenez plus tard, ou <a href='javascript:;' id='goToYesterdayLink'>revenez à hier</a>. "
					break;
				}
				case 4: {
					dateAndTime = dateAndTime.slice( 0, dateAndTime.indexOf( "、" ) );
					lastUpdatedOn = "今日(" + dateAndTime + ")の新しいデータはまだありません。後でチェックするか、"
						+"<a href='javascript:;' id='goToYesterdayLink'>昨日に戻るか</a>。"
					break;
				}
			}
		}
		else {
			switch ( _.languageIndex() ) {
				case 0: {
					lastUpdatedOn = "Last updated on " + dateAndTime + ". ";
					break;
				}
				case 1: {
					lastUpdatedOn = "Ultima actualización en " + dateAndTime + ". ";
					break;
				}
				case 2: {
					lastUpdatedOn = "最后更新时间：" + dateAndTime + "。";
					break;
				}
				case 3: {
					lastUpdatedOn = "Dernière mise à jour à " + dateAndTime + ". ";
					break;
				}
				case 4: {
					lastUpdatedOn = "最終更新日は" + dateAndTime + "です。"
					break;
				}
			}
		}

		switch ( _.languageIndex() ) {
			case 0: {
				lastUpdatedOn += "Source of data: "
					+ "<a target='_blank' href='https://www.nytimes.com/interactive/2021/us/covid-cases.html'>"
					+ "nytimes.com/interactive/2021/us/covid-cases.html</a>. NOT FOR COMMERICAL USE.";
				break;
			}
			case 1: {
				lastUpdatedOn += "Fuente de datos: "
					+ "<a target='_blank' href='https://www.nytimes.com/interactive/2021/us/covid-cases.html'>"
					+ "nytimes.com/interactive/2021/us/covid-cases.html</a>. NO ES PARA USO COMERCIAL.";
				break;
			}
			case 2: {
				lastUpdatedOn += "数据来源："
					+ "<a target='_blank' href='https://www.nytimes.com/interactive/2021/us/covid-cases.html'>"
					+ "nytimes.com/interactive/2021/us/covid-cases.html</a>。不用于商业用途。";
				break;
			}
			case 3: {
				lastUpdatedOn += "Source de données: "
					+ "<a target='_blank' href='https://www.nytimes.com/interactive/2021/us/covid-cases.html'>"
					+ "nytimes.com/interactive/2021/us/covid-cases.html</a>. PAS POUR UN USAGE COMMERCIAL.";
				break;
			}
			case 4: {
				lastUpdatedOn += "データのソース："
					+ "<a target='_blank' href='https://www.nytimes.com/interactive/2021/us/covid-cases.html'>"
					+ "nytimes.com/interactive/2021/us/covid-cases.html</a>。商用目的ではありません。";
				break;
			}
		}
	}
	else {
		switch ( _.languageIndex() ) {
			case 0: {
				lastUpdatedOn = "Displayed data is as of " + dateAndTime + ". Source of data: "
					+ "<a target='_blank' href='https://www.nytimes.com/interactive/2021/us/covid-cases.html'>"
					+ "nytimes.com/interactive/2021/us/covid-cases.html</a>. NOT FOR COMMERICAL USE.";
				break;
			}
			case 1: {
				lastUpdatedOn = "Los datos mostrados son a partir de " + dateAndTime + ". Fuente de datos: "
					+ "<a target='_blank' href='https://www.nytimes.com/interactive/2021/us/covid-cases.html'>"
					+ "nytimes.com/interactive/2021/us/covid-cases.html</a>. NO ES PARA USO COMERCIAL.";
				break;
			}
			case 2: {
				lastUpdatedOn = "显示的数据截至" + dateAndTime + "。 数据来源："
					+ "<a target='_blank' href='https://www.nytimes.com/interactive/2021/us/covid-cases.html'>"
					+ "nytimes.com/interactive/2021/us/covid-cases.html</a>。 不用于商业用途。";
				break;
			}
			case 3: {
				lastUpdatedOn = "Les données affichées sont en date du " + dateAndTime + ". Source de données: "
					+ "<a target='_blank' href='https://www.nytimes.com/interactive/2021/us/covid-cases.html'>"
					+ "nytimes.com/interactive/2021/us/covid-cases.html</a>. PAS POUR UN USAGE COMMERCIAL.";
				break;
			}
			case 4: {
				lastUpdatedOn = "表示されているデータは" + dateAndTime + "現在のものです。データのソース:"
					+ "<a target='_blank' href='https://www.nytimes.com/interactive/2021/us/covid-cases.html'>"
					+ "nytimes.com/interactive/2021/us/covid-cases.html</a>。商用目的ではありません。";
				break;
			}
		}
	}

	if ( _.isTimeTravelActive() || isThereAnUpdateFromYesterday ) {
		lastUpdatedOn += "</br>";
	}
}

var indicateUpdatedStatesInnerHTMLs = [
	"Indicate states/territories that updated today.",
	"Indicar estados/territorios que se actualizaron hoy.",
	"指出今天更新的州/领土。",
	"Indiquer les états/territoires qui ont mis à jour aujourd'hui.",
	"今日更新された州/領土を示す。"
];
_.setIndicateUpdatedStatesCheckboxLabelInnerHTML = function() {
	indicateUpdatedStatesCheckboxLabel.innerHTML = indicateUpdatedStatesInnerHTMLs[_.languageIndex()];
}

var resetChartsButtonInnerHTMLs = ["Reset charts", "Restablecer gráficos", "重置图表", "Réinitialiser les graphiques", "チャートをリセット"];
_.setResetChartsButtonInnerHTML = function() {
	resetChartsButton.innerHTML = resetChartsButtonInnerHTMLs[_.languageIndex()];
}

_.updateCookies = function() {
	// Reset cookie
	var keyValuePairs = document.cookie.split( ';' ); 
	for ( var i = 0; i < keyValuePairs.length; i++ ) {
		// Make every key-value pair in cookie expire instantly by giving it a expire value of 1/1/1970
		document.cookie = keyValuePairs[i] + "= ;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
	document.cookie = "_.userSettings=" + JSON.stringify( _.userSettings ) + ";";
	// Expire in 30 days
	document.cookie = "expires=" + ( Date.now() + 18144000 ) + ";";
}
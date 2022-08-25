var _ = window._;

_.colA.compareEntries = function( entry1, entry2 ) {
	if ( entry1[0] == entry2[0] ) {
		return 0;
	}
	
	var tiebreakerOrder;
	var absSortingMethod = Math.abs( _.userSettings.sortingMethod );
	
	if ( absSortingMethod == 1 ) {
		// If sorting method is total cases, then tiebreaker order is:
		// Total cases, total cases per capita, 7 day average for total cases, 7 day average for total cases per capita, total deaths
		tiebreakerOrder = [1, 2, 4, 5, 3];
	}
	else if ( absSortingMethod == 2 ) {
		// If sorting method is total cases per capita, then tiebreaker order is:
		// Total cases per capita, total cases, 7 day average for total cases per capita, 7 day average for total cases, total deaths
		tiebreakerOrder = [2, 1, 5, 4, 3];
	}
	else if ( absSortingMethod == 3 ) {
		// If sorting method is total deaths, then tiebreaker order is:
		// Total deaths, total cases, total cases per capita, 7 day average for total cases, 7 day average for total cases per capita
		tiebreakerOrder = [3, 1, 2, 4, 5];
	}
	else if ( absSortingMethod == 4 ) {
		// If sorting method is 7 day average for total cases, then tiebreaker order is:
		// 7 day average for total cases, 7 day average for total cases per capita, total cases, total cases per capita, total deaths
		tiebreakerOrder = [4, 5, 1, 2, 3];
	}
	else if ( absSortingMethod == 5 ) {
		// If sorting method is 7 day average for total cases per capita, then tiebreaker order is:
		// 7 day average for total cases per capita, 7 day average for total cases, total cases per capita, total cases, total deaths
		tiebreakerOrder = [5, 4, 2, 1, 3];
	}
	
	var reverse = _.userSettings.sortingMethod > 0;
	for ( var i = 0; i < tiebreakerOrder.length; i++ ) {
		var tiebreaker = tiebreakerOrder[i];
		var var1, var2;
		if ( tiebreaker < 4 ) {
			var1 = entry1[tiebreaker];
			var2 = entry2[tiebreaker];
		}
		else if ( tiebreaker == 4 ) {
			// Compare seven day averages of new cases
			var1 = _.sevenDayAverageInNewCases( entry1[0] );
			var2 = _.sevenDayAverageInNewCases( entry2[0] );
		}
		else if ( tiebreaker == 5 ) {
			// Compare seven day averages of new cases per 100,000 people
			var1 = _.sevenDayAverageInNewCasesPer100000People( entry1[0] );
			var2 = _.sevenDayAverageInNewCasesPer100000People( entry2[0] );
		}
		var c = var1 - var2;
		if ( reverse ) {
			c = -c;
		}
		if ( c > 0 ) {
			return 1;
		}
		else if ( c < 0 ) {
			return -1;
		}
		// Move on to next tiebreaker
	}
	// To reach here, all data must have been equal
	return entry1[0].localeCompare( entry2[0] );
}

_.sortEntries = function() {
	_.entriesFromToday.sort( _.colA.compareEntries );
}

// refreshDataDisplay must be invoked when the following things happen (after setup is finished):
// - Data is updated or resorted
// - Language is changed
// - When time is changed
// Before setup is finished, call refreshDataDisplay to setup contents of dataDisplay
_.refreshDataDisplay = function() {
	if ( !dataDisplay.onmouseleave ) {
		dataDisplay.onmouseleave = _.displayNationalStats;
	}

	var pinnedRow;
	var displayRank = 1;
	if ( _.finishedSetup ) {
		dataDisplayHeader.outerHTML = _.dataDisplayHeaderHTML;
		_.colA.setDataDisplayHeaderFunctionality();
		
		for ( var i = 0; i < _.entriesFromToday.length; i++ ) {
			var entry = _.entriesFromToday[i];
			var row = dataDisplay.children[i + 1];
			row.state = entry[0];
			if ( entry[0] == _.userSettings.pinnedState ) {
				pinnedRow = row;
			}

			row.displayRank = displayRank++;
			// Unhighlight row
			row.style.backgroundColor = "";
			_.colA.setRowInnerHTML( row, entry );
		}
	}
	else {
		dataDisplay.innerHTML = _.dataDisplayHeaderHTML;
		_.colA.setDataDisplayHeaderFunctionality();
		for ( var i = 0; i < _.entriesFromToday.length; i++ ) {
			var entry = _.entriesFromToday[i];
			var row = document.createElement( "div" );
			
			row.state = entry[0];
			if ( entry[0] == _.userSettings.pinnedState ) {
				pinnedRow = row;
			}
			
			// Add interactive features
			row.onmouseenter = function() {
				// Highlight row, and display state stats of that row
				var self = this;
				_.colA.displayStateStats( self.state );
				if ( !_.userSettings.isNightMode ) {
					self.style.backgroundColor = "#ebebeb";
				}
				else {
					self.style.backgroundColor = "#202020";
				}
			};
			row.onmouseleave = function( event ) {
				// De-highlight row
				var self = this;
				self.style.backgroundColor = "";
				
				var index = dataDisplay.children.length - 1;
				var last = dataDisplay.children[index];
				while ( last.className == "row d-none" ) {
					index--;
					var last = dataDisplay.children[index];
				}
				
				// Due to padding bottom of dataDisplay, if self is the last child of dataDisplay and location
				// of mouseleave is at the bottom, act as if mouse left dataDisplay altogether
				if ( self == last && event.clientY > 1 ) {
					displayNationalStats();
				}
			};
			row.onmousedown = function( event ) {
				var self = this;
				var state = self.state;
				if ( event.button == 0 ) {
					setTimeout( function() {
						var state = self.state;
						if ( select2.value != state ) {
							select2.value = state;
							select2.onchange();
						}
						_.scrollToCharts();
						if ( _.isMobile ) {
							self.style.backgroundColor = "";
							_.displayNationalStats();
						}
					}, 1 );
				}
				else if ( event.button == 2 ) {
					_.pinState( state, self );
				}
			}
			row.addEventListener( "contextmenu", event => {
				event.preventDefault();
			});
			
			row.setAttribute( "class", "row" );
			row.displayRank = displayRank++;
			
			_.colA.setRowInnerHTML( row, entry );
			dataDisplay.appendChild( row );
		}
	}
	
	if ( pinnedRow && dataDisplay.children.length > 1 ) {
		var firstRow = dataDisplay.children[1];
		if ( firstRow != pinnedRow ) {
			// Swap positions of firstRow and pinnedRow
			dataDisplay.insertBefore( pinnedRow, firstRow );
		}
	}
	
	_.recolorRows();
	_.displayNationalStats();
}

var dataDisplayHeaderChildrenSortingMethods = [1, 2, 4, 5, 3]
var dataDisplayHeaderChildrenOnClick = function() {
	var self = this;
	var simplyReverseEntries = false;
	if ( self.state == 0 ) {
		_.userSettings.sortingMethod = self.sortingMethod;
		self.style.textDecoration = "underline";
		self.state = 1;
	}
	else if ( self.state == 1 ) {
		_.userSettings.sortingMethod = -self.sortingMethod;
		self.style.fontStyle = "italic";
		self.state = 2;
		simplyReverseEntries = true;
		
	}
	else {
		_.userSettings.sortingMethod = self.sortingMethod;
		self.style.fontStyle = "normal";
		self.state = 1;
		simplyReverseEntries = true;
	}
	
	if ( simplyReverseEntries ) {
		for ( var i = 0; i < _.entriesFromToday.length / 2; i++ ) {
			var j = _.entriesFromToday.length - i - 1;
			var temp = _.entriesFromToday[i];
			_.entriesFromToday[i] = _.entriesFromToday[j];
			_.entriesFromToday[j] = temp;
		}
	}
	else {
		_.sortEntries();
	}
	
	_.refreshDataDisplay();
	_.updateCookies();
	
	for ( var i = 0; i < dataDisplay.children[0].children.length; i++ ) {
		var child = dataDisplay.children[0].children[i];
		if ( child.sortingMethod != self.sortingMethod ) {
			child.style.textDecoration = "normal";
			child.style.fontStyle = "normal";
			child.state = 0;
		}
	}
};

_.colA.setDataDisplayHeaderFunctionality = function() {
	dataDisplayHeader.onmouseenter = _.displayNationalStats;
	
	for ( var i = 0; i < dataDisplayHeader.children.length; i++ ) {
		var child = dataDisplayHeader.children[i];
		if ( i >= 2 && i < 7 ) {
			child.sortingMethod = dataDisplayHeaderChildrenSortingMethods[i - 2];
			if ( !_.isMobile ) {
				child.onclick = dataDisplayHeaderChildrenOnClick;
			}
			else {
				child.ontouchend = dataDisplayHeaderChildrenOnClick;
			}
			
			if ( child.sortingMethod == _.userSettings.sortingMethod ) {
				child.style.textDecoration = "underline";
				child.state = 1;
			}
			else if ( -child.sortingMethod == _.userSettings.sortingMethod ) {
				child.style.textDecoration = "underline";
				child.style.fontStyle = "italic";
				child.state = 2;
			}
			else {
				child.state = 0;
			}
			
			child.style.cursor = "pointer";
		}
	}
}

_.colA.setRowInnerHTML = function( row, entry ) {
	if ( !entry ) {
		entry = _.dataFromToday.getEntry( row.state );
	}
	
	var language = _.userSettings.language;
	
	var finalHTML = "";
	if ( entry[0] == _.userSettings.pinnedState ) {
		finalHTML += "<div>" + row.displayRank + "&nbsp;&nbsp;📌</div>";
	}
	else {
		finalHTML += "<div>" + row.displayRank + "</div>";
	}
	finalHTML += "<div>" + _.translateState( _.stateFromAbbreviation ( entry[0] ) ) + "</div>";
	finalHTML += "<div>" + entry[1].toLocaleString( language ) + "</div>";
	finalHTML += "<div>" + entry[2].toLocaleString( language ) + "</div>";
	finalHTML += "<div>" + _.sevenDayAverageInNewCases( entry[0] ).toLocaleString( language ) + "</div>";
	finalHTML += "<div>" + _.sevenDayAverageInNewCasesPer100000People( entry[0] ).toLocaleString( language ) + "</div>";
	finalHTML += "<div>" + entry[3].toLocaleString( language ) + "</div>";
	if ( !_.isUpdatedToday( entry[0] ) ) {
		finalHTML += "<div></div>";
	}
	else {
		// Mark update from yesterday
		finalHTML += "<div>✔</div>";
	}
	row.innerHTML = finalHTML;
}

var dayModeRowColors = ["red", "orange", "goldenrod", "green", "blue", "purple"];
var nightModeRowColors = ["red", "orange", "yellow", "lime", "deepskyblue", "mediumpurple"];
_.recolorRows = function() {
	for ( var i = 1; i < dataDisplay.children.length; i++ ) {
		_.colA.recolorRow( dataDisplay.children[i] );
	}
}

_.colA.recolorRow = function( row ) {
	if ( row.className == "row" && row.displayRank - 1 < 6 ) {
		if ( !_.userSettings.isNightMode ) {
			row.style.color = dayModeRowColors[row.displayRank - 1];
		}
		else {
			row.style.color = nightModeRowColors[row.displayRank - 1];
		}
	}
	else {
		row.style.color = "";
	}
}

_.pinState = function( state, rowToPin ) {
	// Place pinnedRow back in default unpinned position
	var pinnedRow = dataDisplay.children[1];
	dataDisplay.removeChild( pinnedRow );
	dataDisplay.insertBefore( pinnedRow, dataDisplay.children[pinnedRow.displayRank] );
	
	pinnedRow.children[0].innerHTML = pinnedRow.displayRank;
	
	if ( _.userSettings.pinnedState != state ) {
		if ( !rowToPin ) {
			// Locate row with new pin to state, and put the state at the top
			for ( var i = 1; i < dataDisplay.children.length; i++ ) {
				if ( dataDisplay.children[i].state == state ) {
					rowToPin = dataDisplay.children[i];
					break;
				}
			}
		}
		
		// Insert rowToPin at the top of the table
		dataDisplay.insertBefore( rowToPin, dataDisplay.children[1] );
		rowToPin.children[0].innerHTML = rowToPin.displayRank + "&nbsp;&nbsp;📌";
		_.userSettings.pinnedState = state;
	}
	else {
		_.userSettings.pinnedState = null;
	}
	
	_.updateCookies();
}

_.colA.displayStateStats = function( state ) {
	var entry = _.getEntryFromToday( state );
	var yesterdayEntry = _.getEntryFromYesterday( state );
	var changeInCases = entry[1] - yesterdayEntry[1];
	var changeInCasesPer100000People = entry[2] - yesterdayEntry[2];
	var newCasesAverage = _.sevenDayAverageInNewCases( state );
	var newCasesPer100000PeopleAverage = _.sevenDayAverageInNewCasesPer100000People( state );
	var changeInDeaths = entry[3] - yesterdayEntry[3];
	
	var strings;
	var language = _.userSettings.language;
	switch ( _.languageIndex() ) {
		case 0: {
			strings = [
				" - Total cases: " + entry[1].toLocaleString( language ) + " (+" 
					+ changeInCases.toLocaleString( language ) + " from yesterday)",
				
				"&emsp;&emsp; - Per 100,000 people: " + entry[2].toLocaleString( language ) + " (+" 
					+ changeInCasesPer100000People.toLocaleString( language ) + " from yesterday)",
				
				"- 7 day average of new cases (as of ?): " + newCasesAverage.toLocaleString( language ),
				
				"&emsp;&emsp; - Per 100,000 people: " + newCasesPer100000PeopleAverage.toLocaleString( language ),
				
				" - Total deaths: " + entry[3].toLocaleString( language ) + " (+" 
					+ changeInDeaths.toLocaleString( language ) + " from yesterday)",
			];
			break;
		}
		case 1: {
			strings = [
				" - Casos totales: " + entry[1].toLocaleString( language ) + " (+" 
					+ changeInCases.toLocaleString( language ) + " de ayer)",
					
				"&emsp;&emsp; - Por 100,000 personas: " + entry[2].toLocaleString( language ) + " (+" 
					+ changeInCasesPer100000People.toLocaleString( language ) + " de ayer)",
				
				" - Promedio de 7 días de casos nuevos (a partir de ?): " + newCasesAverage.toLocaleString( language ),
				
				"&emsp;&emsp; - Por 100.000 personas: " + newCasesPer100000PeopleAverage.toLocaleString( language ),
					
				" - Muertes totales: " + entry[3].toLocaleString( language ) + " (+" 
					+ changeInDeaths.toLocaleString( language ) + " de ayer)",
			];
			break;
		}
		case 2: {
			var strings = [
				" - 累计确诊：" + entry[1].toLocaleString( language ) + " (从昨天+" 
					+ changeInCases.toLocaleString( language ) + ")",
				
				"&emsp;&emsp; - 每10万人中：" + entry[2].toLocaleString( language ) + " (从昨天+" 
					+ changeInCasesPer100000People.toLocaleString( language ) + ")",
				
				" - 新确诊的7天平均(截至?)：" + newCasesAverage.toLocaleString( language ),
				
				"&emsp;&emsp; - 每10万人中：" + newCasesPer100000PeopleAverage.toLocaleString( language ),
				
				" - 累计死亡：" + entry[3].toLocaleString( language ) + " (从昨天+" 
					+ changeInDeaths.toLocaleString( language ) + ")",
			];
			break;
		}
		case 3: {
			strings = [
				" - Nombre total des cas: " + entry[1].toLocaleString( language ) + " (+" 
					+ changeInCases.toLocaleString( language ) + " d'hier)",
				
				"&emsp;&emsp; - Pour 100 000 personnes: " + entry[2].toLocaleString( language ) 
					+ " (+" + changeInCasesPer100000People.toLocaleString( language ) + " d'hier)",
				
				" - Moyenne sur 7 jours de nouveaux cas (à partir ?): " 
					+ newCasesAverage.toLocaleString( language ),
				
				"&emsp;&emsp; - Pour 100 000 personnes: " 
					+ newCasesPer100000PeopleAverage.toLocaleString( language ),
				
				" - Nombre total des décès: " + entry[3].toLocaleString( language ) + " (+" 
					+ changeInDeaths.toLocaleString( language ) + " d'hier)",
			];
			break;
		}
		case 4: {
			var strings = [
				" - 累積診断：" + entry[1].toLocaleString( language ) + " (昨日から+" 
					+ changeInCases.toLocaleString( language ) + ")",
				
				"&emsp;&emsp; - 10万人あたりの：" + entry[2].toLocaleString( language ) + " (昨日から+" 
					+ changeInCasesPer100000People.toLocaleString( language ) + ")",
				
				" - 新たに診断の7日間の平均(?現在)：" + newCasesAverage.toLocaleString( language ),
				
				"&emsp;&emsp; - 10万人あたりの：" + newCasesPer100000PeopleAverage.toLocaleString( language ),
				
				" - 累積死亡：" + entry[3].toLocaleString( language ) + " (昨日から+" 
					+ changeInDeaths.toLocaleString( language ) + ")",
			];
			break;
		}
	}
	
	strings.unshift( _.translateState( _.stateFromAbbreviation ( state ) ) + ":" );
	strings.push( lastUpdatedOn );
	
	_.colA.fillRowA2StringsMissingInfo( strings );
	_.colA.fillRowA2( strings );
	if ( rowA2.children[6].children.length == 2 ) {
		_.colA.activateGoToYesterdayLink();
	}
}

_.colA.activateGoToYesterdayLink = function() {
	var href = rowA2.children[6].children[0];
	href.onclick = function() {
		timeTravelRange.value = _.allData.length - 2 + "";
		timeTravelRange.oninput();
	}
}

_.displayNationalStats = function() {
	var changeInCases = _.dataFromToday.n[0] - _.dataFromYesterday.n[0];
	var changeInCasesPer100000People = _.dataFromToday.n[1] - _.dataFromYesterday.n[1];
	var newCasesAverage = _.sevenDayAverageInNewCases();
	var newCasesPer100000PeopleAverage = _.sevenDayAverageInNewCasesPer100000People();
	var changeInDeaths = _.dataFromToday.n[2] - _.dataFromYesterday.n[2];
	
	var strings;
	var language = _.userSettings.language;
	switch ( _.languageIndex() ) {
		case 0: {
			strings = [
				"Across the country:",
			
				" - Total cases: " + _.dataFromToday.n[0].toLocaleString( language ) + " (+" 
					+ changeInCases.toLocaleString( language ) + " from yesterday)",
				
				"&emsp;&emsp; - Per 100,000 people: " + _.dataFromToday.n[1].toLocaleString( language ) + " (+" 
					+ changeInCasesPer100000People.toLocaleString( language ) + " from yesterday)",
				
				"- 7 day average of new cases (as of ?): " + newCasesAverage.toLocaleString( language ),
				
				"&emsp;&emsp; - Per 100,000 people: " + newCasesPer100000PeopleAverage.toLocaleString( language ),
				
				" - Total deaths: " + _.dataFromToday.n[2].toLocaleString( language ) + " (+" 
					+ changeInDeaths.toLocaleString( language ) + " from yesterday)",
			];
			break;
		}
		case 1: {
			strings = [
				"A escala nacional:",
			
				" - Casos totales: " + _.dataFromToday.n[0].toLocaleString( language ) + " (+" 
					+ changeInCases.toLocaleString( language ) + " de ayer)",
					
				"&emsp;&emsp; - Por 100,000 personas: " + _.dataFromToday.n[1].toLocaleString( language ) + " (+" 
					+ changeInCasesPer100000People.toLocaleString( language ) + " de ayer)",
				
				" - Promedio de 7 días de casos nuevos (a partir de ?): " + newCasesAverage.toLocaleString( language ),
				
				"&emsp;&emsp; - Por 100.000 personas: " + newCasesPer100000PeopleAverage.toLocaleString( language ),
					
				" - Muertes totales: " + _.dataFromToday.n[2].toLocaleString( language ) + " (+" 
					+ changeInDeaths.toLocaleString( language ) + " de ayer)",
			];
			break;
		}
		case 2: {
			var strings = [
				"全美国：",
			
				" - 累计确诊：" + _.dataFromToday.n[0].toLocaleString( language ) + " (从昨天+" 
					+ changeInCases.toLocaleString( language ) + ")",
				
				"&emsp;&emsp; - 每10万人中：" + _.dataFromToday.n[1].toLocaleString( language ) + " (从昨天+" 
					+ changeInCasesPer100000People.toLocaleString( language ) + ")",
				
				"- 新确诊的7天平均(截至?)：" + newCasesAverage.toLocaleString( language ),
				
				"&emsp;&emsp; - 每10万人中：" + newCasesPer100000PeopleAverage.toLocaleString( language ),
				
				" - 累计死亡：" + _.dataFromToday.n[2].toLocaleString( language ) + " (从昨天+" 
					+ changeInDeaths.toLocaleString( language ) + ")",
			];
			break;
		}
		case 3: {
			strings = [
				"À l'échelle nationale" + ":",
				
				" - Nombre total des cas: " + _.dataFromToday.n[0].toLocaleString( language ) + " (+" 
					+ changeInCases.toLocaleString( language ) + " d'hier)",
				
				"&emsp;&emsp; - Pour 100 000 personnes: " + _.dataFromToday.n[1].toLocaleString( language ) 
					+ " (+" + changeInCasesPer100000People.toLocaleString( language ) + " d'hier)",
				
				" - Moyenne sur 7 jours de nouveaux cas (à partir ?): " 
					+ newCasesAverage.toLocaleString( language ),
				
				"&emsp;&emsp; - Pour 100 000 personnes: " 
					+ newCasesPer100000PeopleAverage.toLocaleString( language ),
				
				" - Nombre total des décès: " + _.dataFromToday.n[2].toLocaleString( language ) + " (+" 
					+ changeInDeaths.toLocaleString( language ) + " d'hier)",
			];
			break;
		}
		case 4: {
			var strings = [
				"全国で：",
			
				" - 累積診断：" + _.dataFromToday.n[0].toLocaleString( language ) + " (昨日から+" 
					+ changeInCases.toLocaleString( language ) + ")",
				
				"&emsp;&emsp; - 10万人あたりの：" + _.dataFromToday.n[1].toLocaleString( language ) + " (昨日から+" 
					+ changeInCasesPer100000People.toLocaleString( language ) + ")",
				
				" - 新たに診断の7日間の平均(?現在)：" + newCasesAverage.toLocaleString( language ),
				
				"&emsp;&emsp; - 10万人あたりの：" + newCasesPer100000PeopleAverage.toLocaleString( language ),
				
				" - 累積死亡：" + _.dataFromToday.n[2].toLocaleString( language ) + " (昨日から+" 
					+ changeInDeaths.toLocaleString( language ) + ")",
			];
			break;
		}
	}
	strings.push( lastUpdatedOn );

	_.colA.fillRowA2StringsMissingInfo( strings );
	_.colA.fillRowA2( strings );
	if ( rowA2.children[6].children.length == 2 ) {
		_.colA.activateGoToYesterdayLink();
	}
}

_.colA.fillRowA2StringsMissingInfo = function( strings ) {
	if ( !_.isTimeTravelActive() ) {
		switch ( _.languageIndex() ) {
			case 0: {
				strings[3] = strings[3].replace( "?", "yesterday" );
				break;
			}
			case 1: {
				strings[3] = strings[3].replace( "?", "ayer" );
				break;
			}
			case 2: {
				strings[3] = strings[3].replace( "?", "昨天" );
				break;
			}
			case 3: {
				strings[3] = strings[3].replace( "?", "d'hier" );
				break;
			}
			case 4: {
				strings[3] = strings[3].replace( "?", "昨日" );
				break;
			}
		}
	}
	else {
		switch ( _.languageIndex() ) {
			case 0: {
				strings[3] = strings[3].replace( "?", "today" );
				break;
			}
			case 1: {
				strings[3] = strings[3].replace( "?", "hoy" );
				break;
			}
			case 2: {
				strings[3] = strings[3].replace( "?", "今天" );
				break;
			}
			case 3: {
				strings[3] = strings[3].replace( "?", "d'aujourd'hui" );
				break;
			}
			case 4: {
				strings[3] = strings[3].replace( "?", "今日" );
				break;
			}
		}
	}
}

_.colA.fillRowA2 = function( strings ) {
	if ( strings.length != 7 ) {
		throw new Error( "rowA2 must have 7 strings" );
	}
	
	var w = _.baseWidth;
	
	if ( rowA2.children.length == 0 ) {
		if ( _.isUSMapVisible ) {
			var fontSizes;
			fontSizes = [w / 60, w / 100, w / 100, w / 100, w / 100, w / 100, w / 140];
		}
		else {
			fontSizes = [w / 30, w / 50, w / 50, w / 50, w / 50, w / 50, w / 70];
		}
		
		var padding = w / 800 + "px";
		for ( var i = 0; i < 7; i++ ) {
			var div = document.createElement( "div" );
			
			strings[i] = strings[i].replaceAll( "+-", "-" );
			div.innerHTML = strings[i];
			div.style.fontSize = fontSizes[i] + "px";
			div.style.paddingBottom = padding;
			if ( i == 0 ) {
				div.style.fontWeight = "bold";
			}
			
			rowA2.appendChild( div );
		}
	}
	else {
		for ( var i = 0; i < 7; i++ ) {
			var div = rowA2.children[i];
			strings[i] = strings[i].replaceAll( "+-", "-" );
			div.innerHTML = strings[i];
		}
	}
}

_.scrollToCharts = function() {
	var y = 0.015 * _.baseWidth;
	if ( updateDiv.className == "" ) {
		y += updateDiv.offsetHeight;
		y += 0.015 * _.baseWidth;
	}
	
	if ( languageDiv.className != "d-none" ) {
		y += parseFloat( languageDiv.style.height );
		y += parseFloat( languageDiv.style.marginBottom );
	}

	y += row1.height;
	y += 0.015 * _.baseWidth;
	
	window.scrollTo( { left: window.scrollX, top: y, behavior: "smooth" } );
}


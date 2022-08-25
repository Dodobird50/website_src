var _ = window._

$( document ).ready( function() {
	select0.onchange = function() {
		_.userSettings.language = select0.value;
		
		_.setTitle();
		if ( updateDiv.className != "d-none" ) {
			_.setUpdateNotificationInnerHTML();
			_.setDismissUpdateButtonInnerHTML();
			
			// Since updateNotification.innerHTML changed, width and/or height of updateNotification will have changed too
			dismissUpdateButton.style.height = updateNotification.offsetHeight + "px";
			var combinedWidth = updateNotification.offsetWidth + dismissUpdateButton.offsetWidth;
			var updateNotificationLeft = ( 0.97 * _.baseWidth - combinedWidth ) / 2;
			updateNotification.style.left = updateNotificationLeft + "px";
			dismissUpdateButton.style.right = updateNotificationLeft + "px";
			updateDiv.style.height = updateNotification.offsetHeight + "px";
		}
		if ( languageDiv.className != "d-none" ) {
			_.setConfirmLanguageButtonInnerHTML();
		}
		
		_.setLastUpdatedOnText();
		_.setToggleNightModeButtonInnerHTML();
		_.setIndicateUpdatedStatesCheckboxLabelInnerHTML();
		_.setResetChartsButtonInnerHTML();
		_.setTimeTravelRangeLabelInnerHTML();
		
		for ( var i = 0; i < select2.children.length; i++ ) {
			var option = select2.children[i];
			var state = _.stateFromAbbreviation ( option.value );
			option.innerHTML = _.translateState( state );
		}
		
		_.updateCookies();
		_.dataDisplayHeaderHTML = _.dataDisplayHeaderHTMLs[_.languageIndex()];
		setTimeout( function() {
			_.refreshDataDisplay();
			_.loadColB();
			
			// Reset checkboxLabelWidth, as it will be different in a new language
			_.checkboxLabelWidth = null;
			for ( var i = 0; i < _.charts.length; i++ ) {
				var checked = i % 2 == 1 && _.charts[i].checkbox.checked;
	
				_.makeChart( _.charts[i], _.charts[i].state, false );
				if ( checked ) {
					_.charts[i].checkbox.checked = true;
					_.charts[i].checkbox.onclick();
				}
			}
		}, 1 );
	}
	
	confirmLanguageButton.onclick = function() {
		_.userSettings.hideLanguageDiv = true;
		languageDiv.className = "d-none";
		_.updateCookies();
	}

	toggleNightModeButton.onclick = function() {
		_.userSettings.isNightMode = !_.userSettings.isNightMode;
		if ( !_.userSettings.isNightMode ) {
			document.getElementsByTagName( "body" )[0].style.backgroundColor = "";
			
			updateNotification.style.color = "";
			
			rowA1.style.borderColor = "";
			rowA1.style.color = "";
			rowA2.style.color = "";
			for ( var i = 0; i < colB.children.length; i++ ) {
				var child = colB.children[i];
				if ( child.className == "state-data-box" ) {
					child.style.borderColor = "";
					child.style.backgroundColor = "";
					child.style.color = "";
				}
				else if ( child.className == "circle" ) {
					if ( child.stateDataBox ) {
						// child.stateDataBox may not be on colB right now
						var box = child.stateDataBox;
						box.style.borderColor = "";
						box.style.backgroundColor = "";
						box.style.color = "";
					}
				}
			}
			indicateUpdatedStatesCheckboxLabel.style.color = "";
			
			timeTravelDiv.style.backgroundColor = "white";
			timeTravelRangeLabel.style.color = "";
		}
		else {
			document.getElementsByTagName( "body" )[0].style.backgroundColor = "black";
			
			updateNotification.style.color = "lightgray";
			
			rowA1.style.borderColor = "lightgray";
			rowA1.style.color = "lightgray";
			rowA2.style.color = "lightgray";
			for ( var i = 0; i < colB.children.length; i++ ) {
				var child = colB.children[i];
				if ( child.className == "state-data-box" ) {
					child.style.borderColor = "lightgray";
					child.style.backgroundColor = "rgb(0,0,75)";
					child.style.color = "lightgray";
				}
				else if ( child.className == "circle" ) {
					if ( child.stateDataBox ) {
						var box = child.stateDataBox;
						box.style.borderColor = "lightgray";
						box.style.backgroundColor = "rgb(0,0,75)";
						box.style.color = "lightgray";
					}
				}
			}
			indicateUpdatedStatesCheckboxLabel.style.color = "lightgray";
			
			timeTravelDiv.style.backgroundColor = "black";
			timeTravelRangeLabel.style.color = "lightgray";
		}
		
	   _.recolorRows();
		for ( var i = 0; i < _.charts.length; i++ ) {
			if ( _.charts[i].isNightMode != _.userSettings.isNightMode ) {
				_.charts[i].toggleNightMode();
			}
		}
		
		_.setToggleNightModeButtonInnerHTML();
		_.recolorTimeTravelDivBorder();
		_.updateCookies();
	}

	select2.onchange = function() {
		var state = select2.value;
		for ( var i = 0; i < _.charts.length; i++ ) {
			var isChecked = i % 2 == 1 && _.charts[i].checkbox.checked;
			
			_.makeChart( _.charts[i], state, false );
			if ( isChecked ) {
				_.charts[i].checkbox.checked = true;
				_.charts[i].checkbox.onclick();
			}
		}
	};
	resetChartsButton.onclick = _.resetCharts;
} );
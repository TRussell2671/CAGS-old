/*************************************************
* Google Search Toggles
*
* Version: 2.02
* Author: IU Communications
* Author URI: http://communications.iu.edu
*************************************************/

var googleSearchToggles = function() {
	
	// Prettify options
	for(var prop in googleSearchToggleOptions) this[prop] = googleSearchToggleOptions[prop];
	
	// Function: Update search form attributes
	function resetSearchAttr(formObj) {
		formObj.setAttribute('action', searchResultsUrl);
		formObj.removeAttribute('target');
	}
  
	// Function: Add Google branding
	function addGoogleBranding(formKeywordsObj) {
		formKeywordsObj.removeAttribute('placeholder');
		formKeywordsObj.className = (formKeywordsObj.value == '') ? 'branding' : '';
		formKeywordsObj.onfocus = function() { this.className = ''; }
		formKeywordsObj.onblur = function() { if(this.value == '') this.className = 'branding'; }
	}
  
	// Run if search form is in DOM
	if(document.getElementById(searchId)){
		// Set search form as variable
		var searchObj = document.getElementById(searchId);
		// Set search form keyword field as variable
		var searchKeywordsObj;
		if(searchObj.as_q){
			searchKeywordsObj = searchObj.as_q;	
		}
		else {
			searchKeywordsObj = searchObj.q;
		}
		// Update search form attributes
		resetSearchAttr(searchObj);
		// Add Google branding 
		addGoogleBranding(searchKeywordsObj);
	}
	  
	// Run if search results form is in DOM
	if(document.getElementById(searchResultsId)){
		// Set search results form as variable
		var searchResultsObj = document.getElementById(searchResultsId);
		// Set search results form keyword field as variable
		var searchResultsKeywordsObj;
		if(searchResultsObj.as_q){
			searchResultsKeywordsObj = searchResultsObj.as_q;	
		}
		else {
			searchResultsKeywordsObj = searchResultsObj.q;
		}
		// Update search form attributes
		resetSearchAttr(searchResultsObj);
		
		// Get URL parameters
		var vars = {};
		var isBlank = false;
		window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		this.vars = vars;
		// Get keywords and toggle choice from URL parameters and unescape GCS account ID
		if(searchResultsObj.as_q) {
			if(this.vars['as_q']){
				this.vars['as_q'] = unescape(this.vars['as_q']);
			}
			else {
				isBlank=true;
			}
			this.vars['q'] = decodeURI(unescape(this.vars['q']));
		}
		else {
			this.vars['q'] = unescape(this.vars['q']);
		}
		this.vars['cx'] = unescape(this.vars['cx']);
	  
		// Function: Find and set toggle choice
		function getToggleChoice() {
			var radios = '';
			var scope = '';
			// First hit 
			if(searchResultsObj.as_q) {
				scope = this.vars['q'];
				radios = searchResultsObj.q;
			}
			else {
				scope = this.vars['cx'];
				radios = searchResultsObj.cx;
			}
			// Second hit
			if(this.vars['scope']) {
				scope = this.vars['q'].split('+');
				scope = scope[0];
				radios = searchResultsObj.q;
			}
			if(this.vars['custom']) {
				scope = this.vars['cx'];
				radios = searchResultsObj.cx;	
			}
			for(i = 0; i < radios.length; i++) {
				radios[i].checked=false;
				if(unescape(radios[i].value) == scope || decodeURI(unescape(radios[i].value)) == scope || radios[i].value == scope) {
					radios[i].checked=true;
				}
			}
		}
	  
		// First hit to results page = add keywords to results form keyword field, redirect to new URL string to update search results, and update site selection from URL parameters
		if(this.vars['nojs']) {
			getToggleChoice();
			if(this.vars['as_q'] || isBlank==true) {
				window.location = this.searchResultsUrl + '?q=' + this.vars['q'] + '+' + this.vars['as_q'] + '&cx=' + this.vars['cx'] + '&scope=1&js=1';
				searchResultsKeywordsObj.setAttribute('value', this.vars['as_q'].replace(/\+/g, ' '));
			}
			else {
				window.location = this.searchResultsUrl + '?q=' + this.vars['q'] + '&cx=' + this.vars['cx'] + '&custom=1&js=1';
				searchResultsKeywordsObj.setAttribute('value', this.vars['q'].replace(/\+/g, ' '));
			}
		}

		// Second hit to results page = update keyword from URL parameters, add keywords results to form keyword field, and update site selection from URL parameters
		if(this.vars['js']) {
			getToggleChoice();
			if(this.vars['scope']) {
				var parts = this.vars['q'].split('+');
				var keywords = '';
				for(i = 1; i < parts.length; i++) {
					keywords += parts[i]+" ";
				}
			}
			else {
				keywords = this.vars['q'];
				keywords = keywords.replace(/\+/g, ' ');
			}	
			// Strip leading and trailing spaces
			keywords = keywords.replace(/^\s+|\s+$/g,'');
			searchResultsKeywordsObj.setAttribute('value', keywords);
	
			// Start Google Custom Search code
			var myCallback = function() {
				if (document.readyState == 'complete') {
					google.search.cse.element.render({
						div: 'gcse-searchbox',
						tag: 'searchresults-only',
						attributes: {
							enableHistory: true,
							autoSearchOnLoad: true,
							queryParameterName: 'q',
							gaQueryParameter: 'q'
						 }
					});	
				} else {
					google.setOnLoadCallback(function() {
						google.search.cse.element.render({
							div: 'gcse-searchbox',
							tag: 'searchresults-only',
							attributes: {
								enableHistory: true,
								autoSearchOnLoad: true,
								queryParameterName: 'q',
								gaQueryParameter: 'q'
							}
						});
				}, true);
			}};
			window.__gcse = {
				parsetags: 'explicit',
				callback: myCallback
			};
			(function() {
				var gcse = document.createElement('script'); gcse.type = 'text/javascript';
				gcse.async = true;
				gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//www.google.com/cse/cse.js?cx=' + this.vars['cx'];
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gcse, s);
			})();
		}	
		
		// Add Google branding 
		addGoogleBranding(searchResultsKeywordsObj);
	}
}
window.addEventListener ? 
window.addEventListener("load", googleSearchToggles, false) : 
window.attachEvent && window.attachEvent("onload", googleSearchToggles);
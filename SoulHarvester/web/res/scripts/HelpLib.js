
/**
 * Loads an HTML element
 * 
 * @param id The elements id
 * @returns A reference to the element
 */
function lHtml(id) {
	return document.getElementById(id);
};

/**
 * Capitalizes the first letter of a string
 * @param str The string
 * @returns	The capitalized string
 */
function captalize(str) {
	return str.charAt(0).toUpperCase + str.slice(1);
};

/**
 * Determines if browser supports local storage
 * 
 * @returns {Boolean} true if browser supports local storage
 */
function supportsLocalStorage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
};

/**
 * Formats a number
 * 
 * @param num The number to be formated
 * @returns The formated number
 */
function formatNumber(num) {
	var order = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx"];
	var i = 0;
	var fix = 3;
	if(num < 1000) fix = 0;
	while(num > 999) {
		i++;
		num /= 1000;
	}
	if(num.toFixed(3) - num.toFixed(0) == 0) fix = 0;
	else if(fix && (num.toFixed(3) - num.toFixed(1) == 0)) fix = 1;
	else if(fix && (num.toFixed(3) - num.toFixed(2) == 0)) fix = 2;

	return num.toFixed(fix)+order[i];
};
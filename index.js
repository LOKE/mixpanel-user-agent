'use strict';

var KEY_BROWSER         = '$browser';
var KEY_BROWSER_VERSION = '$browser_version';
var KEY_OS              = '$os';
var KEY_DEVICE          = '$device';

// Based on https://github.com/mixpanel/mixpanel-js

/**
 * Get (or copy) the event fields from a User-Agent value
 * @param  {String} userAgent - from req.headers['user-agent']
 * @param  {Object} [target] - object to copy fields to
 * @return {Object} object with fields
 */
module.exports = function getFieldsForUserAgentString(userAgent, target) {
  var browser = getBrowser(userAgent);
  var obj = target || {};

  obj[KEY_BROWSER]         = browser;
  obj[KEY_BROWSER_VERSION] = getBrowserVersion(browser, userAgent);
  obj[KEY_OS]              = getOS(userAgent);
  obj[KEY_DEVICE]          = getDevice(userAgent);

  return obj;
};

function includes(str, needle) {
  return str.indexOf(needle) !== -1;
}

/**
 * This function detects which browser is running this script.
 * The order of the checks are important since many user agents
 * include key words used in later checks.
 */
function getBrowser(ua) {
  if (includes(ua, ' OPR/')) {
    if (includes(ua, 'Mini')) {
      return 'Opera Mini';
    }
    return 'Opera';
  } else if (/(BlackBerry|PlayBook|BB10)/i.test(ua)) {
    return 'BlackBerry';
  } else if (includes(ua, 'IEMobile') || includes(ua, 'WPDesktop')) {
    return 'Internet Explorer Mobile';
  } else if (includes(ua, 'Edge')) {
    return 'Microsoft Edge';
  } else if (includes(ua, 'FBIOS')) {
    return 'Facebook Mobile';
  } else if (includes(ua, 'Chrome')) {
    return 'Chrome';
  } else if (includes(ua, 'CriOS')) {
    return 'Chrome iOS';
  } else if (/iPhone.+Safari/.test(ua) && includes(ua, 'Mobile')) {
    return 'Mobile Safari';
  } else if (includes(ua, 'Safari')) {
    return 'Safari';
  } else if (includes(ua, 'Android')) {
    return 'Android Mobile';
  } else if (includes(ua, 'Konqueror')) {
    return 'Konqueror';
  } else if (includes(ua, 'Firefox')) {
    return 'Firefox';
  } else if (includes(ua, 'MSIE') || includes(ua, 'Trident/')) {
    return 'Internet Explorer';
  } else if (includes(ua, 'Gecko')) {
    return 'Mozilla';
  }
}
/**
  * This function detects which browser version is running this script,
  * parsing major and minor version (e.g., 42.1). User agent strings from:
  * http://www.uastring.com/pages/uastring.php
  */
function getBrowserVersion(browser, ua) {
  var versionRegexs = {
    'Internet Explorer Mobile': /rv:(\d+(\.\d+)?)/,
    'Microsoft Edge':           /Edge\/(\d+(\.\d+)?)/,
    'Chrome':                   /Chrome\/(\d+(\.\d+)?)/,
    'Chrome iOS':               /Chrome\/(\d+(\.\d+)?)/,
    'Safari':                   /Version\/(\d+(\.\d+)?)/,
    'Mobile Safari':            /Version\/(\d+(\.\d+)?)/,
    'Opera':                    /(Opera|OPR)\/(\d+(\.\d+)?)/,
    'Firefox':                  /Firefox\/(\d+(\.\d+)?)/,
    'Konqueror':                /Konqueror:(\d+(\.\d+)?)/,
    'BlackBerry':               /BlackBerry (\d+(\.\d+)?)/,
    'Android Mobile':           /android\s(\d+(\.\d+)?)/,
    'Internet Explorer':        /(rv:|MSIE )(\d+(\.\d+)?)/,
    'Mozilla':                  /rv:(\d+(\.\d+)?)/
  };
  var regex = versionRegexs[browser];
  if (!regex) {
    return null;
  }
  var matches = ua.match(regex);
  if (!matches) {
    return null;
  }
  return parseFloat(matches[matches.length - 2]);
}
function getOS(ua) {
  if (/Windows/i.test(ua)) {
    if (/Phone/.test(ua) || /WPDesktop/.test(ua)) { return 'Windows Phone'; }
    return 'Windows';
  } else if (/(iPhone|iPad|iPod)/.test(ua)) {
    return 'iOS';
  } else if (/Android/.test(ua)) {
    return 'Android';
  } else if (/(BlackBerry|PlayBook|BB10)/i.test(ua)) {
    return 'BlackBerry';
  } else if (/Mac/i.test(ua)) {
    return 'Mac OS X';
  } else if (/Linux/.test(ua)) {
    return 'Linux';
  }
}

function getDevice(ua) {
  if (/iPad/.test(ua)) {
    return 'iPad';
  } else if (/iPod/.test(ua)) {
    return 'iPod Touch';
  } else if (/Windows Phone/i.test(ua) || /WPDesktop/.test(ua)) {
    return 'Windows Phone';
  } else if (/iPhone/.test(ua)) {
    return 'iPhone';
  } else if (/(BlackBerry|PlayBook|BB10)/i.test(ua)) {
    return 'BlackBerry';
  } else if (/Android/.test(ua)) {
    return 'Android';
  }
}

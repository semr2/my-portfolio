/**
 * Minimal, self-contained SCORM 2004 (3rd/4th Ed) RTE wrapper.
 * Talks only to the LMS-provided API_1484_11 object found by searching
 * this window / its parents / its opener. Makes no network requests
 * of its own — this is the piece that used to be a remote <script> tag.
 */
(function (global) {
  "use strict";

  var API = null;
  var initialized = false;
  var findAttempts = 0;
  var MAX_FIND_ATTEMPTS = 500;

  function findAPI(win) {
    findAttempts++;
    if (findAttempts > MAX_FIND_ATTEMPTS) return null;
    if (win.API_1484_11) return win.API_1484_11;
    if (win.parent && win.parent !== win) return findAPI(win.parent);
    return null;
  }

  function locateAPI() {
    findAttempts = 0;
    var found = findAPI(global);
    if (!found && global.opener) {
      findAttempts = 0;
      found = findAPI(global.opener);
    }
    return found;
  }

  var ScormAPI = {
    isAvailable: function () {
      return !!API;
    },

    init: function () {
      API = locateAPI();
      if (!API) {
        console.warn("[SCORM] No LMS API found — running in standalone/preview mode.");
        return false;
      }
      var result = API.Initialize("");
      initialized = result === "true" || result === true;
      if (!initialized) {
        console.warn("[SCORM] Initialize() failed:", this.getLastError());
      }
      return initialized;
    },

    terminate: function () {
      if (!API || !initialized) return;
      API.Terminate("");
      initialized = false;
    },

    get: function (key) {
      if (!API) return "";
      var value = API.GetValue(key);
      return value === undefined ? "" : value;
    },

    set: function (key, value) {
      if (!API) return false;
      var result = API.SetValue(key, value);
      return result === "true" || result === true;
    },

    commit: function () {
      if (!API) return false;
      var result = API.Commit("");
      return result === "true" || result === true;
    },

    getLastError: function () {
      if (!API) return "";
      var code = API.GetLastError();
      return code + ": " + API.GetErrorString(code);
    }
  };

  // Make sure we tell the LMS we're done, even on a hard navigation/close.
  global.addEventListener("beforeunload", function () {
    ScormAPI.commit();
    ScormAPI.terminate();
  });

  global.ScormAPI = ScormAPI;
})(window);

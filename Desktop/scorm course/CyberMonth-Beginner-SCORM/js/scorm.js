/**
 * Cyber Month Ethiopia — Beginner Cybersecurity Awareness
 * SCORM 1.2 LMS communication wrapper
 *
 * Discovers window.API (SCORM 1.2 only). Does not use API_1484_11.
 * Safe to load outside an LMS (local/test mode is not LMS tracking).
 *
 * Public API (window.SCORM):
 *   initialize(), getValue(element), setValue(element, value),
 *   commit(), terminate(), getLastError(), getErrorString(errorCode),
 *   getDiagnostic(errorCode), isLocalMode(), isInitialized(), getMode()
 */
(function (window) {
  "use strict";

  var MAX_FRAME_DEPTH = 500;
  var EMPTY_STRING_ARG = "";

  var MODE_SCORM = "scorm";
  var MODE_LOCAL = "local";

  var LOG_PREFIX_SCORM = "[SCORM 1.2]";
  var LOG_PREFIX_LOCAL = "[SCORM 1.2 local/test]";

  /**
   * Common SCORM 1.2 CMI elements this course expects to use.
   * Listed for documentation; the LMS validates actual element names.
   */
  var CMI_CORE_STUDENT_ID = "cmi.core.student_id";
  var CMI_CORE_STUDENT_NAME = "cmi.core.student_name";
  var CMI_CORE_LESSON_STATUS = "cmi.core.lesson_status";
  var CMI_CORE_LESSON_LOCATION = "cmi.core.lesson_location";
  var CMI_CORE_SCORE_RAW = "cmi.core.score.raw";
  var CMI_CORE_SCORE_MIN = "cmi.core.score.min";
  var CMI_CORE_SCORE_MAX = "cmi.core.score.max";
  var CMI_CORE_SESSION_TIME = "cmi.core.session_time";
  var CMI_SUSPEND_DATA = "cmi.suspend_data";
  var CMI_CORE_EXIT = "cmi.core.exit";

  var SCORM_ERROR_STRINGS = {
    "0": "No Error",
    "101": "General Exception",
    "201": "Invalid argument error",
    "202": "Element cannot have children",
    "203": "Element not an array - cannot have count",
    "301": "Not initialized",
    "351": "Not implemented error",
    "401": "Not implemented error",
    "402": "Invalid set value, element is a keyword",
    "403": "Element is read only",
    "404": "Element is write only",
    "405": "Incorrect Data Type"
  };

  var api = null;
  var mode = MODE_LOCAL;
  var initialized = false;
  var terminated = false;
  var lastLocalError = "0";
  var localStore = {};

  function logInfo(message) {
    if (window.console && typeof window.console.info === "function") {
      window.console.info((isLocal() ? LOG_PREFIX_LOCAL : LOG_PREFIX_SCORM) + " " + message);
    }
  }

  function logWarn(message) {
    if (window.console && typeof window.console.warn === "function") {
      window.console.warn((isLocal() ? LOG_PREFIX_LOCAL : LOG_PREFIX_SCORM) + " " + message);
    }
  }

  function isLocal() {
    return mode === MODE_LOCAL;
  }

  function toBoolean(lmsString) {
    return String(lmsString).toLowerCase() === "true";
  }

  function toStringValue(value) {
    if (value === null || value === undefined) {
      return "";
    }
    return String(value);
  }

  /**
   * True when win looks like a SCORM 1.2 API adapter (window.API).
   */
  function isScorm12Api(candidate) {
    if (!candidate || typeof candidate !== "object") {
      return false;
    }
    return (
      typeof candidate.LMSInitialize === "function" &&
      typeof candidate.LMSGetValue === "function" &&
      typeof candidate.LMSSetValue === "function" &&
      typeof candidate.LMSCommit === "function" &&
      typeof candidate.LMSFinish === "function"
    );
  }

  /**
   * Read window.API from a frame without throwing on cross-origin access.
   */
  function readApiFromWindow(win) {
    if (!win) {
      return null;
    }
    try {
      if (isScorm12Api(win.API)) {
        return win.API;
      }
    } catch (err) {
      return null;
    }
    return null;
  }

  /**
   * Walk parent frames looking for window.API. Stops on self-parent, max depth, or origin errors.
   */
  function findApiInOpenerChain(startWindow) {
    var current = startWindow;
    var depth = 0;

    while (current && depth <= MAX_FRAME_DEPTH) {
      var found = readApiFromWindow(current);
      if (found) {
        return found;
      }

      var parentWindow = null;
      try {
        parentWindow = current.parent;
      } catch (err) {
        return null;
      }

      if (!parentWindow || parentWindow === current) {
        return null;
      }

      current = parentWindow;
      depth += 1;
    }

    return null;
  }

  /**
   * Discover the SCORM 1.2 API:
   * current window, parent frames, then opener (and its parents) if present.
   */
  function findAPI() {
    var found = findApiInOpenerChain(window);
    if (found) {
      return found;
    }

    try {
      if (window.opener && window.opener !== window) {
        found = findApiInOpenerChain(window.opener);
        if (found) {
          return found;
        }
      }
    } catch (err) {
      // Opener may be cross-origin; continue without an API.
    }

    return null;
  }

  function setLocalError(code) {
    lastLocalError = String(code);
  }

  /**
   * Invoke an LMS adapter method. Missing methods are programming/contract errors
   * and are thrown. Exceptions thrown by the LMS itself are caught so the course
   * can keep running.
   */
  function callLms(methodName, args) {
    if (!api || typeof api[methodName] !== "function") {
      throw new Error("SCORM 1.2 API method is missing: " + methodName);
    }

    try {
      return api[methodName].apply(api, args || []);
    } catch (err) {
      lastLocalError = "101";
      logWarn(
        "The LMS threw while calling " +
          methodName +
          ": " +
          (err && err.message ? err.message : String(err))
      );
      if (methodName === "LMSGetValue" || methodName === "LMSGetErrorString" || methodName === "LMSGetDiagnostic") {
        return "";
      }
      if (methodName === "LMSGetLastError") {
        return "101";
      }
      return "false";
    }
  }

  /**
   * Start a communication session with the LMS, or enter local/test mode.
   * @returns {boolean}
   */
  function initialize() {
    if (terminated) {
      logWarn("initialize() called after terminate(); a new session cannot be started in this page load.");
      setLocalError("101");
      return false;
    }

    if (initialized) {
      logInfo("initialize() ignored; session already started (" + mode + " mode).");
      return true;
    }

    api = findAPI();

    if (!api) {
      mode = MODE_LOCAL;
      initialized = true;
      setLocalError("0");
      logWarn(
        "No window.API found. Running in local/test mode. " +
          "Values are kept in memory only and are not sent to an LMS."
      );
      return true;
    }

    mode = MODE_SCORM;
    var result = callLms("LMSInitialize", [EMPTY_STRING_ARG]);
    initialized = toBoolean(result);

    if (!initialized) {
      logWarn("LMSInitialize did not return true. Falling back to local/test mode.");
      mode = MODE_LOCAL;
      api = null;
      initialized = true;
      setLocalError("101");
      return true;
    }

    setLocalError("0");
    logInfo("LMSInitialize succeeded. Real SCORM 1.2 tracking is active.");
    return true;
  }

  /**
   * Read a SCORM 1.2 data model element (for example cmi.core.lesson_status).
   * Local/test mode returns "" unless a value was set earlier in this page load.
   * @param {string} element
   * @returns {string}
   */
  function getValue(element) {
    if (!initialized) {
      logWarn("getValue() called before initialize().");
      setLocalError("301");
      return "";
    }

    if (isLocal()) {
      setLocalError("0");
      if (Object.prototype.hasOwnProperty.call(localStore, element)) {
        return localStore[element];
      }
      return "";
    }

    var value = callLms("LMSGetValue", [element]);
    return value == null ? "" : String(value);
  }

  /**
   * Write a SCORM 1.2 data model element.
   * Local/test mode stores the pair in memory only.
   * @param {string} element
   * @param {string|number|boolean} value
   * @returns {boolean}
   */
  function setValue(element, value) {
    if (!initialized) {
      logWarn("setValue() called before initialize().");
      setLocalError("301");
      return false;
    }

    var stringValue = toStringValue(value);

    if (isLocal()) {
      localStore[element] = stringValue;
      setLocalError("0");
      logInfo("setValue (not sent to LMS): " + element + " = " + stringValue);
      return true;
    }

    var result = callLms("LMSSetValue", [element, stringValue]);
    var ok = toBoolean(result);
    if (!ok) {
      logWarn("LMSSetValue failed for " + element + " (LMS last error: " + getLastError() + ").");
    }
    return ok;
  }

  /**
   * Persist pending values to the LMS (no-op persist in local/test mode).
   * @returns {boolean}
   */
  function commit() {
    if (!initialized) {
      logWarn("commit() called before initialize().");
      setLocalError("301");
      return false;
    }

    if (isLocal()) {
      setLocalError("0");
      logInfo("commit() skipped; local/test mode does not persist to an LMS.");
      return true;
    }

    var result = callLms("LMSCommit", [EMPTY_STRING_ARG]);
    var ok = toBoolean(result);
    if (!ok) {
      logWarn("LMSCommit failed (LMS last error: " + getLastError() + ").");
    }
    return ok;
  }

  /**
   * End the SCORM session (LMSFinish). Safe to call more than once.
   * @returns {boolean}
   */
  function terminate() {
    if (terminated) {
      return true;
    }

    if (!initialized) {
      logWarn("terminate() called before initialize().");
      setLocalError("301");
      return false;
    }

    if (isLocal()) {
      terminated = true;
      setLocalError("0");
      logInfo("terminate() finished local/test session. No LMS was contacted.");
      return true;
    }

    var result = callLms("LMSFinish", [EMPTY_STRING_ARG]);
    var ok = toBoolean(result);
    if (ok) {
      terminated = true;
      logInfo("LMSFinish succeeded.");
    } else {
      logWarn("LMSFinish failed (LMS last error: " + getLastError() + ").");
    }
    return ok;
  }

  /**
   * Last SCORM error code as a string (for example "0" or "301").
   * @returns {string}
   */
  function getLastError() {
    if (isLocal() || !api) {
      return lastLocalError;
    }
    var code = callLms("LMSGetLastError", []);
    return code == null ? "0" : String(code);
  }

  /**
   * Human-readable description of a SCORM 1.2 error code.
   * @param {string|number} errorCode
   * @returns {string}
   */
  function getErrorString(errorCode) {
    var code = String(errorCode);

    if (!isLocal() && api && typeof api.LMSGetErrorString === "function") {
      var fromLms = callLms("LMSGetErrorString", [code]);
      if (fromLms) {
        return String(fromLms);
      }
    }

    if (Object.prototype.hasOwnProperty.call(SCORM_ERROR_STRINGS, code)) {
      return SCORM_ERROR_STRINGS[code];
    }
    return "Unknown error code";
  }

  /**
   * LMS-specific diagnostic text for an error code, when available.
   * @param {string|number} errorCode
   * @returns {string}
   */
  function getDiagnostic(errorCode) {
    var code = String(errorCode);

    if (isLocal() || !api) {
      if (mode === MODE_LOCAL) {
        return "Local/test mode: no LMS diagnostic. Course is not communicating with a SCORM API.";
      }
      return "";
    }

    if (typeof api.LMSGetDiagnostic === "function") {
      var fromLms = callLms("LMSGetDiagnostic", [code]);
      return fromLms == null ? "" : String(fromLms);
    }

    return "";
  }

  window.SCORM = {
    initialize: initialize,
    getValue: getValue,
    setValue: setValue,
    commit: commit,
    terminate: terminate,
    getLastError: getLastError,
    getErrorString: getErrorString,
    getDiagnostic: getDiagnostic,

    isLocalMode: isLocal,
    isInitialized: function () {
      return initialized;
    },
    getMode: function () {
      return mode;
    },

    CMI: {
      STUDENT_ID: CMI_CORE_STUDENT_ID,
      STUDENT_NAME: CMI_CORE_STUDENT_NAME,
      LESSON_STATUS: CMI_CORE_LESSON_STATUS,
      LESSON_LOCATION: CMI_CORE_LESSON_LOCATION,
      SCORE_RAW: CMI_CORE_SCORE_RAW,
      SCORE_MIN: CMI_CORE_SCORE_MIN,
      SCORE_MAX: CMI_CORE_SCORE_MAX,
      SESSION_TIME: CMI_CORE_SESSION_TIME,
      SUSPEND_DATA: CMI_SUSPEND_DATA,
      EXIT: CMI_CORE_EXIT
    }
  };
})(window);

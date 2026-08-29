/**
 * Cyber Month Ethiopia — course shell
 * Uses window.SCORM (SCORM 1.2). Does not implement an LMS API.
 *
 * Opening a module sets In Progress only. Completion is for later lesson/assessment steps.
 */
(function (window, document) {
  "use strict";

  var LOG_PREFIX = "[Course]";
  var TOTAL_MODULES = 7;
  var STATUS_NOT_STARTED = "not-started";
  var STATUS_IN_PROGRESS = "in-progress";
  var STATUS_COMPLETED = "completed";
  var LOCATION_HOME = "home";
  var ALLOWED_STATUSES = {};
  ALLOWED_STATUSES[STATUS_NOT_STARTED] = true;
  ALLOWED_STATUSES[STATUS_IN_PROGRESS] = true;
  ALLOWED_STATUSES[STATUS_COMPLETED] = true;

  var MODULES = [
    {
      id: "module01",
      number: "01",
      title: "Introduction to Cybersecurity",
      href: "modules/module01/index.html"
    },
    {
      id: "module02",
      number: "02",
      title: "Password & Account Security",
      href: "modules/module02/index.html"
    },
    {
      id: "module03",
      number: "03",
      title: "Phishing",
      href: "modules/module03/index.html"
    },
    {
      id: "module04",
      number: "04",
      title: "Social Engineering",
      href: "modules/module04/index.html"
    },
    {
      id: "module05",
      number: "05",
      title: "Device & Internet Security",
      href: "modules/module05/index.html"
    },
    {
      id: "module06",
      number: "06",
      title: "Data Protection",
      href: "modules/module06/index.html"
    },
    {
      id: "assessment",
      number: "07",
      title: "Final Assessment",
      href: "assessment/index.html"
    }
  ];

  var state = {
    currentId: LOCATION_HOME,
    statuses: {},
    lessonStatus: "not attempted",
    viewingHome: true
  };

  function logInfo(message) {
    if (window.console && typeof window.console.info === "function") {
      window.console.info(LOG_PREFIX + " " + message);
    }
  }

  function logWarn(message) {
    if (window.console && typeof window.console.warn === "function") {
      window.console.warn(LOG_PREFIX + " " + message);
    }
  }

  function logError(message) {
    if (window.console && typeof window.console.error === "function") {
      window.console.error(LOG_PREFIX + " " + message);
    }
  }

  function requireScorm() {
    if (!window.SCORM) {
      throw new Error("window.SCORM is missing. js/scorm.js must load before js/course.js.");
    }
    return window.SCORM;
  }

  function moduleIndex(moduleId) {
    var i;
    for (i = 0; i < MODULES.length; i += 1) {
      if (MODULES[i].id === moduleId) {
        return i;
      }
    }
    return -1;
  }

  function getModule(moduleId) {
    var index = moduleIndex(moduleId);
    return index === -1 ? null : MODULES[index];
  }

  function defaultStatuses() {
    var map = {};
    var i;
    for (i = 0; i < MODULES.length; i += 1) {
      map[MODULES[i].id] = STATUS_NOT_STARTED;
    }
    return map;
  }

  function normalizeStatus(value) {
    if (ALLOWED_STATUSES[value]) {
      return value;
    }
    return STATUS_NOT_STARTED;
  }

  function parseSuspendData(raw) {
    var parsed;
    var id;
    var next = defaultStatuses();

    if (!raw) {
      return { currentId: LOCATION_HOME, statuses: next };
    }

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      logWarn("cmi.suspend_data was not valid JSON. Starting with empty progress.");
      return { currentId: LOCATION_HOME, statuses: next };
    }

    if (parsed && parsed.statuses && typeof parsed.statuses === "object") {
      for (id in parsed.statuses) {
        if (Object.prototype.hasOwnProperty.call(next, id)) {
          next[id] = normalizeStatus(parsed.statuses[id]);
        }
      }
    }

    return {
      currentId: parsed && parsed.currentId ? String(parsed.currentId) : LOCATION_HOME,
      statuses: next
    };
  }

  function serializeSuspendData() {
    return JSON.stringify({
      currentId: state.currentId,
      statuses: state.statuses
    });
  }

  function setModeBanner() {
    var banner = document.getElementById("mode-banner");
    var scorm = window.SCORM;
    if (!banner || !scorm) {
      return;
    }

    if (scorm.isLocalMode()) {
      banner.className = "mode-banner mode-banner--local";
      banner.textContent =
        "Local / test mode — this browser session is not connected to an LMS. Progress is kept in memory only and is not SCORM tracking.";
      return;
    }

    banner.className = "mode-banner mode-banner--scorm";
    banner.textContent = "SCORM 1.2 mode — connected to an LMS. Progress can be stored by the learning platform.";
  }

  function setLearnerGreeting() {
    var el = document.getElementById("learner-greeting");
    var name;
    if (!el) {
      return;
    }
    name = window.SCORM.getValue(window.SCORM.CMI.STUDENT_NAME);
    if (name) {
      el.hidden = false;
      el.textContent = "Learner: " + name;
    }
  }

  function statusLabel(status) {
    if (status === STATUS_COMPLETED) {
      return "Completed";
    }
    if (status === STATUS_IN_PROGRESS) {
      return "In Progress";
    }
    return "Not Started";
  }

  /**
   * Count only modules explicitly marked complete. Opening a module does not count.
   */
  function getCourseProgress() {
    var completed = 0;
    var i;
    var id;

    for (i = 0; i < MODULES.length; i += 1) {
      id = MODULES[i].id;
      if (state.statuses[id] === STATUS_COMPLETED) {
        completed += 1;
      }
    }

    return {
      completed: completed,
      total: TOTAL_MODULES,
      percent: Math.round((completed / TOTAL_MODULES) * 100)
    };
  }

  function updateNavButtons() {
    var prev = document.getElementById("btn-prev");
    var next = document.getElementById("btn-next");
    var overview = document.getElementById("btn-overview");
    var currentIndex;
    var atHome = state.viewingHome;

    if (overview) {
      overview.disabled = atHome;
    }

    if (prev) {
      prev.disabled = atHome;
    }

    if (next) {
      if (atHome) {
        next.disabled = false;
      } else {
        currentIndex = moduleIndex(state.currentId);
        next.disabled = currentIndex === MODULES.length - 1;
      }
    }
  }

  function updateCardStatus(card, moduleId) {
    var status = state.statuses[moduleId] || STATUS_NOT_STARTED;
    var badge = card.querySelector("[data-status]");
    var button = card.querySelector(".js-open-module");
    var isCurrent = !state.viewingHome && state.currentId === moduleId;

    card.className =
      "module-card" +
      (moduleId === "assessment" ? " module-card--assessment" : "") +
      (isCurrent ? " module-card--current" : "");

    if (badge) {
      badge.className = "status status--" + status;
      badge.textContent = statusLabel(status);
    }

    if (button) {
      button.textContent = status === STATUS_NOT_STARTED ? "Open" : "Continue";
    }
  }

  function updateProgressUI() {
    var progress = getCourseProgress();
    var label = document.getElementById("progress-label");
    var fill = document.getElementById("progress-fill");
    var bar = document.getElementById("progress-bar");
    var percentEl = document.getElementById("progress-percent");
    var cards;
    var i;
    var card;
    var moduleId;

    if (label) {
      label.textContent = "Progress: " + progress.completed + " of " + progress.total + " completed";
    }
    if (fill) {
      fill.style.width = progress.percent + "%";
    }
    if (bar) {
      bar.setAttribute("aria-valuenow", String(progress.percent));
    }
    if (percentEl) {
      percentEl.textContent = progress.percent + "%";
    }

    cards = document.querySelectorAll("#module-grid .module-card[data-module-id]");
    for (i = 0; i < cards.length; i += 1) {
      card = cards[i];
      moduleId = card.getAttribute("data-module-id");
      if (moduleId) {
        updateCardStatus(card, moduleId);
      }
    }

    updateNavButtons();
  }

  function showHomeView() {
    var home = document.getElementById("home-view");
    var moduleView = document.getElementById("module-view");
    state.viewingHome = true;
    if (home) {
      home.hidden = false;
    }
    if (moduleView) {
      moduleView.hidden = true;
    }
    updateProgressUI();
  }

  function showModuleView(moduleId) {
    var home = document.getElementById("home-view");
    var moduleView = document.getElementById("module-view");
    var frame = document.getElementById("module-frame");
    var heading = document.getElementById("module-view-heading");
    var mod = getModule(moduleId);

    if (!mod || !frame) {
      return;
    }

    state.viewingHome = false;
    if (home) {
      home.hidden = true;
    }
    if (moduleView) {
      moduleView.hidden = false;
    }
    if (heading) {
      heading.textContent = "Module " + mod.number + " — " + mod.title;
    }
    frame.title = mod.title;
    frame.setAttribute("src", mod.href);
    updateProgressUI();
  }

  /**
   * Persist bookmark and module statuses. Does not mark the SCO completed
   * from navigation alone; lesson_status stays incomplete until later steps.
   */
  function saveProgress() {
    var scorm = requireScorm();

    scorm.setValue(scorm.CMI.SUSPEND_DATA, serializeSuspendData());
    scorm.setValue(scorm.CMI.LESSON_LOCATION, state.currentId);
    scorm.setValue(scorm.CMI.LESSON_STATUS, "incomplete");
    state.lessonStatus = "incomplete";
    scorm.commit();

    if (scorm.isLocalMode()) {
      logInfo("Progress saved in local/test memory (not sent to an LMS).");
    }
  }

  /**
   * Read lesson_status, lesson_location, and suspend_data from the wrapper.
   */
  function loadProgress() {
    var scorm = requireScorm();
    var rawStatus = scorm.getValue(scorm.CMI.LESSON_STATUS);
    var location = scorm.getValue(scorm.CMI.LESSON_LOCATION);
    var loaded = parseSuspendData(scorm.getValue(scorm.CMI.SUSPEND_DATA));

    state.statuses = loaded.statuses;
    state.lessonStatus = rawStatus || "not attempted";
    state.currentId = location || loaded.currentId || LOCATION_HOME;

    if (state.currentId !== LOCATION_HOME && !getModule(state.currentId)) {
      state.currentId = loaded.currentId && getModule(loaded.currentId) ? loaded.currentId : LOCATION_HOME;
    }
  }

  function markModuleInProgress(moduleId) {
    if (!getModule(moduleId)) {
      return;
    }
    if (state.statuses[moduleId] !== STATUS_COMPLETED) {
      state.statuses[moduleId] = STATUS_IN_PROGRESS;
    }
  }

  /**
   * Reserved for later lesson/assessment steps. The shell does not call this on Open.
   */
  function markModuleComplete(moduleId) {
    if (!getModule(moduleId)) {
      logWarn("markModuleComplete: unknown module id " + moduleId);
      return;
    }
    state.statuses[moduleId] = STATUS_COMPLETED;
    saveProgress();
    updateProgressUI();
  }

  /**
   * Open a module placeholder. Sets In Progress only — never Completed.
   */
  function openModule(moduleId) {
    if (!getModule(moduleId)) {
      logWarn("openModule: unknown module id " + moduleId);
      return;
    }

    state.currentId = moduleId;
    markModuleInProgress(moduleId);
    saveProgress();
    showModuleView(moduleId);
  }

  /**
   * Resume the last location, or start Module 01 from home.
   */
  function continueCourse() {
    if (state.currentId && state.currentId !== LOCATION_HOME && getModule(state.currentId)) {
      openModule(state.currentId);
      return;
    }
    openModule("module01");
  }

  function goPrevious() {
    var index;

    if (state.viewingHome) {
      return;
    }

    index = moduleIndex(state.currentId);
    if (index <= 0) {
      state.currentId = LOCATION_HOME;
      saveProgress();
      showHomeView();
      return;
    }

    openModule(MODULES[index - 1].id);
  }

  function goNext() {
    var index;

    if (state.viewingHome) {
      openModule("module01");
      return;
    }

    index = moduleIndex(state.currentId);
    if (index === -1 || index >= MODULES.length - 1) {
      return;
    }

    openModule(MODULES[index + 1].id);
  }

  function closestOpenButton(target) {
    while (target && target !== document) {
      if (target.getAttribute && target.getAttribute("data-module-id") && target.className && String(target.className).indexOf("js-open-module") !== -1) {
        return target;
      }
      target = target.parentNode;
    }
    return null;
  }

  function bindUi() {
    var grid = document.getElementById("module-grid");
    var prev = document.getElementById("btn-prev");
    var next = document.getElementById("btn-next");
    var continueBtn = document.getElementById("btn-continue");
    var overview = document.getElementById("btn-overview");

    if (grid) {
      grid.addEventListener("click", function (event) {
        var button = closestOpenButton(event.target);
        var id;
        if (button) {
          id = button.getAttribute("data-module-id");
          if (id) {
            openModule(id);
          }
        }
      });
    }

    if (prev) {
      prev.addEventListener("click", goPrevious);
    }
    if (next) {
      next.addEventListener("click", goNext);
    }
    if (continueBtn) {
      continueBtn.addEventListener("click", continueCourse);
    }
    if (overview) {
      overview.addEventListener("click", function () {
        showHomeView();
      });
    }
  }

  function syncLessonStatusOnStart() {
    var scorm = requireScorm();
    var current = scorm.getValue(scorm.CMI.LESSON_STATUS);
    if (!current || current === "not attempted") {
      scorm.setValue(scorm.CMI.LESSON_STATUS, "incomplete");
      state.lessonStatus = "incomplete";
      scorm.commit();
    }
  }

  function initializeCourse() {
    var scorm;
    var banner = document.getElementById("mode-banner");
    var mode;
    var progress;

    try {
      scorm = requireScorm();
    } catch (err) {
      logError(err.message);
      if (banner) {
        banner.className = "mode-banner mode-banner--error";
        banner.textContent = "Course scripts are out of order: scorm.js must load before course.js.";
      }
      throw err;
    }

    scorm.initialize();
    mode = scorm.getMode();
    logInfo("Environment: " + (scorm.isLocalMode() ? "local/test (not LMS tracking)" : "SCORM 1.2 LMS"));
    logInfo("SCORM.getMode() = " + mode);

    setModeBanner();
    loadProgress();
    syncLessonStatusOnStart();
    setLearnerGreeting();
    bindUi();
    updateProgressUI();

    progress = getCourseProgress();
    logInfo("Progress on start: " + progress.completed + " of " + progress.total + " completed");

    if (state.currentId && state.currentId !== LOCATION_HOME && getModule(state.currentId)) {
      showModuleView(state.currentId);
      logInfo("Restored last location: " + state.currentId);
    } else {
      showHomeView();
    }

    window.addEventListener("beforeunload", function () {
      scorm.setValue(scorm.CMI.EXIT, "suspend");
      saveProgress();
      scorm.terminate();
    });
  }

  window.Course = {
    initializeCourse: initializeCourse,
    getCourseProgress: getCourseProgress,
    markModuleComplete: markModuleComplete,
    saveProgress: saveProgress,
    loadProgress: loadProgress,
    updateProgressUI: updateProgressUI,
    openModule: openModule,
    continueCourse: continueCourse
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCourse);
  } else {
    initializeCourse();
  }
})(window, document);

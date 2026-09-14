(function () {
  "use strict";

  // ---------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------

  var LESSONS = [
    {
      id: "phishing",
      number: 1,
      title: "Recognizing phishing",
      intro:
        "Most break-ins don't start with clever hacking — they start with someone opening the wrong email. Phishing messages are built to look routine: an invoice, a delivery notice, a message from IT.",
      points: [
        "Check the sender's actual address, not just the display name — hover before you trust it.",
        "Treat urgency as a warning sign. \u201CAct now or your account is suspended\u201D is a pressure tactic, not a policy.",
        "Never enter your password after clicking a link in an email. Go to the site directly instead.",
        "Unexpected attachments from known contacts are still worth a second look — accounts get compromised too."
      ],
      scenario: {
        label: "Scenario",
        text:
          "You get an email that looks like it's from payroll, asking you to confirm your bank details through a link before Friday's payout. The tone is friendly but firm about the deadline. This is a textbook phishing pattern: a financial hook, a login link, and a deadline that discourages you from checking first."
      },
      check: [
        {
          q: "What's the strongest signal that an email might be phishing?",
          options: [
            "It has a company logo in the header",
            "It creates urgency around a login or payment",
            "It was sent during business hours",
            "It includes an unsubscribe link"
          ],
          answer: 1
        },
        {
          q: "You clicked a link and it's asking for your password. What should you do?",
          options: [
            "Enter it, since you're already on the page",
            "Close the page and log in by typing the site's address yourself",
            "Enter a fake password to test it",
            "Forward it to a coworker to check first"
          ],
          answer: 1
        }
      ]
    },
    {
      id: "passwords",
      number: 2,
      title: "Password & authentication hygiene",
      intro:
        "A stolen password is often worth more to an attacker than a stolen laptop, because it can be reused quietly for months before anyone notices.",
      points: [
        "Use a different password for every account that matters — a password manager makes this realistic.",
        "Turn on multi-factor authentication (MFA) everywhere it's offered, especially email and finance tools.",
        "Length beats complexity: a long passphrase is harder to crack than a short password full of symbols.",
        "Never share a password over chat, email, or phone — legitimate IT staff won't ask for it."
      ],
      scenario: {
        label: "Scenario",
        text:
          "Someone calling from \u201CIT support\u201D asks you to read back the one-time code that just texted to your phone so they can \u201Cverify your account.\u201D That code is the second factor protecting your login — reading it out defeats the whole point of MFA. Hang up and report it."
      },
      check: [
        {
          q: "Which is the better password practice?",
          options: [
            "One strong password reused everywhere so it's easy to remember",
            "A unique password per account, stored in a password manager",
            "Writing passwords on a sticky note by your screen",
            "Changing your password every day"
          ],
          answer: 1
        },
        {
          q: "Someone asks you to read them your MFA code over the phone. You should:",
          options: [
            "Read it, if they sound official",
            "Refuse and report the call",
            "Text it instead of saying it aloud",
            "Ask them to call back later"
          ],
          answer: 1
        }
      ]
    },
    {
      id: "physical",
      number: 3,
      title: "Physical security & tailgating",
      intro:
        "Security isn't only digital. Someone in the building can plug in a device, photograph a screen, or walk out with paperwork — and a badge on a lanyard is often the only thing standing between them and the office.",
      points: [
        "Don't hold the door for someone you don't recognize, even if they look like they belong — ask them to badge in.",
        "Lock your screen every time you step away from your desk, even for a minute.",
        "Keep sensitive documents off your desk and out of view when you're not using them.",
        "Report lost badges immediately rather than waiting to see if they turn up."
      ],
      scenario: {
        label: "Scenario",
        text:
          "Someone in a delivery uniform, carrying boxes, asks you to hold the secure door because their hands are full. This is a classic tailgating setup — politely ask them to use the intercom or badge reader instead. A real delivery process accounts for this."
      },
      check: [
        {
          q: "A stranger asks you to hold a secure door because their hands are full. You should:",
          options: [
            "Hold the door — it would be rude not to",
            "Ask them to badge in or use the intercom instead",
            "Ask to see their ID before deciding",
            "Let them in but watch where they go"
          ],
          answer: 1
        },
        {
          q: "You're stepping away from your desk for two minutes. What should you do?",
          options: [
            "Nothing — it's only two minutes",
            "Lock your screen",
            "Turn your monitor off",
            "Close any open documents only"
          ],
          answer: 1
        }
      ]
    },
    {
      id: "data",
      number: 4,
      title: "Handling sensitive data",
      intro:
        "Customer records, financial details, and internal plans all need to be treated as liabilities as much as assets — the goal is that only the right people can reach them, for the right reasons.",
      points: [
        "Share sensitive files through approved company systems, not personal email or consumer cloud drives.",
        "Double-check the recipient list before sending anything with personal or financial data.",
        "Delete or archive data you no longer need — you can't lose what you don't still have.",
        "Encrypt or password-protect sensitive files when they have to leave the company network."
      ],
      scenario: {
        label: "Scenario",
        text:
          "You need to send a spreadsheet of customer contact details to a vendor. Before attaching it to a personal email account to save time, route it through the company's approved file-sharing tool instead — it keeps the data inside systems that are actually monitored and access-controlled."
      },
      check: [
        {
          q: "You need to send sensitive data to an external partner. The best approach is:",
          options: [
            "Attach it to an email from your personal account for speed",
            "Use the company's approved, access-controlled file-sharing system",
            "Post it to a shared public link and send the link",
            "Print it and mail it instead"
          ],
          answer: 1
        },
        {
          q: "Why delete or archive data you no longer need?",
          options: [
            "It saves disk space, which is the main concern",
            "Data that no longer exists can't be stolen or leaked",
            "It makes folders look tidier",
            "It's required for every file, regardless of sensitivity"
          ],
          answer: 1
        }
      ]
    },
    {
      id: "incident",
      number: 5,
      title: "Reporting incidents fast",
      intro:
        "The single biggest factor in how much damage a security incident causes is how quickly it's reported. A mistake caught in minutes is a non-event; the same mistake caught in a week can be a breach.",
      points: [
        "Report suspected phishing, lost devices, or odd account activity immediately — don't wait to be sure.",
        "You will not be punished for reporting a mistake in good faith. Staying silent is the real risk.",
        "Know where to report: your security team's inbox, hotline, or ticketing system.",
        "If you clicked something suspicious, say so right away — fast action can stop it from spreading."
      ],
      scenario: {
        label: "Scenario",
        text:
          "You realize, an hour after the fact, that you entered your password on a page that now seems suspicious. The instinct to stay quiet and hope nothing happens is the wrong one — reporting it immediately lets the security team lock the account before it's misused."
      },
      check: [
        {
          q: "You suspect you clicked a phishing link ten minutes ago. What should you do?",
          options: [
            "Wait to see if anything bad happens first",
            "Report it immediately to your security team",
            "Change your password in a few days if needed",
            "Only mention it if someone else asks"
          ],
          answer: 1
        },
        {
          q: "Why does reporting speed matter so much for incidents?",
          options: [
            "It doesn't — the damage is the same either way",
            "Fast reporting lets the security team contain the problem before it spreads",
            "It's only about following policy for its own sake",
            "It matters only for large companies"
          ],
          answer: 1
        }
      ]
    }
  ];

  var FINAL_QUIZ = [
    {
      q: "Which detail matters most when judging whether an email is genuine?",
      options: [
        "The sender's display name",
        "Whether it uses urgency to push a login or payment",
        "Whether it has a signature block",
        "The time it was sent"
      ],
      answer: 1
    },
    {
      q: "What's the best way to manage passwords across many accounts?",
      options: [
        "Reuse one strong password everywhere",
        "A unique password per account via a password manager",
        "A shared team password for convenience",
        "Simple passwords that are easy to type quickly"
      ],
      answer: 1
    },
    {
      q: "Someone without a visible badge asks you to hold a secure door. Best move?",
      options: [
        "Hold it — challenging people feels awkward",
        "Direct them to badge in or use the intercom",
        "Let them in if they seem to know people's names",
        "Ignore it and keep walking"
      ],
      answer: 1
    },
    {
      q: "What's the safest way to send sensitive customer data to a partner?",
      options: [
        "Personal email, so it's outside work systems",
        "The company's approved, access-controlled sharing tool",
        "A public shareable link",
        "Text message"
      ],
      answer: 1
    },
    {
      q: "You realize you may have exposed your password an hour ago. What now?",
      options: [
        "Wait and see if anything looks wrong",
        "Report it immediately so it can be contained",
        "Quietly change it next week",
        "Say nothing unless asked directly"
      ],
      answer: 1
    },
    {
      q: "A caller claiming to be from IT asks for your MFA code. You should:",
      options: [
        "Provide it if they know your name and department",
        "Refuse, hang up, and report the call",
        "Give a slightly wrong code to test them",
        "Ask a coworker whether it's normal"
      ],
      answer: 1
    }
  ];

  var PASS_RATIO = 5 / 6; // 5 of 6 final-quiz questions

  // ---------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------

  var state = {
    currentId: LESSONS[0].id,
    lessonProgress: {}, // id -> { read: bool, checkAnswers: {} }
    finalAnswers: {},
    finalSubmitted: false,
    finalScore: null
  };

  LESSONS.forEach(function (l) {
    state.lessonProgress[l.id] = { read: false, checkAnswers: {} };
  });

  var STEPS = LESSONS.map(function (l) {
    return l.id;
  }).concat(["final"]);

  // ---------------------------------------------------------------------
  // SCORM bridging
  // ---------------------------------------------------------------------

  function restoreState() {
    var loc = window.ScormAPI.get("cmi.location");
    if (loc && STEPS.indexOf(loc) !== -1) {
      state.currentId = loc;
    }
    var suspend = window.ScormAPI.get("cmi.suspend_data");
    if (suspend) {
      try {
        var parsed = JSON.parse(suspend);
        if (parsed && parsed.lessonProgress) {
          Object.keys(parsed.lessonProgress).forEach(function (id) {
            if (state.lessonProgress[id]) {
              state.lessonProgress[id] = parsed.lessonProgress[id];
            }
          });
        }
        if (parsed && parsed.finalSubmitted) {
          state.finalSubmitted = parsed.finalSubmitted;
          state.finalScore = parsed.finalScore;
          state.finalAnswers = parsed.finalAnswers || {};
        }
      } catch (e) {
        /* ignore malformed suspend data */
      }
    }
  }

  function persistState() {
    window.ScormAPI.set("cmi.location", state.currentId);
    window.ScormAPI.set(
      "cmi.suspend_data",
      JSON.stringify({
        lessonProgress: state.lessonProgress,
        finalSubmitted: state.finalSubmitted,
        finalScore: state.finalScore,
        finalAnswers: state.finalAnswers
      })
    );

    var readCount = LESSONS.filter(function (l) {
      return state.lessonProgress[l.id].read;
    }).length;
    var progressMeasure = (readCount + (state.finalSubmitted ? 1 : 0)) / (LESSONS.length + 1);
    window.ScormAPI.set("cmi.progress_measure", progressMeasure.toFixed(2));

    if (state.finalSubmitted) {
      var scaled = state.finalScore.correct / state.finalScore.total;
      window.ScormAPI.set("cmi.score.raw", String(state.finalScore.correct));
      window.ScormAPI.set("cmi.score.min", "0");
      window.ScormAPI.set("cmi.score.max", String(state.finalScore.total));
      window.ScormAPI.set("cmi.score.scaled", scaled.toFixed(2));

      var passed = scaled >= PASS_RATIO;
      window.ScormAPI.set("cmi.success_status", passed ? "passed" : "failed");
      window.ScormAPI.set("cmi.completion_status", passed ? "completed" : "incomplete");
    } else {
      window.ScormAPI.set("cmi.completion_status", "incomplete");
    }

    window.ScormAPI.commit();
  }

  // ---------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------

  var appEl = document.getElementById("app");

  function iconFor(id) {
    var progress = state.lessonProgress[id];
    if (id === "final") {
      if (!state.finalSubmitted) return "";
      return state.finalScore.correct / state.finalScore.total >= PASS_RATIO ? "done" : "retry";
    }
    return progress.read ? "done" : "";
  }

  function allLessonsRead() {
    return LESSONS.every(function (l) {
      return state.lessonProgress[l.id].read;
    });
  }

  function renderSidebar() {
    var readCount = LESSONS.filter(function (l) {
      return state.lessonProgress[l.id].read;
    }).length;
    var pct = Math.round((readCount / LESSONS.length) * 100);

    var html = '';
    html += '<div class="course-brand">Workplace Security</div>';
    html += '<div class="scenario-progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
    html += '<div class="course-progress-label">' + readCount + ' of ' + LESSONS.length + ' lessons read</div>';
    html += '<nav class="course-nav">';

    LESSONS.forEach(function (l) {
      var active = state.currentId === l.id ? ' is-active' : '';
      var status = iconFor(l.id);
      html +=
        '<button class="course-nav-item' + active + '" data-nav="' + l.id + '">' +
        '<span class="course-nav-num">' + String(l.number).padStart(2, "0") + '</span>' +
        '<span class="course-nav-title">' + l.title + '</span>' +
        (status === "done" ? '<span class="course-nav-check" aria-hidden="true">\u2713</span>' : '') +
        '</button>';
    });

    var finalActive = state.currentId === "final" ? ' is-active' : '';
    var finalDisabled = allLessonsRead() ? '' : ' is-disabled';
    var finalStatus = iconFor("final");
    html +=
      '<button class="course-nav-item course-nav-final' + finalActive + finalDisabled + '" data-nav="final">' +
      '<span class="course-nav-num">\u2713</span>' +
      '<span class="course-nav-title">Final check</span>' +
      (finalStatus === "done" ? '<span class="course-nav-check" aria-hidden="true">\u2713</span>' : '') +
      (finalStatus === "retry" ? '<span class="course-nav-retry" aria-hidden="true">!</span>' : '') +
      '</button>';

    html += '</nav>';
    return html;
  }

  function renderLesson(lesson) {
    var progress = state.lessonProgress[lesson.id];
    var html = '';
    html += '<article class="lesson-card card">';
    html += '<p class="scenario-number">Lesson ' + lesson.number + ' of ' + LESSONS.length + '</p>';
    html += '<h1 class="section-heading">' + lesson.title + '</h1>';
    html += '<p class="section-sub">' + lesson.intro + '</p>';
    html += '<ul class="instructions-list">';
    lesson.points.forEach(function (p) {
      html += '<li>' + p + '</li>';
    });
    html += '</ul>';
    html += '<div class="scenario-content"><p class="verdict-label">' + lesson.scenario.label + '</p><p>' + lesson.scenario.text + '</p></div>';

    html += '<div class="check-block">';
    html += '<h3>Check yourself</h3>';
    lesson.check.forEach(function (q, qi) {
      var chosen = progress.checkAnswers[qi];
      html += '<div class="quiz-q" data-lesson="' + lesson.id + '" data-qi="' + qi + '">';
      html += '<p class="quiz-question">' + q.q + '</p>';
      html += '<div class="quiz-options">';
      q.options.forEach(function (opt, oi) {
        var cls = 'quiz-option';
        if (chosen !== undefined) {
          if (oi === q.answer) cls += ' is-correct';
          else if (oi === chosen) cls += ' is-incorrect';
        }
        html +=
          '<button class="' + cls + '" data-lesson="' + lesson.id + '" data-qi="' + qi + '" data-oi="' + oi + '"' +
          (chosen !== undefined ? ' disabled' : '') + '>' + opt + '</button>';
      });
      html += '</div></div>';
    });
    html += '</div>';

    html += '<div class="scenario-nav">';
    var idx = LESSONS.indexOf(lesson);
    if (idx > 0) {
      html += '<button class="btn-secondary" data-nav="' + LESSONS[idx - 1].id + '">\u2190 Back</button>';
    } else {
      html += '<span></span>';
    }
    var nextId = idx < LESSONS.length - 1 ? LESSONS[idx + 1].id : "final";
    var nextLabel = idx < LESSONS.length - 1 ? "Continue" : "Go to final check";
    html += '<button class="btn-primary" data-mark-read="' + lesson.id + '" data-nav="' + nextId + '">' + nextLabel + ' \u2192</button>';
    html += '</div>';

    html += '</article>';
    return html;
  }

  function renderFinal() {
    var html = '<article class="lesson-card card">';
    html += '<p class="scenario-number">Final check</p>';
    html += '<h1 class="section-heading">Pull it together</h1>';
    html += '<p class="section-sub">Six questions across everything covered so far. Score ' +
      Math.ceil(6 * PASS_RATIO) + ' of 6 or better to complete the course.</p>';

    FINAL_QUIZ.forEach(function (q, qi) {
      var chosen = state.finalAnswers[qi];
      var locked = state.finalSubmitted;
      html += '<div class="quiz-q" data-final-qi="' + qi + '">';
      html += '<p class="quiz-question">' + (qi + 1) + '. ' + q.q + '</p>';
      html += '<div class="quiz-options">';
      q.options.forEach(function (opt, oi) {
        var cls = 'quiz-option';
        if (locked) {
          if (oi === q.answer) cls += ' is-correct';
          else if (oi === chosen) cls += ' is-incorrect';
        } else if (chosen === oi) {
          cls += ' is-selected';
        }
        html +=
          '<button class="' + cls + '" data-final-qi="' + qi + '" data-final-oi="' + oi + '"' +
          (locked ? ' disabled' : '') + '>' + opt + '</button>';
      });
      html += '</div></div>';
    });

    if (!state.finalSubmitted) {
      var answeredAll = FINAL_QUIZ.every(function (q, qi) {
        return state.finalAnswers[qi] !== undefined;
      });
      html +=
        '<div class="scenario-nav"><span></span><button class="btn-primary" id="submit-final"' +
        (answeredAll ? '' : ' disabled') + '>Submit answers</button></div>';
    } else {
      var passed = state.finalScore.correct / state.finalScore.total >= PASS_RATIO;
      html += '<div class="result-card ' + (passed ? 'result-correct' : 'result-incorrect') + '">';
      html += '<p class="result-score">' + state.finalScore.correct + ' / ' + state.finalScore.total + '</p>';
      html += '<p class="result-explanation">' + (passed
        ? "You've completed Workplace Security training."
        : "Not quite there yet — review the lessons and try again.") + '</p>';
      html += '</div>';
      html += '<div class="scenario-nav"><span></span>';
      if (!passed) {
        html += '<button class="btn-primary" id="retry-final">Try again</button>';
      }
      html += '</div>';
    }

    html += '</article>';
    return html;
  }

  function render() {
    var sidebar = renderSidebar();
    var main;
    if (state.currentId === "final") {
      main = allLessonsRead()
        ? renderFinal()
        : '<div class="placeholder-screen"><div class="placeholder-content"><h2>Finish every lesson first</h2><p>Read through all five lessons, then come back here for the final check.</p></div></div>';
    } else {
      var lesson = LESSONS.filter(function (l) {
        return l.id === state.currentId;
      })[0];
      main = renderLesson(lesson);
    }

    appEl.innerHTML =
      '<aside class="course-sidebar">' + sidebar + '</aside>' +
      '<main class="course-content" id="content-pane">' + main + '</main>';

    attachHandlers();
  }

  // ---------------------------------------------------------------------
  // Interaction
  // ---------------------------------------------------------------------

  function goTo(id) {
    if (id === "final" && !allLessonsRead()) {
      id = state.currentId;
    }
    state.currentId = id;
    persistState();
    render();
    var pane = document.getElementById("content-pane");
    if (pane) pane.scrollTop = 0;
  }

  function attachHandlers() {
    appEl.querySelectorAll("[data-nav]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var markRead = btn.getAttribute("data-mark-read");
        if (markRead) {
          state.lessonProgress[markRead].read = true;
        }
        goTo(btn.getAttribute("data-nav"));
      });
    });

    appEl.querySelectorAll(".quiz-option[data-lesson]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lessonId = btn.getAttribute("data-lesson");
        var qi = btn.getAttribute("data-qi");
        state.lessonProgress[lessonId].checkAnswers[qi] = Number(btn.getAttribute("data-oi"));
        persistState();
        render();
      });
    });

    appEl.querySelectorAll(".quiz-option[data-final-qi]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (state.finalSubmitted) return;
        var qi = btn.getAttribute("data-final-qi");
        state.finalAnswers[qi] = Number(btn.getAttribute("data-final-oi"));
        render();
      });
    });

    var submitBtn = document.getElementById("submit-final");
    if (submitBtn) {
      submitBtn.addEventListener("click", function () {
        var correct = 0;
        FINAL_QUIZ.forEach(function (q, qi) {
          if (state.finalAnswers[qi] === q.answer) correct++;
        });
        state.finalScore = { correct: correct, total: FINAL_QUIZ.length };
        state.finalSubmitted = true;
        persistState();
        render();
      });
    }

    var retryBtn = document.getElementById("retry-final");
    if (retryBtn) {
      retryBtn.addEventListener("click", function () {
        state.finalSubmitted = false;
        state.finalScore = null;
        state.finalAnswers = {};
        persistState();
        render();
      });
    }
  }

  // ---------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------

  window.ScormAPI.init();
  restoreState();
  render();
  persistState();

  window.addEventListener("beforeunload", persistState);
})();

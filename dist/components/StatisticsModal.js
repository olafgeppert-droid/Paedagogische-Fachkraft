"use strict";

var StatisticsModal = function StatisticsModal(_ref) {
  var students = _ref.students,
    entries = _ref.entries,
    onClose = _ref.onClose;
  var stats = calculateStatistics(students, entries);
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h2", null, "Statistiken"), /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\xD7")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "\xDCbersicht"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Gesamtzahl Kinder:"), " ", stats.totalStudents), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Gesamtzahl Eintr\xE4ge:"), " ", stats.totalEntries), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Durchschnittliche Eintr\xE4ge pro Kind:"), " ", stats.totalStudents > 0 ? (stats.totalEntries / stats.totalStudents).toFixed(1) : 0), /*#__PURE__*/React.createElement("h3", null, "Eintr\xE4ge nach Kindern"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Kinder mit Eintr\xE4gen:"), " ", stats.studentsWithEntries), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Kinder ohne Eintr\xE4ge:"), " ", stats.studentsWithoutEntries), /*#__PURE__*/React.createElement("h3", null, "Bewertungen"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Positive Bewertungen:"), " ", stats.ratings.positiv), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Negative Bewertungen:"), " ", stats.ratings.negativ), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Keine Bewertung:"), " ", stats.ratings.keine)), /*#__PURE__*/React.createElement("div", {
    className: "form-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "button",
    onClick: onClose
  }, "Schlie\xDFen"))));
};
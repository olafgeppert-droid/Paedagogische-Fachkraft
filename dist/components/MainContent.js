"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var MainContent = function MainContent(_ref) {
  var viewMode = _ref.viewMode,
    selectedStudent = _ref.selectedStudent,
    selectedDate = _ref.selectedDate,
    entries = _ref.entries,
    onEditEntry = _ref.onEditEntry;
  if (viewMode === 'student' && selectedStudent) {
    return /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement("h2", null, "Protokolle f\xFCr ", selectedStudent.name), entries.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "welcome-screen"
    }, /*#__PURE__*/React.createElement("p", null, "Keine Eintr\xE4ge f\xFCr dieses Kind.")) : entries.map(function (entry) {
      return /*#__PURE__*/React.createElement(EntryCard, {
        key: entry.id,
        entry: entry,
        student: selectedStudent,
        onEdit: onEditEntry
      });
    }));
  } else if (viewMode === 'day' && selectedDate) {
    var entriesByStudent = {};
    entries.forEach(function (entry) {
      if (!entriesByStudent[entry.studentId]) {
        entriesByStudent[entry.studentId] = [];
      }
      entriesByStudent[entry.studentId].push(entry);
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement("h2", null, "Eintr\xE4ge f\xFCr ", new Date(selectedDate).toLocaleDateString('de-DE')), Object.keys(entriesByStudent).length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "welcome-screen"
    }, /*#__PURE__*/React.createElement("p", null, "Keine Eintr\xE4ge f\xFCr dieses Datum.")) : Object.entries(entriesByStudent).map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
        studentId = _ref3[0],
        studentEntries = _ref3[1];
      return /*#__PURE__*/React.createElement("div", {
        key: studentId,
        style: {
          marginBottom: '2rem'
        }
      }, /*#__PURE__*/React.createElement("h3", null, studentEntries[0].studentName || "Sch\xFCler ".concat(studentId)), studentEntries.map(function (entry) {
        return /*#__PURE__*/React.createElement(EntryCard, {
          key: entry.id,
          entry: entry,
          onEdit: onEditEntry
        });
      }));
    }));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "welcome-screen"
    }, /*#__PURE__*/React.createElement("h2", null, "Willkommen!"), /*#__PURE__*/React.createElement("p", null, "W\xE4hlen Sie links ein Kind aus der Liste, um die Protokolle anzuzeigen, oder w\xE4hlen Sie einen Tag, um alle Eintr\xE4ge f\xFCr diesen Tag zu sehen.")));
  }
};
var EntryCard = function EntryCard(_ref4) {
  var entry = _ref4.entry,
    student = _ref4.student,
    onEdit = _ref4.onEdit;
  return /*#__PURE__*/React.createElement("div", {
    className: "entry-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "entry-header"
  }, /*#__PURE__*/React.createElement("span", null, entry.subject), /*#__PURE__*/React.createElement("span", null, new Date(entry.date).toLocaleDateString('de-DE'))), student && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Sch\xFCler:"), " ", student.name), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Beobachtungen:"), " ", entry.observations), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Ma\xDFnahmen:"), " ", entry.measures), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Erfolg:"), " ", entry.erfolg), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Bewertung:"), " ", entry.erfolgRating), /*#__PURE__*/React.createElement("button", {
    className: "button",
    onClick: onEdit
  }, "Bearbeiten"));
};
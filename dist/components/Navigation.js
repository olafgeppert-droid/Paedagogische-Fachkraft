"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var Navigation = function Navigation(_ref) {
  var _masterData$schools$l;
  var isOpen = _ref.isOpen,
    students = _ref.students,
    selectedStudent = _ref.selectedStudent,
    selectedDate = _ref.selectedDate,
    filters = _ref.filters,
    masterData = _ref.masterData,
    onStudentSelect = _ref.onStudentSelect,
    onDateSelect = _ref.onDateSelect,
    onFilterChange = _ref.onFilterChange,
    onShowStats = _ref.onShowStats,
    onShowSettings = _ref.onShowSettings,
    onShowHelp = _ref.onShowHelp;
  var _useState = useState(filters.search),
    _useState2 = _slicedToArray(_useState, 2),
    searchTerm = _useState2[0],
    setSearchTerm = _useState2[1];
  var _useState3 = useState(filters),
    _useState4 = _slicedToArray(_useState3, 2),
    localFilters = _useState4[0],
    setLocalFilters = _useState4[1];
  var handleSearchChange = function handleSearchChange(e) {
    var value = e.target.value;
    setSearchTerm(value);
    onFilterChange(_objectSpread(_objectSpread({}, localFilters), {}, {
      search: value
    }));
  };
  var handleFilterChange = function handleFilterChange(filterType, value) {
    var newFilters = _objectSpread(_objectSpread({}, localFilters), {}, _defineProperty({}, filterType, value));
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };
  var clearFilters = function clearFilters() {
    var clearedFilters = {
      search: '',
      schoolYear: '',
      school: '',
      className: ''
    };
    setSearchTerm('');
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };
  var hasActiveFilters = localFilters.search || localFilters.schoolYear || localFilters.school || localFilters.className;
  return /*#__PURE__*/React.createElement("nav", {
    className: "nav ".concat(isOpen ? 'open' : '')
  }, /*#__PURE__*/React.createElement("h3", null, "Navigation"), /*#__PURE__*/React.createElement("div", {
    className: "search-filter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "search-input",
    placeholder: "\uD83D\uDD0D Kind suchen...",
    value: searchTerm,
    onChange: handleSearchChange
  })), /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "filter-label"
  }, "Schuljahr"), /*#__PURE__*/React.createElement("select", {
    className: "filter-select",
    value: localFilters.schoolYear,
    onChange: function onChange(e) {
      return handleFilterChange('schoolYear', e.target.value);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Alle Schuljahre"), masterData.schoolYears && masterData.schoolYears.map(function (year) {
    return /*#__PURE__*/React.createElement("option", {
      key: year,
      value: year
    }, year);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "filter-label"
  }, "Schule"), /*#__PURE__*/React.createElement("select", {
    className: "filter-select",
    value: localFilters.school,
    onChange: function onChange(e) {
      return handleFilterChange('school', e.target.value);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Alle Schulen"), masterData.schools && Object.keys(masterData.schools).map(function (school) {
    return /*#__PURE__*/React.createElement("option", {
      key: school,
      value: school
    }, school);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "filter-label"
  }, "Klasse"), /*#__PURE__*/React.createElement("select", {
    className: "filter-select",
    value: localFilters.className,
    onChange: function onChange(e) {
      return handleFilterChange('className', e.target.value);
    },
    disabled: !localFilters.school
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Alle Klassen"), localFilters.school && ((_masterData$schools$l = masterData.schools[localFilters.school]) === null || _masterData$schools$l === void 0 ? void 0 : _masterData$schools$l.map(function (className) {
    return /*#__PURE__*/React.createElement("option", {
      key: className,
      value: className
    }, className);
  })))), /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "filter-label"
  }, "Tag"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "filter-select",
    value: selectedDate,
    onChange: function onChange(e) {
      return onDateSelect(e.target.value);
    }
  })), hasActiveFilters && /*#__PURE__*/React.createElement("button", {
    className: "button button-warning",
    onClick: clearFilters,
    style: {
      width: '100%',
      marginTop: '0.5rem'
    }
  }, "\u274C Filter l\xF6schen")), /*#__PURE__*/React.createElement("div", {
    className: "students-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("h4", null, "Kind"), /*#__PURE__*/React.createElement("span", {
    className: "student-count"
  }, students.length)), students.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("p", null, "Keine Kinder gefunden"), hasActiveFilters && /*#__PURE__*/React.createElement("button", {
    className: "button",
    onClick: clearFilters,
    style: {
      marginTop: '10px',
      width: '100%'
    }
  }, "Filter zur\xFCcksetzen")) : /*#__PURE__*/React.createElement("ul", {
    className: "students-list"
  }, students.map(function (student) {
    return /*#__PURE__*/React.createElement("li", {
      key: student.id,
      className: "student-item ".concat((selectedStudent === null || selectedStudent === void 0 ? void 0 : selectedStudent.id) === student.id ? 'selected' : ''),
      onClick: function onClick() {
        return onStudentSelect(student);
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "student-avatar"
    }, student.gender === 'weiblich' ? '👧' : student.gender === 'männlich' ? '👦' : '👤'), /*#__PURE__*/React.createElement("div", {
      className: "student-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "student-name"
    }, student.name), /*#__PURE__*/React.createElement("div", {
      className: "student-details"
    }, student.className)));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "nav-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Aktionen"), /*#__PURE__*/React.createElement("button", {
    className: "button button-info",
    onClick: onShowStats
  }, "\uD83D\uDCCA Statistiken"), /*#__PURE__*/React.createElement("button", {
    className: "button button-info",
    onClick: onShowSettings
  }, "\u2699\uFE0F Einstellungen"), /*#__PURE__*/React.createElement("button", {
    className: "button button-info",
    onClick: onShowHelp
  }, "\u2753 Hilfe")), /*#__PURE__*/React.createElement("div", {
    className: "app-info"
  }, /*#__PURE__*/React.createElement("p", null, "Willkommen! W\xE4hlen Sie ein Kind aus der Liste."))));
};
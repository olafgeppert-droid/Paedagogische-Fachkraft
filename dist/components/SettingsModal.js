"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
var SettingsModal = function SettingsModal(_ref) {
  var settings = _ref.settings,
    masterData = _ref.masterData,
    onSave = _ref.onSave,
    onSaveMasterData = _ref.onSaveMasterData,
    onClose = _ref.onClose;
  var _useState = useState(settings),
    _useState2 = _slicedToArray(_useState, 2),
    formData = _useState2[0],
    setFormData = _useState2[1];
  var _useState3 = useState(masterData),
    _useState4 = _slicedToArray(_useState3, 2),
    masterFormData = _useState4[0],
    setMasterFormData = _useState4[1];
  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    onSave(formData);
  };
  var handleMasterDataSubmit = function handleMasterDataSubmit(e) {
    e.preventDefault();
    onSaveMasterData(masterFormData);
    onClose(); // Modal nach dem Speichern schließen
  };
  var addSchoolYear = function addSchoolYear() {
    var newYear = prompt('Neues Schuljahr hinzufügen (Format: YYYY/YYYY):');
    if (newYear && !masterFormData.schoolYears.includes(newYear)) {
      setMasterFormData(_objectSpread(_objectSpread({}, masterFormData), {}, {
        schoolYears: [].concat(_toConsumableArray(masterFormData.schoolYears), [newYear]).sort()
      }));
    }
  };
  var removeSchoolYear = function removeSchoolYear(year) {
    setMasterFormData(_objectSpread(_objectSpread({}, masterFormData), {}, {
      schoolYears: masterFormData.schoolYears.filter(function (y) {
        return y !== year;
      })
    }));
  };
  var addSchool = function addSchool() {
    var newSchool = prompt('Neue Schule hinzufügen:');
    if (newSchool && !masterFormData.schools[newSchool]) {
      setMasterFormData(_objectSpread(_objectSpread({}, masterFormData), {}, {
        schools: _objectSpread(_objectSpread({}, masterFormData.schools), {}, _defineProperty({}, newSchool, []))
      }));
    }
  };
  var removeSchool = function removeSchool(school) {
    var newSchools = _objectSpread({}, masterFormData.schools);
    delete newSchools[school];
    setMasterFormData(_objectSpread(_objectSpread({}, masterFormData), {}, {
      schools: newSchools
    }));
  };
  var addClass = function addClass(school) {
    var newClass = prompt('Neue Klasse hinzufügen:');
    if (newClass && !masterFormData.schools[school].includes(newClass)) {
      setMasterFormData(_objectSpread(_objectSpread({}, masterFormData), {}, {
        schools: _objectSpread(_objectSpread({}, masterFormData.schools), {}, _defineProperty({}, school, [].concat(_toConsumableArray(masterFormData.schools[school]), [newClass]).sort()))
      }));
    }
  };
  var removeClass = function removeClass(school, className) {
    setMasterFormData(_objectSpread(_objectSpread({}, masterFormData), {}, {
      schools: _objectSpread(_objectSpread({}, masterFormData.schools), {}, _defineProperty({}, school, masterFormData.schools[school].filter(function (c) {
        return c !== className;
      })))
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h2", null, "Einstellungen"), /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\xD7")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("h3", null, "Darstellung"), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Farbschema"), /*#__PURE__*/React.createElement("div", {
    className: "theme-selector"
  }, /*#__PURE__*/React.createElement("div", {
    className: "theme-option theme-light ".concat(formData.theme === 'light' ? 'selected' : ''),
    onClick: function onClick() {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        theme: 'light'
      }));
    },
    title: "Hell"
  }), /*#__PURE__*/React.createElement("div", {
    className: "theme-option theme-dark ".concat(formData.theme === 'dark' ? 'selected' : ''),
    onClick: function onClick() {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        theme: 'dark'
      }));
    },
    title: "Dunkel"
  }), /*#__PURE__*/React.createElement("div", {
    className: "theme-option theme-high-contrast ".concat(formData.theme === 'high-contrast' ? 'selected' : ''),
    onClick: function onClick() {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        theme: 'high-contrast'
      }));
    },
    title: "Kontrastreich"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Schriftgr\xF6\xDFe (Labels)"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "12",
    max: "24",
    value: formData.fontSize,
    onChange: function onChange(e) {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        fontSize: parseInt(e.target.value)
      }));
    }
  }), /*#__PURE__*/React.createElement("span", null, formData.fontSize, "px")), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Schriftgr\xF6\xDFe (Eingabefelder)"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "12",
    max: "24",
    value: formData.inputFontSize,
    onChange: function onChange(e) {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        inputFontSize: parseInt(e.target.value)
      }));
    }
  }), /*#__PURE__*/React.createElement("span", null, formData.inputFontSize, "px")), /*#__PURE__*/React.createElement("div", {
    className: "form-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "button button-danger",
    onClick: onClose
  }, "Abbrechen"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "button button-success"
  }, "Speichern"))), /*#__PURE__*/React.createElement("hr", {
    style: {
      margin: '2rem 0'
    }
  }), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleMasterDataSubmit
  }, /*#__PURE__*/React.createElement("h3", null, "Stammdaten verwalten"), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Schuljahre"), /*#__PURE__*/React.createElement("div", null, masterFormData.schoolYears.map(function (year) {
    return /*#__PURE__*/React.createElement("div", {
      key: year,
      style: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, year), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "button button-danger",
      style: {
        padding: '0.25rem 0.5rem'
      },
      onClick: function onClick() {
        return removeSchoolYear(year);
      }
    }, "L\xF6schen"));
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "button",
    onClick: addSchoolYear
  }, "Schuljahr hinzuf\xFCgen"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Schulen und Klassen"), /*#__PURE__*/React.createElement("div", null, Object.entries(masterFormData.schools || {}).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
      school = _ref3[0],
      classes = _ref3[1];
    return /*#__PURE__*/React.createElement("div", {
      key: school,
      style: {
        marginBottom: '1rem'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        flex: 1
      }
    }, school), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "button button-danger",
      style: {
        padding: '0.25rem 0.5rem'
      },
      onClick: function onClick() {
        return removeSchool(school);
      }
    }, "Schule l\xF6schen")), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingLeft: '1rem'
      }
    }, classes.map(function (className) {
      return /*#__PURE__*/React.createElement("div", {
        key: className,
        style: {
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.25rem'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1
        }
      }, className), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "button button-danger",
        style: {
          padding: '0.25rem 0.5rem'
        },
        onClick: function onClick() {
          return removeClass(school, className);
        }
      }, "L\xF6schen"));
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "button",
      style: {
        padding: '0.25rem 0.5rem',
        marginTop: '0.5rem'
      },
      onClick: function onClick() {
        return addClass(school);
      }
    }, "Klasse hinzuf\xFCgen")));
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "button",
    onClick: addSchool
  }, "Schule hinzuf\xFCgen"))), /*#__PURE__*/React.createElement("div", {
    className: "form-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "button button-danger",
    onClick: onClose
  }, "Abbrechen"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "button button-success"
  }, "Stammdaten speichern")))));
};
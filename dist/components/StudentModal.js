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
var StudentModal = function StudentModal(_ref) {
  var _masterData$schools$f;
  var student = _ref.student,
    masterData = _ref.masterData,
    onSave = _ref.onSave,
    onDelete = _ref.onDelete,
    onClose = _ref.onClose;
  var _useState = useState(student || {
      name: '',
      schoolYear: '',
      school: '',
      className: '',
      gender: '',
      nationality: '',
      germanLevel: '',
      notes: ''
    }),
    _useState2 = _slicedToArray(_useState, 2),
    formData = _useState2[0],
    setFormData = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    showDeleteConfirm = _useState4[0],
    setShowDeleteConfirm = _useState4[1];
  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    onSave(formData);
  };
  var handleDelete = function handleDelete() {
    setShowDeleteConfirm(true);
  };
  var confirmDelete = function confirmDelete() {
    onDelete(student.id);
    setShowDeleteConfirm(false);
    onClose();
  };
  var cancelDelete = function cancelDelete() {
    setShowDeleteConfirm(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h2", null, student ? 'Kind bearbeiten' : 'Neues Kind hinzufügen'), /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, "\xD7")), showDeleteConfirm ? /*#__PURE__*/React.createElement("div", {
    className: "delete-confirmation"
  }, /*#__PURE__*/React.createElement("h3", null, "Kind l\xF6schen"), /*#__PURE__*/React.createElement("p", null, "Sind Sie sicher, dass Sie \"", student.name, "\" l\xF6schen m\xF6chten? Diese Aktion kann nicht r\xFCckg\xE4ngig gemacht werden."), /*#__PURE__*/React.createElement("div", {
    className: "form-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "button",
    onClick: cancelDelete
  }, "Abbrechen"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "button button-danger",
    onClick: confirmDelete
  }, "Endg\xFCltig l\xF6schen"))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: formData.name,
    onChange: function onChange(e) {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        name: e.target.value
      }));
    },
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Schuljahr"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: formData.schoolYear,
    onChange: function onChange(e) {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        schoolYear: e.target.value
      }));
    },
    required: true
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Bitte w\xE4hlen"), masterData.schoolYears.map(function (year) {
    return /*#__PURE__*/React.createElement("option", {
      key: year,
      value: year
    }, year);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Schule"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: formData.school,
    onChange: function onChange(e) {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        school: e.target.value
      }));
    },
    required: true
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Bitte w\xE4hlen"), Object.keys(masterData.schools || {}).map(function (school) {
    return /*#__PURE__*/React.createElement("option", {
      key: school,
      value: school
    }, school);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Klasse"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: formData.className,
    onChange: function onChange(e) {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        className: e.target.value
      }));
    },
    required: true
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Bitte w\xE4hlen"), formData.school && ((_masterData$schools$f = masterData.schools[formData.school]) === null || _masterData$schools$f === void 0 ? void 0 : _masterData$schools$f.map(function (className) {
    return /*#__PURE__*/React.createElement("option", {
      key: className,
      value: className
    }, className);
  })))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Geschlecht"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: formData.gender,
    onChange: function onChange(e) {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        gender: e.target.value
      }));
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Bitte w\xE4hlen"), /*#__PURE__*/React.createElement("option", {
    value: "m\xE4nnlich"
  }, "M\xE4nnlich"), /*#__PURE__*/React.createElement("option", {
    value: "weiblich"
  }, "Weiblich"), /*#__PURE__*/React.createElement("option", {
    value: "divers"
  }, "Divers"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Nationalit\xE4t"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: formData.nationality,
    onChange: function onChange(e) {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        nationality: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Deutschkenntnisse"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: formData.germanLevel,
    onChange: function onChange(e) {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        germanLevel: e.target.value
      }));
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Bitte w\xE4hlen"), /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, "1 - Sehr gut"), /*#__PURE__*/React.createElement("option", {
    value: "2"
  }, "2 - Gut"), /*#__PURE__*/React.createElement("option", {
    value: "3"
  }, "3 - Befriedigend"), /*#__PURE__*/React.createElement("option", {
    value: "4"
  }, "4 - Ausreichend"), /*#__PURE__*/React.createElement("option", {
    value: "5"
  }, "5 - Mangelhaft"), /*#__PURE__*/React.createElement("option", {
    value: "6"
  }, "6 - Ungen\xFCgend"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Notizen"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    value: formData.notes,
    onChange: function onChange(e) {
      return setFormData(_objectSpread(_objectSpread({}, formData), {}, {
        notes: e.target.value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-actions"
  }, student && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "button button-danger",
    onClick: handleDelete
  }, "L\xF6schen"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "button",
    onClick: onClose
  }, "Abbrechen"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "button button-success"
  }, "Speichern")))));
};
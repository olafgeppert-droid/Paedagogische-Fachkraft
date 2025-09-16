"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// Hooks aus React holen
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useCallback = _React.useCallback;

// Hauptkomponente
var App = function App() {
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    db = _useState2[0],
    setDb = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    students = _useState4[0],
    setStudents = _useState4[1];
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    entries = _useState6[0],
    setEntries = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    selectedStudent = _useState8[0],
    setSelectedStudent = _useState8[1];
  var _useState9 = useState(new Date().toISOString().split('T')[0]),
    _useState0 = _slicedToArray(_useState9, 2),
    selectedDate = _useState0[0],
    setSelectedDate = _useState0[1];
  var _useState1 = useState('student'),
    _useState10 = _slicedToArray(_useState1, 2),
    viewMode = _useState10[0],
    setViewMode = _useState10[1];
  var _useState11 = useState({
      search: '',
      schoolYear: '',
      school: '',
      className: ''
    }),
    _useState12 = _slicedToArray(_useState11, 2),
    filters = _useState12[0],
    setFilters = _useState12[1];
  var _useState13 = useState({
      theme: 'light',
      fontSize: 16,
      inputFontSize: 16,
      customColors: {}
    }),
    _useState14 = _slicedToArray(_useState13, 2),
    settings = _useState14[0],
    setSettings = _useState14[1];
  var _useState15 = useState({
      schoolYears: [],
      schools: {}
    }),
    _useState16 = _slicedToArray(_useState15, 2),
    masterData = _useState16[0],
    setMasterData = _useState16[1];
  var _useState17 = useState(null),
    _useState18 = _slicedToArray(_useState17, 2),
    modal = _useState18[0],
    setModal = _useState18[1];
  var _useState19 = useState(false),
    _useState20 = _slicedToArray(_useState19, 2),
    navOpen = _useState20[0],
    setNavOpen = _useState20[1];
  var _useState21 = useState([]),
    _useState22 = _slicedToArray(_useState21, 2),
    history = _useState22[0],
    setHistory = _useState22[1];
  var _useState23 = useState(-1),
    _useState24 = _slicedToArray(_useState23, 2),
    historyIndex = _useState24[0],
    setHistoryIndex = _useState24[1];

  // Datenbank initialisieren
  useEffect(function () {
    var initDB = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var database, settingsData, masterDataLoaded, allStudents, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return setupDB();
            case 1:
              database = _context.v;
              setDb(database);
              _context.n = 2;
              return database.get('settings', 1);
            case 2:
              settingsData = _context.v;
              if (settingsData) {
                setSettings(settingsData);
                applySettings(settingsData);
              }
              _context.n = 3;
              return database.get('masterData', 1);
            case 3:
              masterDataLoaded = _context.v;
              if (masterDataLoaded) {
                setMasterData(masterDataLoaded);
              }
              _context.n = 4;
              return database.getAll('students');
            case 4:
              allStudents = _context.v;
              setStudents(allStudents);
              _context.n = 6;
              break;
            case 5:
              _context.p = 5;
              _t = _context.v;
              console.error('Datenbank-Initialisierungsfehler:', _t);
            case 6:
              return _context.a(2);
          }
        }, _callee, null, [[0, 5]]);
      }));
      return function initDB() {
        return _ref.apply(this, arguments);
      };
    }();
    initDB();
  }, []);
  var applySettings = function applySettings(settings) {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.style.setProperty('--font-size', "".concat(settings.fontSize, "px"));
    document.documentElement.style.setProperty('--input-font-size', "".concat(settings.inputFontSize, "px"));
  };

  // Einträge laden
  useEffect(function () {
    var loadEntries = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var entriesData, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              if (db) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2);
            case 1:
              _context2.p = 1;
              entriesData = [];
              if (!(viewMode === 'student' && selectedStudent)) {
                _context2.n = 3;
                break;
              }
              _context2.n = 2;
              return getEntriesByStudentId(db, selectedStudent.id);
            case 2:
              entriesData = _context2.v;
              _context2.n = 5;
              break;
            case 3:
              if (!(viewMode === 'day' && selectedDate)) {
                _context2.n = 5;
                break;
              }
              _context2.n = 4;
              return getEntriesByDate(db, selectedDate);
            case 4:
              entriesData = _context2.v;
            case 5:
              setEntries(entriesData);
              _context2.n = 7;
              break;
            case 6:
              _context2.p = 6;
              _t2 = _context2.v;
              console.error('Fehler beim Laden der Einträge:', _t2);
            case 7:
              return _context2.a(2);
          }
        }, _callee2, null, [[1, 6]]);
      }));
      return function loadEntries() {
        return _ref2.apply(this, arguments);
      };
    }();
    loadEntries();
  }, [db, selectedStudent, selectedDate, viewMode]);
  var filteredStudents = useCallback(function () {
    return filterStudents(students, filters);
  }, [students, filters]);
  var saveStudent = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(studentData) {
      var newStudent, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            if (db) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            _context3.p = 1;
            _context3.n = 2;
            return saveStateForUndo(db, history, setHistory, setHistoryIndex);
          case 2:
            if (!studentData.id) {
              _context3.n = 4;
              break;
            }
            _context3.n = 3;
            return updateStudent(db, studentData);
          case 3:
            setStudents(students.map(function (s) {
              return s.id === studentData.id ? studentData : s;
            }));
            _context3.n = 6;
            break;
          case 4:
            _context3.n = 5;
            return addStudent(db, studentData);
          case 5:
            newStudent = _context3.v;
            setStudents([].concat(_toConsumableArray(students), [newStudent]));
          case 6:
            setModal(null);
            _context3.n = 8;
            break;
          case 7:
            _context3.p = 7;
            _t3 = _context3.v;
            console.error('Fehler beim Speichern des Schülers:', _t3);
          case 8:
            return _context3.a(2);
        }
      }, _callee3, null, [[1, 7]]);
    }));
    return function saveStudent(_x) {
      return _ref3.apply(this, arguments);
    };
  }();
  var deleteStudentHandler = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(studentId) {
      var success, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            if (db) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2);
          case 1:
            _context4.p = 1;
            _context4.n = 2;
            return saveStateForUndo(db, history, setHistory, setHistoryIndex);
          case 2:
            _context4.n = 3;
            return deleteStudent(db, studentId);
          case 3:
            success = _context4.v;
            if (success) {
              setStudents(students.filter(function (s) {
                return s.id !== studentId;
              }));
              if (selectedStudent && selectedStudent.id === studentId) {
                setSelectedStudent(null);
              }
              alert('Kind wurde erfolgreich gelöscht.');
            } else {
              alert('Fehler beim Löschen des Kindes.');
            }
            _context4.n = 5;
            break;
          case 4:
            _context4.p = 4;
            _t4 = _context4.v;
            console.error('Fehler beim Löschen des Schülers:', _t4);
            alert('Fehler beim Löschen des Kindes: ' + _t4.message);
          case 5:
            return _context4.a(2);
        }
      }, _callee4, null, [[1, 4]]);
    }));
    return function deleteStudentHandler(_x2) {
      return _ref4.apply(this, arguments);
    };
  }();
  var saveEntry = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(entryData) {
      var newEntry, _t5;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            if (db) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2);
          case 1:
            _context5.p = 1;
            _context5.n = 2;
            return saveStateForUndo(db, history, setHistory, setHistoryIndex);
          case 2:
            if (!entryData.id) {
              _context5.n = 4;
              break;
            }
            _context5.n = 3;
            return updateEntry(db, entryData);
          case 3:
            setEntries(entries.map(function (e) {
              return e.id === entryData.id ? entryData : e;
            }));
            _context5.n = 6;
            break;
          case 4:
            _context5.n = 5;
            return addEntry(db, _objectSpread(_objectSpread({}, entryData), {}, {
              date: selectedDate
            }));
          case 5:
            newEntry = _context5.v;
            setEntries([].concat(_toConsumableArray(entries), [newEntry]));
          case 6:
            setModal(null);
            _context5.n = 8;
            break;
          case 7:
            _context5.p = 7;
            _t5 = _context5.v;
            console.error('Fehler beim Speichern des Eintrags:', _t5);
          case 8:
            return _context5.a(2);
        }
      }, _callee5, null, [[1, 7]]);
    }));
    return function saveEntry(_x3) {
      return _ref5.apply(this, arguments);
    };
  }();
  var saveSettings = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(newSettings) {
      var _t6;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            if (db) {
              _context6.n = 1;
              break;
            }
            return _context6.a(2);
          case 1:
            _context6.p = 1;
            _context6.n = 2;
            return db.put('settings', _objectSpread(_objectSpread({}, newSettings), {}, {
              id: 1
            }));
          case 2:
            setSettings(newSettings);
            applySettings(newSettings);
            setModal(null);
            _context6.n = 4;
            break;
          case 3:
            _context6.p = 3;
            _t6 = _context6.v;
            console.error('Fehler beim Speichern der Einstellungen:', _t6);
          case 4:
            return _context6.a(2);
        }
      }, _callee6, null, [[1, 3]]);
    }));
    return function saveSettings(_x4) {
      return _ref6.apply(this, arguments);
    };
  }();
  var saveMasterData = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(newMasterData) {
      var _t7;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            if (db) {
              _context7.n = 1;
              break;
            }
            return _context7.a(2);
          case 1:
            _context7.p = 1;
            _context7.n = 2;
            return db.put('masterData', _objectSpread(_objectSpread({}, newMasterData), {}, {
              id: 1
            }));
          case 2:
            setMasterData(newMasterData);
            _context7.n = 4;
            break;
          case 3:
            _context7.p = 3;
            _t7 = _context7.v;
            console.error('Fehler beim Speichern der Master-Daten:', _t7);
          case 4:
            return _context7.a(2);
        }
      }, _callee7, null, [[1, 3]]);
    }));
    return function saveMasterData(_x5) {
      return _ref7.apply(this, arguments);
    };
  }();
  var handleExport = /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            _context8.n = 1;
            return exportData(db);
          case 1:
            return _context8.a(2);
        }
      }, _callee8);
    }));
    return function handleExport() {
      return _ref8.apply(this, arguments);
    };
  }();
  var handleImport = /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(event) {
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            _context9.n = 1;
            return importData(db, event, setSettings, setMasterData, setStudents, setModal);
          case 1:
            return _context9.a(2);
        }
      }, _callee9);
    }));
    return function handleImport(_x6) {
      return _ref9.apply(this, arguments);
    };
  }();
  var handleUndo = /*#__PURE__*/function () {
    var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            _context0.n = 1;
            return undo(db, history, historyIndex, setHistoryIndex, setStudents);
          case 1:
            return _context0.a(2);
        }
      }, _callee0);
    }));
    return function handleUndo() {
      return _ref0.apply(this, arguments);
    };
  }();
  var handleRedo = /*#__PURE__*/function () {
    var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            _context1.n = 1;
            return redo(db, history, historyIndex, setHistoryIndex, setStudents);
          case 1:
            return _context1.a(2);
        }
      }, _callee1);
    }));
    return function handleRedo() {
      return _ref1.apply(this, arguments);
    };
  }();
  var handleLoadSampleData = /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            _context10.n = 1;
            return loadSampleData(db, setMasterData, setStudents);
          case 1:
            return _context10.a(2);
        }
      }, _callee10);
    }));
    return function handleLoadSampleData() {
      return _ref10.apply(this, arguments);
    };
  }();
  var handleClearData = /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.n) {
          case 0:
            _context11.n = 1;
            return clearAllData(db, setStudents, setEntries, setSelectedStudent);
          case 1:
            return _context11.a(2);
        }
      }, _callee11);
    }));
    return function handleClearData() {
      return _ref11.apply(this, arguments);
    };
  }();
  if (!db) return /*#__PURE__*/React.createElement("div", null, "Datenbank wird initialisiert...");
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(Header, {
    onMenuClick: function onMenuClick() {
      return setNavOpen(!navOpen);
    }
  }), /*#__PURE__*/React.createElement(Toolbar, {
    selectedStudent: selectedStudent,
    selectedDate: selectedDate,
    onAddStudent: function onAddStudent() {
      return setModal('student');
    },
    onEditStudent: function onEditStudent() {
      return setModal('student');
    },
    onAddEntry: function onAddEntry() {
      return setModal('entry');
    },
    onEditEntry: function onEditEntry() {
      return setModal('entry');
    },
    onPrint: function onPrint() {
      return window.print();
    },
    onExport: handleExport,
    onImport: handleImport,
    onUndo: handleUndo,
    onRedo: handleRedo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  }), /*#__PURE__*/React.createElement(Navigation, {
    isOpen: navOpen,
    students: filteredStudents(),
    selectedStudent: selectedStudent,
    selectedDate: selectedDate,
    filters: filters,
    masterData: masterData,
    onStudentSelect: function onStudentSelect(student) {
      setSelectedStudent(student);
      setViewMode('student');
    },
    onDateSelect: function onDateSelect(date) {
      setSelectedDate(date);
      setViewMode('day');
    },
    onFilterChange: setFilters,
    onShowStats: function onShowStats() {
      return setModal('statistics');
    },
    onShowSettings: function onShowSettings() {
      return setModal('settings');
    },
    onShowHelp: function onShowHelp() {
      return setModal('help');
    }
  }), /*#__PURE__*/React.createElement(MainContent, {
    viewMode: viewMode,
    selectedStudent: selectedStudent,
    selectedDate: selectedDate,
    entries: entries,
    onEditEntry: function onEditEntry() {
      return setModal('entry');
    }
  }), modal === 'student' && /*#__PURE__*/React.createElement(StudentModal, {
    student: selectedStudent,
    masterData: masterData,
    onSave: saveStudent,
    onDelete: deleteStudentHandler,
    onClose: function onClose() {
      return setModal(null);
    }
  }), modal === 'entry' && /*#__PURE__*/React.createElement(EntryModal, {
    entry: viewMode === 'student' && entries.length > 0 ? entries[0] : null,
    student: selectedStudent,
    students: students,
    masterData: masterData,
    onSave: saveEntry,
    onClose: function onClose() {
      return setModal(null);
    }
  }), modal === 'settings' && /*#__PURE__*/React.createElement(SettingsModal, {
    settings: settings,
    masterData: masterData,
    onSave: saveSettings,
    onSaveMasterData: saveMasterData,
    onClose: function onClose() {
      return setModal(null);
    }
  }), modal === 'statistics' && /*#__PURE__*/React.createElement(StatisticsModal, {
    students: students,
    entries: entries,
    onClose: function onClose() {
      return setModal(null);
    }
  }), modal === 'help' && /*#__PURE__*/React.createElement(HelpModal, {
    onLoadSampleData: handleLoadSampleData,
    onClearData: handleClearData,
    onClose: function onClose() {
      return setModal(null);
    }
  }));
};

// React App rendern
var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));
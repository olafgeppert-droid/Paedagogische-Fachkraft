"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Datenbank-Setup
var setupDB = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          return _context.a(2, idb.openDB('PedagogicalDocumentationDB', 1, {
            upgrade: function upgrade(db) {
              if (!db.objectStoreNames.contains('students')) {
                var studentStore = db.createObjectStore('students', {
                  keyPath: 'id',
                  autoIncrement: true
                });
                studentStore.createIndex('name', 'name', {
                  unique: false
                });
                studentStore.createIndex('schoolYear', 'schoolYear', {
                  unique: false
                });
                studentStore.createIndex('school', 'school', {
                  unique: false
                });
                studentStore.createIndex('className', 'className', {
                  unique: false
                });
              }
              if (!db.objectStoreNames.contains('entries')) {
                var entryStore = db.createObjectStore('entries', {
                  keyPath: 'id',
                  autoIncrement: true
                });
                entryStore.createIndex('studentId', 'studentId', {
                  unique: false
                });
                entryStore.createIndex('date', 'date', {
                  unique: false
                });
              }
              if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', {
                  keyPath: 'id'
                });
              }
              if (!db.objectStoreNames.contains('masterData')) {
                db.createObjectStore('masterData', {
                  keyPath: 'id'
                });
              }
              if (!db.objectStoreNames.contains('history')) {
                db.createObjectStore('history', {
                  keyPath: 'id',
                  autoIncrement: true
                });
              }
            }
          }));
      }
    }, _callee);
  }));
  return function setupDB() {
    return _ref.apply(this, arguments);
  };
}();

// Schüler-Funktionen
var getEntriesByStudentId = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(db, studentId) {
    var index;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          index = db.transaction('entries').store.index('studentId');
          _context2.n = 1;
          return index.getAll(studentId);
        case 1:
          return _context2.a(2, _context2.v);
      }
    }, _callee2);
  }));
  return function getEntriesByStudentId(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();
var getEntriesByDate = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(db, date) {
    var index;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          index = db.transaction('entries').store.index('date');
          _context3.n = 1;
          return index.getAll(date);
        case 1:
          return _context3.a(2, _context3.v);
      }
    }, _callee3);
  }));
  return function getEntriesByDate(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
var addStudent = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(db, studentData) {
    var id;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return db.add('students', studentData);
        case 1:
          id = _context4.v;
          return _context4.a(2, _objectSpread(_objectSpread({}, studentData), {}, {
            id: id
          }));
      }
    }, _callee4);
  }));
  return function addStudent(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();
var updateStudent = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(db, studentData) {
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return db.put('students', studentData);
        case 1:
          return _context5.a(2, _context5.v);
      }
    }, _callee5);
  }));
  return function updateStudent(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();
var deleteStudent = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(db, studentId) {
    var tx, entryStore, index, cursor, _t;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          // Zuerst alle Einträge des Schülers löschen
          tx = db.transaction('entries', 'readwrite');
          entryStore = tx.objectStore('entries');
          index = entryStore.index('studentId');
          _context6.n = 1;
          return index.openCursor(IDBKeyRange.only(studentId));
        case 1:
          cursor = _context6.v;
        case 2:
          if (!cursor) {
            _context6.n = 5;
            break;
          }
          _context6.n = 3;
          return entryStore["delete"](cursor.primaryKey);
        case 3:
          _context6.n = 4;
          return cursor["continue"]();
        case 4:
          cursor = _context6.v;
          _context6.n = 2;
          break;
        case 5:
          _context6.n = 6;
          return db["delete"]('students', studentId);
        case 6:
          return _context6.a(2, true);
        case 7:
          _context6.p = 7;
          _t = _context6.v;
          console.error('Fehler beim Löschen des Schülers:', _t);
          return _context6.a(2, false);
      }
    }, _callee6, null, [[0, 7]]);
  }));
  return function deleteStudent(_x9, _x0) {
    return _ref6.apply(this, arguments);
  };
}();

// Eintrag-Funktionen
var addEntry = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(db, entryData) {
    var id;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.n = 1;
          return db.add('entries', entryData);
        case 1:
          id = _context7.v;
          return _context7.a(2, _objectSpread(_objectSpread({}, entryData), {}, {
            id: id
          }));
      }
    }, _callee7);
  }));
  return function addEntry(_x1, _x10) {
    return _ref7.apply(this, arguments);
  };
}();
var updateEntry = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(db, entryData) {
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          _context8.n = 1;
          return db.put('entries', entryData);
        case 1:
          return _context8.a(2, _context8.v);
      }
    }, _callee8);
  }));
  return function updateEntry(_x11, _x12) {
    return _ref8.apply(this, arguments);
  };
}();
var deleteEntry = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(db, entryId) {
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          _context9.n = 1;
          return db["delete"]('entries', entryId);
        case 1:
          return _context9.a(2, _context9.v);
      }
    }, _callee9);
  }));
  return function deleteEntry(_x13, _x14) {
    return _ref9.apply(this, arguments);
  };
}();

// Einstellungen-Funktionen
var getSettings = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(db) {
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          _context0.n = 1;
          return db.get('settings', 1);
        case 1:
          return _context0.a(2, _context0.v);
      }
    }, _callee0);
  }));
  return function getSettings(_x15) {
    return _ref0.apply(this, arguments);
  };
}();
var saveSettings = /*#__PURE__*/function () {
  var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(db, settings) {
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          _context1.n = 1;
          return db.put('settings', _objectSpread(_objectSpread({}, settings), {}, {
            id: 1
          }));
        case 1:
          return _context1.a(2, _context1.v);
      }
    }, _callee1);
  }));
  return function saveSettings(_x16, _x17) {
    return _ref1.apply(this, arguments);
  };
}();

// Master-Daten-Funktionen
var getMasterData = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(db) {
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          _context10.n = 1;
          return db.get('masterData', 1);
        case 1:
          return _context10.a(2, _context10.v);
      }
    }, _callee10);
  }));
  return function getMasterData(_x18) {
    return _ref10.apply(this, arguments);
  };
}();
var saveMasterData = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(db, masterData) {
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          _context11.n = 1;
          return db.put('masterData', _objectSpread(_objectSpread({}, masterData), {}, {
            id: 1
          }));
        case 1:
          return _context11.a(2, _context11.v);
      }
    }, _callee11);
  }));
  return function saveMasterData(_x19, _x20) {
    return _ref11.apply(this, arguments);
  };
}();

// History-Funktionen
var saveStateForUndo = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(db, history, setHistory, setHistoryIndex) {
    var allStudents, allEntries, currentState, newHistory, _t2;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          _context12.p = 0;
          _context12.n = 1;
          return db.getAll('students');
        case 1:
          allStudents = _context12.v;
          _context12.n = 2;
          return db.getAll('entries');
        case 2:
          allEntries = _context12.v;
          currentState = {
            students: allStudents,
            entries: allEntries,
            timestamp: new Date().toISOString()
          }; // Nur die letzten 50 Zustände behalten
          newHistory = history.slice(0, historyIndex + 1);
          newHistory.push(currentState);
          if (newHistory.length > 50) {
            newHistory.shift();
          }
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
          _context12.n = 4;
          break;
        case 3:
          _context12.p = 3;
          _t2 = _context12.v;
          console.error('Fehler beim Speichern des Zustands für Undo:', _t2);
        case 4:
          return _context12.a(2);
      }
    }, _callee12, null, [[0, 3]]);
  }));
  return function saveStateForUndo(_x21, _x22, _x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();

// Daten-Export-Funktion
var exportData = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(db) {
    var allStudents, allEntries, settingsData, masterData, _exportData, dataStr, dataUri, exportFileDefaultName, linkElement, _t3;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.p = _context13.n) {
        case 0:
          _context13.p = 0;
          _context13.n = 1;
          return db.getAll('students');
        case 1:
          allStudents = _context13.v;
          _context13.n = 2;
          return db.getAll('entries');
        case 2:
          allEntries = _context13.v;
          _context13.n = 3;
          return db.get('settings', 1);
        case 3:
          settingsData = _context13.v;
          _context13.n = 4;
          return db.get('masterData', 1);
        case 4:
          masterData = _context13.v;
          _exportData = {
            students: allStudents,
            entries: allEntries,
            settings: settingsData,
            masterData: masterData,
            exportDate: new Date().toISOString()
          };
          dataStr = JSON.stringify(_exportData, null, 2);
          dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
          exportFileDefaultName = 'paedagogische-dokumentation-export.json';
          linkElement = document.createElement('a');
          linkElement.setAttribute('href', dataUri);
          linkElement.setAttribute('download', exportFileDefaultName);
          linkElement.click();
          _context13.n = 6;
          break;
        case 5:
          _context13.p = 5;
          _t3 = _context13.v;
          console.error('Fehler beim Exportieren der Daten:', _t3);
          alert('Fehler beim Exportieren der Daten: ' + _t3.message);
        case 6:
          return _context13.a(2);
      }
    }, _callee13, null, [[0, 5]]);
  }));
  return function exportData(_x25) {
    return _ref13.apply(this, arguments);
  };
}();

// Daten-Import-Funktion
var importData = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(db, event, setSettings, setMasterData, setStudents, setModal) {
    var file, reader;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          file = event.target.files[0];
          if (file) {
            _context15.n = 1;
            break;
          }
          return _context15.a(2);
        case 1:
          reader = new FileReader();
          reader.onload = /*#__PURE__*/function () {
            var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(e) {
              var _importData, _iterator, _step, student, _iterator2, _step2, entry, allStudents, _t4, _t5, _t6;
              return _regenerator().w(function (_context14) {
                while (1) switch (_context14.p = _context14.n) {
                  case 0:
                    _context14.p = 0;
                    _importData = JSON.parse(e.target.result); // Alte Daten löschen
                    _context14.n = 1;
                    return db.clear('students');
                  case 1:
                    _context14.n = 2;
                    return db.clear('entries');
                  case 2:
                    // Neue Daten importieren
                    _iterator = _createForOfIteratorHelper(_importData.students);
                    _context14.p = 3;
                    _iterator.s();
                  case 4:
                    if ((_step = _iterator.n()).done) {
                      _context14.n = 6;
                      break;
                    }
                    student = _step.value;
                    _context14.n = 5;
                    return db.add('students', student);
                  case 5:
                    _context14.n = 4;
                    break;
                  case 6:
                    _context14.n = 8;
                    break;
                  case 7:
                    _context14.p = 7;
                    _t4 = _context14.v;
                    _iterator.e(_t4);
                  case 8:
                    _context14.p = 8;
                    _iterator.f();
                    return _context14.f(8);
                  case 9:
                    _iterator2 = _createForOfIteratorHelper(_importData.entries);
                    _context14.p = 10;
                    _iterator2.s();
                  case 11:
                    if ((_step2 = _iterator2.n()).done) {
                      _context14.n = 13;
                      break;
                    }
                    entry = _step2.value;
                    _context14.n = 12;
                    return db.add('entries', entry);
                  case 12:
                    _context14.n = 11;
                    break;
                  case 13:
                    _context14.n = 15;
                    break;
                  case 14:
                    _context14.p = 14;
                    _t5 = _context14.v;
                    _iterator2.e(_t5);
                  case 15:
                    _context14.p = 15;
                    _iterator2.f();
                    return _context14.f(15);
                  case 16:
                    if (!_importData.settings) {
                      _context14.n = 18;
                      break;
                    }
                    _context14.n = 17;
                    return db.put('settings', _importData.settings);
                  case 17:
                    setSettings(_importData.settings);
                  case 18:
                    if (!_importData.masterData) {
                      _context14.n = 20;
                      break;
                    }
                    _context14.n = 19;
                    return db.put('masterData', _importData.masterData);
                  case 19:
                    setMasterData(_importData.masterData);
                  case 20:
                    _context14.n = 21;
                    return db.getAll('students');
                  case 21:
                    allStudents = _context14.v;
                    setStudents(allStudents);
                    setModal(null);
                    alert('Daten erfolgreich importiert!');
                    _context14.n = 23;
                    break;
                  case 22:
                    _context14.p = 22;
                    _t6 = _context14.v;
                    console.error('Fehler beim Importieren der Daten:', _t6);
                    alert('Fehler beim Importieren der Daten: ' + _t6.message);
                  case 23:
                    return _context14.a(2);
                }
              }, _callee14, null, [[10, 14, 15, 16], [3, 7, 8, 9], [0, 22]]);
            }));
            return function (_x32) {
              return _ref15.apply(this, arguments);
            };
          }();
          reader.readAsText(file);
        case 2:
          return _context15.a(2);
      }
    }, _callee15);
  }));
  return function importData(_x26, _x27, _x28, _x29, _x30, _x31) {
    return _ref14.apply(this, arguments);
  };
}();

// Undo-Funktion
var undo = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(db, history, historyIndex, setHistoryIndex, setStudents) {
    var previousState, _iterator3, _step3, student, _iterator4, _step4, entry, allStudents, _t7, _t8, _t9;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.p = _context16.n) {
        case 0:
          if (!(historyIndex <= 0 || !db)) {
            _context16.n = 1;
            break;
          }
          return _context16.a(2);
        case 1:
          _context16.p = 1;
          previousState = history[historyIndex - 1]; // Alte Daten löschen
          _context16.n = 2;
          return db.clear('students');
        case 2:
          _context16.n = 3;
          return db.clear('entries');
        case 3:
          // Vorherigen Zustand wiederherstellen
          _iterator3 = _createForOfIteratorHelper(previousState.students);
          _context16.p = 4;
          _iterator3.s();
        case 5:
          if ((_step3 = _iterator3.n()).done) {
            _context16.n = 7;
            break;
          }
          student = _step3.value;
          _context16.n = 6;
          return db.add('students', student);
        case 6:
          _context16.n = 5;
          break;
        case 7:
          _context16.n = 9;
          break;
        case 8:
          _context16.p = 8;
          _t7 = _context16.v;
          _iterator3.e(_t7);
        case 9:
          _context16.p = 9;
          _iterator3.f();
          return _context16.f(9);
        case 10:
          _iterator4 = _createForOfIteratorHelper(previousState.entries);
          _context16.p = 11;
          _iterator4.s();
        case 12:
          if ((_step4 = _iterator4.n()).done) {
            _context16.n = 14;
            break;
          }
          entry = _step4.value;
          _context16.n = 13;
          return db.add('entries', entry);
        case 13:
          _context16.n = 12;
          break;
        case 14:
          _context16.n = 16;
          break;
        case 15:
          _context16.p = 15;
          _t8 = _context16.v;
          _iterator4.e(_t8);
        case 16:
          _context16.p = 16;
          _iterator4.f();
          return _context16.f(16);
        case 17:
          _context16.n = 18;
          return db.getAll('students');
        case 18:
          allStudents = _context16.v;
          setStudents(allStudents);
          setHistoryIndex(historyIndex - 1);
          _context16.n = 20;
          break;
        case 19:
          _context16.p = 19;
          _t9 = _context16.v;
          console.error('Fehler beim Undo:', _t9);
        case 20:
          return _context16.a(2);
      }
    }, _callee16, null, [[11, 15, 16, 17], [4, 8, 9, 10], [1, 19]]);
  }));
  return function undo(_x33, _x34, _x35, _x36, _x37) {
    return _ref16.apply(this, arguments);
  };
}();

// Redo-Funktion
var redo = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(db, history, historyIndex, setHistoryIndex, setStudents) {
    var nextState, _iterator5, _step5, student, _iterator6, _step6, entry, allStudents, _t0, _t1, _t10;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.p = _context17.n) {
        case 0:
          if (!(historyIndex >= history.length - 1 || !db)) {
            _context17.n = 1;
            break;
          }
          return _context17.a(2);
        case 1:
          _context17.p = 1;
          nextState = history[historyIndex + 1]; // Alte Daten löschen
          _context17.n = 2;
          return db.clear('students');
        case 2:
          _context17.n = 3;
          return db.clear('entries');
        case 3:
          // Nächsten Zustand wiederherstellen
          _iterator5 = _createForOfIteratorHelper(nextState.students);
          _context17.p = 4;
          _iterator5.s();
        case 5:
          if ((_step5 = _iterator5.n()).done) {
            _context17.n = 7;
            break;
          }
          student = _step5.value;
          _context17.n = 6;
          return db.add('students', student);
        case 6:
          _context17.n = 5;
          break;
        case 7:
          _context17.n = 9;
          break;
        case 8:
          _context17.p = 8;
          _t0 = _context17.v;
          _iterator5.e(_t0);
        case 9:
          _context17.p = 9;
          _iterator5.f();
          return _context17.f(9);
        case 10:
          _iterator6 = _createForOfIteratorHelper(nextState.entries);
          _context17.p = 11;
          _iterator6.s();
        case 12:
          if ((_step6 = _iterator6.n()).done) {
            _context17.n = 14;
            break;
          }
          entry = _step6.value;
          _context17.n = 13;
          return db.add('entries', entry);
        case 13:
          _context17.n = 12;
          break;
        case 14:
          _context17.n = 16;
          break;
        case 15:
          _context17.p = 15;
          _t1 = _context17.v;
          _iterator6.e(_t1);
        case 16:
          _context17.p = 16;
          _iterator6.f();
          return _context17.f(16);
        case 17:
          _context17.n = 18;
          return db.getAll('students');
        case 18:
          allStudents = _context17.v;
          setStudents(allStudents);
          setHistoryIndex(historyIndex + 1);
          _context17.n = 20;
          break;
        case 19:
          _context17.p = 19;
          _t10 = _context17.v;
          console.error('Fehler beim Redo:', _t10);
        case 20:
          return _context17.a(2);
      }
    }, _callee17, null, [[11, 15, 16, 17], [4, 8, 9, 10], [1, 19]]);
  }));
  return function redo(_x38, _x39, _x40, _x41, _x42) {
    return _ref17.apply(this, arguments);
  };
}();

// Beispieldaten laden
var loadSampleData = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(db, setMasterData, setStudents) {
    var sampleStudents, sampleEntries, _i, _sampleStudents, student, _i2, _sampleEntries, entry, sampleMasterData, allStudents, _t11;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.p = _context18.n) {
        case 0:
          if (db) {
            _context18.n = 1;
            break;
          }
          return _context18.a(2);
        case 1:
          _context18.p = 1;
          _context18.n = 2;
          return db.clear('students');
        case 2:
          _context18.n = 3;
          return db.clear('entries');
        case 3:
          // Beispieldaten
          sampleStudents = [{
            name: 'Max Mustermann',
            schoolYear: '2023/2024',
            school: 'Grundschule Musterstadt',
            className: '3a',
            gender: 'männlich',
            nationality: 'deutsch',
            germanLevel: 2,
            notes: 'Sehr aufmerksamer Schüler'
          }, {
            name: 'Anna Beispiel',
            schoolYear: '2023/2024',
            school: 'Grundschule Musterstadt',
            className: '3b',
            gender: 'weiblich',
            nationality: 'deutsch',
            germanLevel: 1,
            notes: 'Braucht Unterstützung in Mathematik'
          }];
          sampleEntries = [{
            studentId: 1,
            date: new Date().toISOString().split('T')[0],
            subject: 'Mathematik',
            observations: 'Max hat heute sehr gut mitgearbeitet und alle Aufgaben gelöst.',
            measures: 'Positive Verstärkung durch Lob',
            erfolg: 'Max war stolz auf seine Leistung und motiviert für weitere Aufgaben.',
            erfolgRating: 'positiv'
          }, {
            studentId: 2,
            date: new Date().toISOString().split('T')[0],
            subject: 'Deutsch',
            observations: 'Anna hatte Schwierigkeiten mit der Rechtschreibung.',
            measures: 'Individuelle Förderung angeboten',
            erfolg: 'Anna hat die Hilfe angenommen und Fortschritte gezeigt.',
            erfolgRating: 'positiv'
          }]; // Beispieldaten hinzufügen
          _i = 0, _sampleStudents = sampleStudents;
        case 4:
          if (!(_i < _sampleStudents.length)) {
            _context18.n = 6;
            break;
          }
          student = _sampleStudents[_i];
          _context18.n = 5;
          return db.add('students', student);
        case 5:
          _i++;
          _context18.n = 4;
          break;
        case 6:
          _i2 = 0, _sampleEntries = sampleEntries;
        case 7:
          if (!(_i2 < _sampleEntries.length)) {
            _context18.n = 9;
            break;
          }
          entry = _sampleEntries[_i2];
          _context18.n = 8;
          return db.add('entries', entry);
        case 8:
          _i2++;
          _context18.n = 7;
          break;
        case 9:
          // Beispieldaten für Master-Daten
          sampleMasterData = {
            schoolYears: ['2022/2023', '2023/2024', '2024/2025'],
            schools: {
              'Grundschule Musterstadt': ['1a', '1b', '2a', '2b', '3a', '3b', '4a', '4b'],
              'Mittelschule Beispieldorf': ['5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b']
            }
          };
          _context18.n = 10;
          return db.put('masterData', _objectSpread(_objectSpread({}, sampleMasterData), {}, {
            id: 1
          }));
        case 10:
          setMasterData(sampleMasterData);

          // Daten neu laden
          _context18.n = 11;
          return db.getAll('students');
        case 11:
          allStudents = _context18.v;
          setStudents(allStudents);
          alert('Beispieldaten erfolgreich geladen!');
          _context18.n = 13;
          break;
        case 12:
          _context18.p = 12;
          _t11 = _context18.v;
          console.error('Fehler beim Laden der Beispieldaten:', _t11);
        case 13:
          return _context18.a(2);
      }
    }, _callee18, null, [[1, 12]]);
  }));
  return function loadSampleData(_x43, _x44, _x45) {
    return _ref18.apply(this, arguments);
  };
}();

// Alle Daten löschen
var clearAllData = /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(db, setStudents, setEntries, setSelectedStudent) {
    var _t12;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.p = _context19.n) {
        case 0:
          if (db) {
            _context19.n = 1;
            break;
          }
          return _context19.a(2);
        case 1:
          if (confirm('Sind Sie sicher, dass Sie alle Daten löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.')) {
            _context19.n = 2;
            break;
          }
          return _context19.a(2);
        case 2:
          _context19.p = 2;
          _context19.n = 3;
          return db.clear('students');
        case 3:
          _context19.n = 4;
          return db.clear('entries');
        case 4:
          setStudents([]);
          setEntries([]);
          setSelectedStudent(null);
          alert('Alle Daten wurden gelöscht!');
          _context19.n = 6;
          break;
        case 5:
          _context19.p = 5;
          _t12 = _context19.v;
          console.error('Fehler beim Löschen der Daten:', _t12);
        case 6:
          return _context19.a(2);
      }
    }, _callee19, null, [[2, 5]]);
  }));
  return function clearAllData(_x46, _x47, _x48, _x49) {
    return _ref19.apply(this, arguments);
  };
}();
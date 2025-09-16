"use strict";

var Toolbar = function Toolbar(_ref) {
  var selectedStudent = _ref.selectedStudent,
    selectedDate = _ref.selectedDate,
    onAddStudent = _ref.onAddStudent,
    onEditStudent = _ref.onEditStudent,
    onAddEntry = _ref.onAddEntry,
    onEditEntry = _ref.onEditEntry,
    onPrint = _ref.onPrint,
    onExport = _ref.onExport,
    onImport = _ref.onImport,
    onUndo = _ref.onUndo,
    onRedo = _ref.onRedo,
    canUndo = _ref.canUndo,
    canRedo = _ref.canRedo;
  return /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "toolbar-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "button",
    onClick: onAddStudent
  }, "\uD83D\uDC65 Kind hinzuf\xFCgen"), /*#__PURE__*/React.createElement("button", {
    className: "button",
    onClick: onEditStudent,
    disabled: !selectedStudent
  }, "\u270F\uFE0F Kind bearbeiten/l\xF6schen"), /*#__PURE__*/React.createElement("button", {
    className: "button",
    onClick: onAddEntry,
    disabled: !selectedStudent && !selectedDate
  }, "\uD83D\uDCDD Protokoll anlegen"), /*#__PURE__*/React.createElement("button", {
    className: "button",
    onClick: onEditEntry,
    disabled: !selectedStudent && !selectedDate
  }, "\uD83D\uDD27 Protokoll bearbeiten/l\xF6schen")), /*#__PURE__*/React.createElement("div", {
    className: "toolbar-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "button",
    onClick: onPrint
  }, "\uD83D\uDDA8\uFE0F Drucken"), /*#__PURE__*/React.createElement("button", {
    className: "button",
    onClick: onExport
  }, "\uD83D\uDCBE Datenexport"), /*#__PURE__*/React.createElement("label", {
    htmlFor: "import-file",
    className: "button"
  }, "\uD83D\uDCE5 Datenimport", /*#__PURE__*/React.createElement("input", {
    id: "import-file",
    type: "file",
    accept: ".json",
    style: {
      display: 'none'
    },
    onChange: onImport
  })), /*#__PURE__*/React.createElement("button", {
    className: "button",
    onClick: onUndo,
    disabled: !canUndo
  }, "\u21A9\uFE0F R\xFCckg\xE4ngig"), /*#__PURE__*/React.createElement("button", {
    className: "button",
    onClick: onRedo,
    disabled: !canRedo
  }, "\u21AA\uFE0F Wiederholen")));
};
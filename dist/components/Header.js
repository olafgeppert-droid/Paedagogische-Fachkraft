"use strict";

var Header = function Header(_ref) {
  var onMenuClick = _ref.onMenuClick;
  var currentDate = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return /*#__PURE__*/React.createElement("header", {
    className: "header"
  }, /*#__PURE__*/React.createElement("button", {
    className: "hamburger-menu",
    onClick: onMenuClick
  }, "\u2630"), /*#__PURE__*/React.createElement("h1", null, "Dokumentation p\xE4dagogische Arbeit - Irina Geppert"), /*#__PURE__*/React.createElement("span", {
    className: "header-date"
  }, currentDate));
};
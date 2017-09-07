(function() {
  var dialogScrollable = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-with-list'));
  document.querySelector('#dialog-with-list-activation').addEventListener('click', function (evt) {
    dialogScrollable.lastFocusedTarget = evt.target;
    dialogScrollable.show();
  });
})();
(function() {
  //mdc.dialog.MDCDialog.attachTo(document.querySelector('.mdc-dialog'));

  // Hack to work around style-loader async loading styles
  setTimeout(function() {
    mdc.ripple.MDCRipple.attachTo(document.querySelector('#dialog-with-list-activation'));
  }, 200);
})();
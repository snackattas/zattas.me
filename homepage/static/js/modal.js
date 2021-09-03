$( document ).ready( function () {
  MicroModal.init({debugModal: true});
  // MicroModal.init({
  //
  //     onShow: modal => console.info(`${modal.id} is shown`), // [1]
  //     onClose: modal => console.info(`${modal.id} is hidden`), // [2]
  //     // openTrigger: 'data-custom-open', // [3]
  //     // closeTrigger: 'data-custom-close', // [4]
  //     disableScroll: true, // [5]
  //     disableFocus: false, // [6]
  //     awaitCloseAnimation: false, // [7]
  //     debugMode: true // [8]
  //   });
  // MicroModal.show("seleniumFun");
  // }

  // code to have the switch code radio buttons in the modal switch the code samples
  var radios = document.getElementsByName('select')
  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function() {
      var innerRadios = document.getElementsByName('select')
      for (var i2 = 0; i2 < innerRadios.length; i2++) {
        if (innerRadios[i2].checked) {
          // console.log(`${innerRadios[i2].id}code` + ' in checked')
          document.getElementById(`${innerRadios[i2].id}code`).style.display = 'block'
        } else {
          // console.log(`${innerRadios[i2].id}code` + ' in NOT checked')
          document.getElementById(`${innerRadios[i2].id}code`).style.display = 'none'
        }
      }
    })
  }
});

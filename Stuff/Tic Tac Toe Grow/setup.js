(() => {

   let promise = fetch('https://raw.githubusercontent.com/icecream17/icecream17.github.io/master/Stuff/Tic%20Tac%20Toe%20Grow/game.html')
   promise.then(success, uhoh)

   function success(response) {
      console.log(response);
      if (!response.ok) {
         throw Error("Response !== 200 OK, got: " + reponse.status)
      }
      let text = reponse.text()
      return setDocumentTo(text)
   }

   function uhoh(rejectionReason) {
      throw rejectionReason
   }

   function setDocumentTo(text) {
      text = text.split('\n').slice(1).join('\n');
      document.documentElement.innerHTML = text;
   }

})()

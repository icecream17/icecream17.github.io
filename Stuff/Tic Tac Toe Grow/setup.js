(() => {
   setProgress(17);
   fetch('https://raw.githubusercontent.com/icecream17/icecream17.github.io/master/Stuff/Tic%20Tac%20Toe%20Grow/game.html').then(success, uhoh)

   async function success(response) {
      setProgress(42);
      console.log(response);
      setProgress(52);
      if (!response.ok) throw Error("Response !== 200 OK, got: " + response.status);
      setProgress(57);
      let text = await response.text();
      setProgress(85);
      return setDocumentTo(text);
   }

   function uhoh(rejectionReason) {
      throw rejectionReason;
   }

   function setDocumentTo(text) {
      setProgress(95);
      text = text.split('\n').slice(1).join('\n');
      setProgress(99);
      document.documentElement.innerHTML = text;
   }
   
   function setProgress(number) {
      document.getElementById("Loading").value = number;
   }

})()

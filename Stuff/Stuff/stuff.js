setTimeout(
   () => {
       let name = prompt("hi\n" + "what's your name?")
       
       if (name === "Infinity") {
          alert("Wow, that's big")
       } else {
          alert("Hi " + name)
       }
   }, 2000
)

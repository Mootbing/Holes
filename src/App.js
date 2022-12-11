import React, { useEffect, useState } from 'react';
import { MDBBtn, MDBContainer } from 'mdb-react-ui-kit';

import { MDBFileUpload } from 'mdb-react-file-upload';

function App() {

  const [words, setWords] = useState([]);
  const [exampled, setExampled] = useState([]);


  useEffect(() => {
    for (var word of words){
      fetch(`https://api.wordnik.com/v4/word.json/${word}/examples?includeDuplicates=false&useCanonical=false&limit=${5}&api_key=`).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
        setExampled(data.examples.map(data => data.text.replace(word, "__BLANK__")));
      });
    }

  }, [words])

  console.log(words)
  

  return (
    <MDBContainer style={{paddingTop: 75, color: "#fff"}}>
      {words.length === 0 && <>
      <h1>Upload a .txt file</h1>
      <p>Split each word on new line</p>
      <MDBFileUpload 
        getInputFiles={(files) => {

          if (files.length === 0)
          {
            return
          }

          var read = new FileReader();
          read.readAsBinaryString(files[0]);

          read.onloadend = function () {
              setWords(read.result.split("\n"));
          }
        }}
        style={{backgroundColor: "#fff", color: "#505050", borderRadius: 15, height: 150}}
        acceptedExtensions={[".txt"]}
        disabledRemoveButton
        /></>}
    </MDBContainer>
  );
}

export default App;

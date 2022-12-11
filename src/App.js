import React, { useEffect, useState } from 'react';
import { MDBBtn, MDBCard, MDBContainer, MDBIcon, MDBInput, MDBTextArea } from 'mdb-react-ui-kit';

import { MDBFileUpload } from 'mdb-react-file-upload';

const WordCard = ({word = "larry is trash", example = "The cow left his __BLANK__ back at home."}) => {

  const [state, setState] = useState("answering");

  return (
    <MDBCard style={{backgroundColor: "#202020", borderRadius: 15, padding: 25, marginBottom: 20, width: "100%"}}>
      {state === "answering" && <center>
        <MDBContainer flex style={{marginBottom: 25}}>
          {example.split("__BLANK__").map((word, index) => <><p style={{display: "inline"}}>{word}</p>{index != example.split("__BLANK__").length - 1 && <input style={{display: "inline", backgroundColor: "#202020", border: "none", borderBottom: "1px solid #fff", color: "white", width: 100}}/>}</>)}
        </MDBContainer>
        
        <center style={{position: "absolute", right: 0}}>
        <MDBContainer flex>
          <MDBBtn onClick={() => {
            setState("revealed");
          }} style={{position: "absolute", right: "34vw", width: 140, backgroundColor: "#2d2d2d", color: "#aea", boxShadow: "none", borderRadius: 100}}><MDBIcon icon="check-circle" className="me-2"/></MDBBtn>
          <MDBBtn onClick={() => {
            setState("revealed");
          }} style={{width: 60, backgroundColor: "#2d2d2d", color: "#ff9494", boxShadow: "none", borderRadius: 100}} className="me-2"><MDBIcon icon="question-circle" /></MDBBtn>
          <MDBBtn onClick={() => {
            setState("revealed");
          }} style={{width: 60, backgroundColor: "#2d2d2d", color: "#ff9494", boxShadow: "none", borderRadius: 100}} className="me-2"><MDBIcon icon="ban" /></MDBBtn>
          </MDBContainer>
          </center>
      </center>}
      {state === "revealed" && <>
        <h2 style={{color: "#aea"}}>{word[0].toUpperCase() + word.slice(1)}</h2>
        <p>{example}</p>
        <MDBBtn style={{backgroundColor: "#2d2d2d", color: "#aea", border: "1px solid #aea", boxShadow: "none", borderRadius: 10}}>Next</MDBBtn>
      </>}
    </MDBCard>
  )
}

function App() {

  const [words, setWords] = useState([]);
  const [exampled, setExampled] = useState([]);


  useEffect(() => {
    for (var word of words){
      console.log(word)
      // fetch(`https://api.wordnik.com/v4/word.json/${word}/examples?includeDuplicates=false&useCanonical=false&limit=${5}&api_key=`).then((response) => {
      //   return response.json();
      // }).then((data) => {
      //   console.log(data);
      //   setExampled(data.examples.map(data => data.text.replace(word, "__BLANK__")));
      // });
    }

  }, [words])

  // console.log(words)

  return (
    <MDBContainer style={{paddingTop: 75, color: "#fff"}}>
      {words.length === 0 ? <>
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
        style={{backgroundColor: "#2d2d2d", color: "#fff", borderRadius: 15, height: 150}}
        acceptedExtensions={[".txt"]}
        disabledRemoveButton
        /></> : <>
          {words.map((word, index) => {
            return <WordCard word={word} example={exampled[index]} />
          })}
        </>}
    </MDBContainer>
  );
}

export default App;

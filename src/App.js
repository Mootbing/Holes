import React, { useEffect, useRef, useState } from 'react';
import { MDBBtn, MDBCard, MDBContainer, MDBIcon, MDBInput, MDBModal, MDBTextArea, MDBTooltip } from 'mdb-react-ui-kit';

import { MDBFileUpload } from 'mdb-react-file-upload';
import { key } from './Secrets';

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': key,
		'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
	}
};

const WordCard = ({word = "bad at cod", example = "The cow left his __BLANK__ back at home.", definition = "skill issue"}) => {

  example = example.replace(word, "__BLANK__")

  const [state, setState] = useState("answering");
  const [correctState, setCorrectState] = useState("not answered");
  const [needsHint, setNeedsHint] = useState(false);

  const [value, setValue] = useState("");

  const [eachHeight, setEachHeight] = useState(0);
  
  useEffect(() => {
    setEachHeight(window.innerHeight - 200);
  }, [])

  if (state === "done")
  {
    return null;
  }

  const check = () => {
    if (value.toLowerCase() === word.toLowerCase())
    {
      setCorrectState("correct");
      setState("revealed");
    }
    else
    {
      setCorrectState("incorrect");
    }
  }

  return (
    <MDBContainer className="align-items-center justify-content-center d-flex" style={{width: "100%", height: eachHeight}}>
      <MDBCard style={{backgroundColor: "#202020", borderRadius: 15, marginTop: -25, padding: 25, marginBottom: 20, width: "100%", border: correctState === "correct" ?  "2px solid #aea" :  correctState === "incorrect" ? "2px solid #ff9494" : "none"}}>
        {state === "answering" && <center>
          <MDBContainer flex style={{marginBottom: 25}}>
            {example.split("__BLANK__").map((part, index) => <>
              <p style={{display: "inline"}}>{part}</p>
              {index != example.split("__BLANK__").length - 1 && 
              <input
                className="me-2 ms-2" 
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                  {
                    check();
                  }
                }}
              style={{display: "inline", backgroundColor: "#202020", border: "none", borderBottom: "1px solid #fff", color: "white", width: 100}}/>}
            </>)}
          </MDBContainer>
          
          {needsHint && <p style={{marginBottom: 25, color: "#aeaeae"}}><i>{definition}</i></p>}
          
          <center style={{position: "absolute", right: 0}}>
          <MDBContainer flex>
            {/* <MDBTooltip tag="span" placement="top" title="Check"> */}
              <MDBBtn onClick={() => {
                check();
              }} style={{position: "absolute", right: "36vw", width: 140, backgroundColor: "#2d2d2d", color: "#aea", boxShadow: "none", borderRadius: 100}}><MDBIcon icon="check-circle" className="me-2"/></MDBBtn>
              {/* </MDBTooltip> */}
            </MDBContainer>

            {!needsHint && <MDBTooltip tag="span" placement="top" title="Show Definition"><MDBBtn onClick={() => {
              setNeedsHint(true);
            }} style={{width: 60, backgroundColor: "#2d2d2d", color: "#fff", boxShadow: "none", borderRadius: 100}} className="me-2"><MDBIcon icon="question-circle" /></MDBBtn></MDBTooltip>}

            <MDBTooltip tag="span" placement="top" title="Reveal">
              <MDBBtn onClick={() => {
                setState("revealed");
                setCorrectState("incorrect");
              }} style={{width: 60, backgroundColor: "#2d2d2d", color: "#ff9494", boxShadow: "none", borderRadius: 100}} className="me-2"><MDBIcon icon="retweet" /></MDBBtn>
            </MDBTooltip>

            <MDBTooltip tag="span" placement="top" title="Skip">
              <MDBBtn onClick={() => {
                setState("done");
              }} style={{width: 60, backgroundColor: "#2d2d2d", color: "#ff9494", boxShadow: "none", borderRadius: 100}} className="me-2"><MDBIcon icon="ban" /></MDBBtn>
            </MDBTooltip>
            </center>
        </center>}
        {state === "revealed" && <center>
          <h2 style={{color: correctState === "correct" ? "#aea" :  "#ff9494"}}>{word[0].toUpperCase() + word.slice(1)}</h2>
          <MDBContainer flex style={{marginBottom: 25}}>
            {example.split("__BLANK__").map((part, index) => <>
              <p style={{display: "inline"}}>{part}</p>
              {index != example.split("__BLANK__").length - 1 && 
              <b style={{color: correctState === "correct" ? "#aea" :  "#ff9494"}}>{word}</b>}
            </>)}
          </MDBContainer>
          
          <center style={{position: "absolute", right: 0, bottom: -10}}>
          <MDBContainer flex>
            <MDBBtn onClick={() => {
              setState("done");
            }} style={{position: "absolute", right: "36vw", bottom: 0, width: 140, backgroundColor: "#2d2d2d", color: correctState === "correct" ? "#aea" :  "#ff9494", boxShadow: "none", borderRadius: 100}}><MDBIcon icon="check-circle" className="me-2"/>Continue</MDBBtn>
          </MDBContainer>
          </center>
        </center>}
      </MDBCard>
    </MDBContainer>
  )
}

function App() {

  const [words, setWords] = useState([]);
  const [exampled, setExampled] = useState([]);

  const [eachHeight, setEachHeight] = useState(0);

  const [zen, setZen] = useState(false);


  useEffect(() => {
    if (exampled.length !== 0 || words.length === 0)
    {
      return
    }

    const fetchWords = async () => {

      var wordsExampled = [];
      for (var word of words){
        console.log("api called on word: " + word)
        const response = await (await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, options)).json();
        wordsExampled.push(response);
      }

      console.log(wordsExampled)

      //shuffle
      for (var i = wordsExampled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [wordsExampled[i], wordsExampled[j]] = [wordsExampled[j], wordsExampled[i]];
      }

      setExampled(wordsExampled);
    }

    fetchWords();

  }, [words])

  useEffect(() => {
    setEachHeight(window.innerHeight - 400);
  }, [window.innerHeight])

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
            console.log(read.result.split("\n"));
          }
        }}
        style={{backgroundColor: "#2d2d2d", color: "#fff", borderRadius: 15, height: 150}}
        acceptedExtensions={[".txt"]}
        disabledRemoveButton
        /></> : <div style={{width: "100%", height: zen ? eachHeight : "100%", overflow: (zen ? "hidden" : "show")}}>
          <MDBBtn onClick={() => {
            setZen(!zen);
          }} style={{position: "fixed", right: 25, bottom: 25,  backgroundColor: (zen ? "#2d2d2d" : "#fff"), color: "#faf", borderRadius: 15, height: 50, width: 150, boxShadow: "none"}}><MDBIcon icon="sun" className="me-2" />Zen Mode</MDBBtn>
          {exampled.map((struct) => {
            if (struct === undefined || struct.results === undefined)
            {
              console.log(struct)
              return
            }
            return struct.results.map((result) => {
              if (result.examples === undefined)
              {
                return
              }
              return result.examples.map((example) => {
                if (example === undefined)
                {
                  return
                }
                return <WordCard example={example} word={struct.word} definition={result.definition} key={example + struct.word + result.definition}/>
              })
            })
          })}
        </div>}
    </MDBContainer>
  );
}

export default App;

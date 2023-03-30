import React, { useEffect, useRef, useState } from 'react';
import { MDBBtn, MDBCard, MDBContainer, MDBIcon, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBTextArea, MDBTooltip } from 'mdb-react-ui-kit';

import { MDBFileUpload } from 'mdb-react-file-upload';
import { key, openAIAPIKey } from './Secrets';

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: openAIAPIKey,
});
const openai = new OpenAIApi(configuration);

const WordCard = ({word = "bad at cod", example = "The cow left his __BLANK__ back at home.", words, setWords}) => {

  word = word.replace((/  |\r\n|\n|\r|\t/gm),"").toLowerCase();
  example = example.toLowerCase() 
  // console.log(example + " replaces " + word + " with __BLANK__")
  example = example.replace(word, "__BLANK__")

  if (!example.includes("__BLANK__"))
  {
    example = "We're sorry, but we couldn't find an example for this word.";
  }

  const [state, setState] = useState("answering");
  const [correctState, setCorrectState] = useState("not answered");
  const [needsHint, setNeedsHint] = useState(false);

  const [value, setValue] = useState("");

  const [eachHeight, setEachHeight] = useState(0);

  const [definition, setDefinition] = useState("We're sorry, but we couldn't find a definition for this word.");

  useEffect(() => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => response.json())
    .then(data => {
      setDefinition(data[0].meanings[0].partOfSpeech + " | " + data[0].meanings[0].definitions[0].definition);
    });
  }, [])
  
  useEffect(() => {
    setEachHeight(window.innerHeight - 200);

    if (!example.includes("__BLANK__"))
    {
      setCorrectState("correct");
      setState("revealed");
      setNeedsHint(true);
    }
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
      setNeedsHint(true);
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
              style={{display: "inline", backgroundColor: "#202020", border: "none", borderBottom: "1px solid #fff", paddingInlineStart: 10, color: "white", width: 100}}/>}
            </>)}
          </MDBContainer>
          
          {needsHint && <p style={{marginBottom: 25, color: "#aeaeae"}}><i>Definition: {definition}</i></p>}
          
          <center style={{position: "absolute", right: 0, bottom: -15}}>
            <MDBTooltip tag="span" placement="top" title="Check">
            <MDBBtn className='me-5' onClick={() => {
              check();
            }} style={{width: 140, backgroundColor: "#2d2d2d", color: "#aea", boxShadow: "none", borderRadius: 100}}><MDBIcon icon="check-circle" className="me-2"/></MDBBtn>
            </MDBTooltip>

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
                              words.indexOf(word) !== -1 && setWords(words.map((w) => {
                                if (w === word)
                                {
                                  return "";
                                }
                                else
                                {
                                  return w;
                                }
                              }));
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
          
          <center style={{position: "absolute", right: 0, bottom: -17}}>
          <MDBContainer flex>
            <MDBBtn onClick={() => {
              //set current word in words list to ""
              words.indexOf(word) !== -1 && setWords(words.map((w) => {
                if (w === word)
                {
                  return "";
                }
                else
                {
                  return w;
                }
              }));
              setState("done");
            }} style={{width: 140, backgroundColor: "#2d2d2d", color: "#aea", boxShadow: "none", borderRadius: 100}}><MDBIcon icon="check-circle" className="me-2"/>Continue</MDBBtn>
          </MDBContainer>
          </center>
        </center>}
      </MDBCard>
    </MDBContainer>
  )
}

const WordbankCard = ({word, words, setDefine}) => {
  return <div style={{margin: 5, fontSize: 15, padding: 10, borderRadius: 15, backgroundColor: "#303030", color: "white",
    textDecoration: (words.includes(word) ? "none" : "line-through"),
    color: (words.includes(word) ? "white" : "grey")
  }}>
    <p style={{display: "inline"}}>{word}</p>
    <a style={{display: "inline", marginInlineStart: 15, backgroundColor: "white", paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 20}} onClick={() => {
      setDefine(word);
    }}>
      <MDBIcon style={{display: "inline", color: "#121212"}}  icon="book" />
      <p style={{display: "inline", color: "#121212"}}> Define</p>
    </a>
  </div>
}

function App() {

  const [words, setWords] = useState([]);
  const [initialWords, setInitialWords] = useState([]);
  const [exampled, setExampled] = useState([]);
  const [loading, setLoading] = useState(false);
  const [define, setDefine] = useState("");

  const [eachHeight, setEachHeight] = useState(0);

  const [zen, setZen] = useState(false);
  const [sharing, setSharing] = useState(false);
  // const [showWordBank, setShowWordBank] = useState(false);

  useEffect(() => {

    if (initialWords.length !== 0)
    {
      if (words.every((w) => w === ""))
      {
        window.location.href = window.location.href.split("?")[0];
      }
      return;
    }

    if (exampled.length !== 0 || words.length === 0)
    {
      return
    }

    if (!window.location.href.includes("?words="))
    {
      window.location.href = window.location.href + "?words=" + encodeURI(words.join(","));
      return;
    }

    const fetchWords = async () => {

      const fitbs = []

      words.sort(() => Math.random() - 0.5); 

      for (var word of words)
      {
        const pt = `Make a sentence with ${word} [--++--]`;

        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: pt,
          temperature: 0.9, 
          max_tokens: 100,
          top_p: 1,
          frequency_penalty: 1,
          presence_penalty: 1,
          stop: ["[--++--]"],
        });

        fitbs.push(response.data.choices[0].text.replaceAll("\n\n", ""));
      }

      setExampled(fitbs);
    }
    
    setInitialWords(words.slice().sort());

    setLoading(true);
    fetchWords().then(() => {
      setLoading(false);
    });

  }, [words])

  useEffect(() => {
    setEachHeight(window.innerHeight - 400);
  }, [window.innerHeight])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("words"))
    {
      setWords(
        decodeURI(new URLSearchParams(window.location.search).get("words")).split(",").map((word) => word.trim())
      );
    }
  }, [])

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
            setWords(read.result.replace((/  |\t|\r/gm),"").toLowerCase().split("\n"));
          }
        }}
        style={{backgroundColor: "#2d2d2d", color: "#fff", borderRadius: 15, height: 150}}
        acceptedExtensions={[".txt"]}
        disabledRemoveButton
        /></> : loading ? <div style={{backgroundImage: "url('https://shortpixel.com/img/spinner2.gif')", width: "140px", height: "140px", color: "white"}}><p style={{paddingTop: 160}}>Loading... <br/> (Sorry for bad UI)</p></div> : <div style={{width: "100%", justifyContent: "center", height: zen ? eachHeight : "100%", overflow: (zen ? "hidden" : "show")}}>
          {sharing && <div style={{width: "100%", marginBottom: 25, height: "80%", borderRadius: 25, backgroundColor: "#202020"}}>
            {/* <p style={{paddingTop: 15, fontSize: 25, textAlign: "center", width: "100%"}}>Link To This Set</p> */}
            <input style={{width: "100%", padding: 20, backgroundColor: "#303030", color: "white", border: "none", borderTopLeftRadius: 25, borderTopRightRadius: 25}} label="Link" value={window.location.href} />
            <button style={{margin: 20, borderRadius: 15, border: "none", padding: 10}} onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setSharing(false);
              alert("Copied to clipboard!");
            }}>Copy</button>
            <button style={{backgroundColor: "#202020", color: "white", margin: 20, borderRadius: 15, border: "none", padding: 10}} onClick={() => {
              setSharing(false);
            }}>Close</button>
          </div>}
          {true && <div style={{width: "100%", height: "80%", borderRadius: 25, padding: 15, backgroundColor: "#202020", flexDirection: "row", flex: 1}}>
            <details style={{paddingTop: 15, fontSize: 25, textAlign: "center", width: "100%"}}>
              <summary><MDBIcon icon="university" className="me-2" />Word Bank</summary>
              <div style={{width: "100%", height: 500, overflow: "scroll", overflowX: "hidden"}}>
              {!define && initialWords.map((word) => <WordbankCard setDefine={setDefine} word={word} words={words}/>)}
              {define && <div>
                <a style={{backgroundColor: "#000", paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 20}} onClick={() => {
                  setDefine("");
                }}>
                  <MDBIcon style={{display: "inline", color: "#ff9494"}} icon="times" size='xs'/>
                  <p style={{paddingInlineStart: 5, display: "inline", color: "#ff9494", fontSize: 16}}> Back To List</p>
                </a>
                <iframe style={{width: "100%", height: 500, border: "none"}} src={`https://www.bing.com/search?q=define ${define}`}></iframe>
              </div>}
              </div>
            </details>
          </div>}
          {/* <MDBBtn onClick={() => {
            setZen(!zen);
            setSharing(false);
            // setShowWordBank(false);
          }} style={{position: "fixed", right: 25, bottom: 25,  backgroundColor: (zen ? "#2d2d2d" : "#fff"), color: (!zen ? "#2d2d2d" : "#fff"), borderRadius: 15, height: 50, width: 150, boxShadow: "none", zIndex: 1}}><MDBIcon icon="sun" className="me-2" />Zen Mode</MDBBtn> */}
          <MDBBtn onClick={() => {
            setZen(false);
            setSharing(!sharing)
          }} style={{position: "fixed", right: 25, bottom: 25,  backgroundColor: (sharing ? "#2d2d2d" : "#fff"), color: (!sharing ? "#2d2d2d" : "#fff"), borderRadius: 15, height: 50, width: 150, boxShadow: "none", zIndex: 1}}><MDBIcon icon="share" className="me-2" />Share List</MDBBtn>
          {exampled.map((example, index) => {
            if (words[index] === "")
            {
              return <></>;
            }
            return <WordCard words={words} setWords={setWords} example={example} word={words[index]} key={example + words[index]}/>
          })}
        </div>}
    </MDBContainer>
  );
}

export default App;

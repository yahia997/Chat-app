import React, {useEffect, useState, useRef} from "react";

import notificationTone from "./Whatsapp.mp3";

import { io } from "socket.io-client";
import axios from "axios";

// css files
import "./content.css";
import "./login.css";

const audio = new Audio(notificationTone);

const Colours = ["#ed423f", "#0d6efd", "#6610f2", "#6f42c1", "#d63384", "#dc3545", "#fd7e14",
"#ffc107", "#198754", "#20c997", "#0dcaf0"];
const C = Colours[Math.floor(Math.random() * Colours.length)];

const socket = io();

socket.on('message', text => {
  let elem = document.getElementById("p");

  if (elem) {
    if (text.endsWith("www@$WWW_gtav5532759")) {
      elem.innerHTML += `<div class="joined bg-transparent my-2">
        <p class="fw-bold text-center px-4 py-2 m-0">${text.replace("www@$WWW_gtav5532759", "")}</p>
      </div>`;
    } else {
      
      elem.innerHTML += `<div class="mess p-2 my-2">
      <div class="d-flex py-1">
      <span class="d-block pe-3" style="color: ${text.split(" => ")[2]}">${ text.split(" => ")[0] }</span>
            <small class="d-flex align-items-center">${new Date().toLocaleString()}</small>
            </div>
          <p>${text.split(" => ")[1]}</p>
        </div>`;
        
        audio.play();
    }


    elem.scrollTo(0, 999999999999999);
  }
});

function submit(name) {
  socket.emit("send-nickname", name);
  document.getElementById("login").classList.add("d-none");
}


function Content() {
  const [name, setName] = useState("");
  const [m, setM] = useState("");
  const p = useRef(null);
  
  function send() {
    socket.emit('message', `${m} => ${C}`);
    setM("");
    document.getElementById("textarea").focus();

    axios.post('/add', {
      name: name,
      text: m,
      date: new Date().toLocaleString(),
      colour: C
    });

  }

  useEffect(() => {
    p.current.style.height = `${window.innerHeight - 125}px`;

    fetch("/all")
      .then(res => res.json())
      .then(data => {
        let elem = document.getElementById("p");
        
        for (let i = 0; i < data.length; i++) {
          elem.innerHTML += `<div class="mess p-2 my-2">
            <div class="d-flex py-1">
            <span class="d-block pe-3" style="color: ${data[i].colour}">${data[i].name}</span>
            <small class="d-flex align-items-center">${data[i].date}</small>
            </div>
            <p>${data[i].text}</p>
          </div>`;
        }

        elem.scrollTo(0, 999999999999999);
      });
    
  }, []);

  return <>
  <section className="container">
    <div className="row p-0">
      <div className="col-12 overflow-auto ps-0" ref={p} id="p"></div>
    </div>
  </section>
    <section className="container-fluid options py-5 w-100">
      <div className="container">
        <div className="row">
          <button className="col-1 emoji-btn py-1"
            onClick={() => setM(m + "😂")}>😂</button>
          <textarea type="text"
            value={m}
            autoComplete="off"
            className="col-9 py-2"
            placeholder="Send message"
            id="textarea"
            onChange={(e) => setM(e.target.value)}></textarea>

          <button onClick={() => send()}
            className="col-2 py-2 fw-bold"
            disabled={m === "" ? true : false}
          >send</button>
        </div>
      </div>
    </section>
    <section className="container-fluid login" id="login">
      <section className="container">
        <form className="row justify-contnet-center my-5" onSubmit={(e) => {
          e.preventDefault();
          submit(name);
        }}>
          <label htmlFor="userName" className="pt-1">User Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-name col-12 py-2"
            id="userName"
            autoComplete="off"
          />
          <button
            type="submit"
            className="mt-5 discord-button py-2 fw-bold"
            disabled={name.length === 0 ? true : false}
          >Join</button>
        </form>
      </section>
    </section>
  </> 
}

export { Content };
